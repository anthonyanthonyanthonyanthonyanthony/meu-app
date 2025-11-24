import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import styles from "../styles";
import { useTrips } from "../context/TripsContext";

type Props = {
  user: string | null;
  onBack: () => void;
};

export default function CameraScreen({ onBack, user }: Props) {
  const { addTrip } = useTrips();

  const [facing, setFacing] = useState<"front" | "back">("back");
  const [torchLigado, setTorchLigado] = useState(false);
  const [zoom, setZoom] = useState(0);

  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [localName, setLocalName] = useState("");
  const [currentLocation, setCurrentLocation] = useState<any>(null);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [galleryPermission, requestGalleryPermission] = MediaLibrary.usePermissions();

  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!galleryPermission?.granted) {
      requestGalleryPermission();
    }
  }, [galleryPermission]);

  if (!cameraPermission) return <View style={styles.container} />;

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={[styles.mensagem, { textAlign: 'center', paddingBottom: 10 }]}>
          Precisamos da sua permissão para acessar a câmera
        </Text>

        <TouchableOpacity onPress={requestCameraPermission} style={localStyles.botaoPerm}>
          <Text style={localStyles.textoPerm}>Conceder permissão</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onBack} style={localStyles.botaoPermCinza}>
          <Text style={localStyles.textoPerm}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function tirarFoto() {
    try {
      const camera = cameraRef.current;
      if (!camera) return;

      const foto = await camera.takePictureAsync({
        quality: 0.5,
      });

      let loc = await Location.getLastKnownPositionAsync();

      if (!loc) {
        loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Low,
        });
      }

      setCurrentLocation(loc);
      setPreviewUri(foto.uri);

    } catch (e) {
      Alert.alert("Erro", "Não foi possível tirar a foto.");
    }
  }

  async function salvarViagem() {
    if (!previewUri || !currentLocation) return;

    if (!localName.trim()) {
      Alert.alert("Atenção", "Dê um nome ao local visitado.");
      return;
    }

    try {
      await MediaLibrary.saveToLibraryAsync(previewUri);

      addTrip({
        user: user ?? "desconhecido",
        nomeLocal: localName,
        fotoUri: previewUri,
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        data: new Date().toISOString(),
      });

      Alert.alert("Sucesso", "Viagem registrada!");

      setPreviewUri(null);
      setLocalName("");
      onBack();

    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar a viagem.");
    }
  }

  function refazerFoto() {
    setPreviewUri(null);
    setLocalName("");
  }

  function alternarCamera() {
    setFacing(prev => (prev === "back" ? "front" : "back"));
  }

  function alternarFlash() {
    setTorchLigado(t => !t);
  }

  if (previewUri) {
    return (
      <View style={{ flex: 1, backgroundColor: "black" }}>
        <Image source={{ uri: previewUri }} style={{ flex: 1, resizeMode: "contain" }} />

        <TextInput
          placeholder="Nome do local visitado..."
          placeholderTextColor="#ccc"
          style={localStyles.input}
          value={localName}
          onChangeText={setLocalName}
        />

        <View style={localStyles.previewButtons}>
          <TouchableOpacity style={localStyles.botaoPreview} onPress={refazerFoto}>
            <Text style={localStyles.botaoPreviewTexto}>Refazer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={localStyles.botaoPreviewSalvar} onPress={salvarViagem}>
            <Text style={localStyles.botaoPreviewTexto}>Salvar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1, width: "100%", height: "100%" }}
        facing={facing}
        mode="picture"
        enableTorch={torchLigado}
        zoom={zoom}
      />

      <View style={localStyles.zoomBox}>
        <Text style={{ color: 'white', marginBottom: 5 }}>Zoom: {zoom.toFixed(2)}</Text>
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={0}
          maximumValue={1}
          value={zoom}
          onValueChange={(v) => setZoom(v)}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#888"
        />
      </View>

      <View style={localStyles.areaBotoes}>
        <TouchableOpacity style={localStyles.botao} onPress={alternarCamera}>
          <Text style={localStyles.textoBotao}>Virar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={localStyles.botao} onPress={tirarFoto}>
          <Text style={localStyles.textoBotao}>Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={localStyles.botao} onPress={alternarFlash}>
          <Text style={localStyles.textoBotao}>{torchLigado ? "Flash ON" : "Flash OFF"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[localStyles.botao, { backgroundColor: '#777' }]} onPress={onBack}>
          <Text style={localStyles.textoBotao}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  botaoPerm: {
    padding: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    marginBottom: 10,
  },
  botaoPermCinza: {
    padding: 12,
    backgroundColor: "#777",
    borderRadius: 8,
  },
  textoPerm: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },

  input: {
    backgroundColor: "#222",
    color: "white",
    fontSize: 18,
    padding: 12,
    margin: 10,
    borderRadius: 8,
    borderColor: "#444",
    borderWidth: 1,
  },

  areaBotoes: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingHorizontal: 32,
  },

  botao: {
    alignItems: 'center',
    backgroundColor: '#00000088',
    padding: 12,
    borderRadius: 8,
  },

  textoBotao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },

  zoomBox: {
    position: 'absolute',
    top: 40,
    width: '100%',
    alignItems: 'center',
  },

  previewButtons: {
  flexDirection: "row",
  justifyContent: "space-around",
  paddingVertical: 20,
  paddingBottom: 40,
  marginBottom: 25,
  backgroundColor: "#000000aa",
},

botaoPreview: {
  backgroundColor: "#ff4444",
  paddingVertical: 14,
  paddingHorizontal: 24,
  borderRadius: 12,
},

botaoPreviewSalvar: {
  backgroundColor: "#00c851",
  paddingVertical: 14,
  paddingHorizontal: 24,
  borderRadius: 12,
},

botaoPreviewTexto: {
  color: "white",
  fontSize: 20,
  fontWeight: "bold",
}
});
