import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import styles from "../styles";

export default function CameraScreen({ onBack }: { onBack: () => void }) {
  const [facing, setFacing] = useState<"front" | "back">("back");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [galleryPermission, requestGalleryPermission] = MediaLibrary.usePermissions();

  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!galleryPermission) requestGalleryPermission();
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
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={{ flex: 1 }}
        facing={facing}
        ref={cameraRef}
      />

      <View style={localStyles.areaBotoes}>
        <TouchableOpacity style={localStyles.botao} onPress={alternarCamera}>
          <Text style={localStyles.textoBotao}>Virar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={localStyles.botao} onPress={tirarFoto}>
          <Text style={localStyles.textoBotao}>Tirar Foto</Text>
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
});
