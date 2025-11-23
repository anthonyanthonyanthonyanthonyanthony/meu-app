import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./src/styles";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import CameraScreen from "./src/screens/CameraScreen";
import CalendarScreen from "./src/screens/CalendarScreen";
import MapScreen from "./src/screens/MapScreen";

type Screen = "login" | "register" | "main" | "camera" | "calendar" | "map";

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [user, setUser] = useState<string | null>(null);

  // Auto login (lembrar)
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("@meuapp:user");
      if (saved) {
        setUser(saved);
        setScreen("main");
      }
    })();
  }, []);

  // LOGIN 
  if (screen === "login") {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <LoginScreen
          onLogin={async (usuario, senha, remember) => {
            const stored = await AsyncStorage.getItem("@meuapp:users");
            const users = stored ? JSON.parse(stored) : [];

            const found = users.find(
              (u: any) => u.usuario === usuario && u.senha === senha
            );

            if (!found) {
              Alert.alert("Erro", "Usuário ou senha incorretos.");
              return;
            }

            setUser(usuario);

            if (remember) {
              await AsyncStorage.setItem("@meuapp:user", usuario);
            }

            setScreen("main");
          }}
          onGoToRegister={() => setScreen("register")}
        />
      </SafeAreaView>
    );
  }

  // REGISTRO
  if (screen === "register") {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <RegisterScreen
          onBack={() => setScreen("login")}
          onRegister={() => setScreen("login")}
        />
      </SafeAreaView>
    );
  }

  // OUTRAS TELAS
  if (screen === "camera") return <CameraScreen onBack={() => setScreen("main")} />;
  if (screen === "calendar") return <CalendarScreen onBack={() => setScreen("main")} />;
  if (screen === "map") return <MapScreen onBack={() => setScreen("main")} />;

  // PRINCIPAL
  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>App Integrado — Olá, {user}</Text>

        <TouchableOpacity style={styles.button} onPress={() => setScreen("camera")}>
          <Text style={styles.buttonText}>Abrir Câmera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setScreen("calendar")}>
          <Text style={styles.buttonText}>Abrir Calendário</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setScreen("map")}>
          <Text style={styles.buttonText}>Abrir Mapa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#888" }]}
          onPress={async () => {
            await AsyncStorage.removeItem("@meuapp:user");
            setUser(null);
            setScreen("login");
          }}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
