console.log(">>> Meu App.tsx ESTÁ SENDO EXECUTADO!");
import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./src/styles";
import LoginScreen from "./src/screens/LoginScreen";
import CameraScreen from "./src/screens/CameraScreen";
import CalendarScreen from "./src/screens/CalendarScreen";
import MapScreen from "./src/screens/MapScreen";

type Screen = "login" | "main" | "camera" | "calendar" | "map";

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("@meuapp:user");
      if (saved) {
        setUser(saved);
        setScreen("main");
      }
    })();
  }, []);

  if (screen === "login") {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <LoginScreen onLogin={(username, remember) => {
          setUser(username);
          if (remember) AsyncStorage.setItem("@meuapp:user", username);
          setScreen("main");
        }} />
      </SafeAreaView>
    );
  }

  if (screen === "camera") {
    return <CameraScreen onBack={() => setScreen("main")} />;
  }

  if (screen === "calendar") {
    return <CalendarScreen onBack={() => setScreen("main")} />;
  }

  if (screen === "map") {
    return <MapScreen onBack={() => setScreen("main")} />;
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>App Integrado — Olá{user ? `, ${user}` : ""}</Text>

        <TouchableOpacity style={styles.button} onPress={() => setScreen("camera")}>
          <Text style={styles.buttonText}>Abrir Câmera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setScreen("calendar")}>
          <Text style={styles.buttonText}>Abrir Calendário</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setScreen("map")}>
          <Text style={styles.buttonText}>Abrir Mapa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: "#888" }]} onPress={async () => {
          await AsyncStorage.removeItem("@meuapp:user");
          setUser(null);
          setScreen("login");
        }}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}