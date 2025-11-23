import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Slider from '@react-native-community/slider';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import styles from "../styles";

export default function CameraScreen({ onBack }: { onBack: () => void }) {
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [torchLigado, setTorchLigado] = useState(false);

  // 🔥 zoom virtual 0 → 4
  const [zoomVirtual, setZoomVirtual] = useState(0);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [galleryPermission, requestGalleryPermission] = MediaLibrary.usePermissions();

  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!galleryPermission?.granted) {
      requestGalleryPermission();
    }
  }, [galleryPermission]);

  if (!cameraPermission) {
    return <View style={styles.container} />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={[styles.mensagem, { textAlign: 'center', paddingBottom: 10 }]}>
          Precisamos da sua permissão para acessar a câmera
        </Text>
        <Button onPress={requestCameraPermission} title="Conceder permissão" />
        <Button title="Voltar" onPress={onBack} />
      </View>
    );
  }

  async function tirarFoto() {
    try {
      const camera = cameraRef.current;
      if (!camera) return;

      const foto = await camera.takePictureAsync();

      if (foto?.uri) {
        try {
          await MediaLibrary.saveToLibraryAsync(foto.uri);
          Alert.alert('Foto salva!', 'A imagem foi salva na galeria.');
        } catch {
          Alert.alert("Foto capturada", `URI da imagem: ${foto.uri}`);
        }
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não foi possível tirar a foto.");
    }
  }

  function alternarCamera() {
    setFacing(prev => (prev === "back" ? "front" : "back"));
  }

  function alternarFlash() {
    setTorchLigado(t => !t);
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1, width: "100%", height: "100%" }}
        facing={facing}
        mode="picture"
        enableTorch={torchLigado}

        // 🎯 zoom REAL = virtual / 4
        zoom={zoomVirtual / 4}
      />

      {/* Zoom slider */}
      <View style={localStyles.zoomBox}>
        <Text style={{ color: 'white', marginBottom: 5 }}>
          Zoom: {zoomVirtual.toFixed(2)}x
        </Text>

        <Slider
          style={{ width: 220, height: 40 }}
          minimumValue={0}
          maximumValue={4}
          step={0.01}
          value={zoomVirtual}
          onValueChange={(value: number) => setZoomVirtual(value)}
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
          <Text style={localStyles.textoBotao}>
            {torchLigado ? "Flash ON" : "Flash OFF"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[localStyles.botao, { backgroundColor: '#777' }]}
          onPress={onBack}
        >
          <Text style={localStyles.textoBotao}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
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
});
