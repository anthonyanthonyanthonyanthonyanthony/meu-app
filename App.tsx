import React, { useEffect, useState } from "react";
import { SafeAreaView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./src/styles";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import CameraScreen from "./src/screens/CameraScreen";
import MapScreen from "./src/screens/MapScreen";
import TripsScreen from "./src/screens/TripsScreen";

import { TripsProvider, useTrips } from "./src/context/TripsContext";

type Screen = "login" | "register" | "map" | "camera" | "trips";

function AppInner() {
  const [screen, setScreen] = useState<Screen>("login");
  const [user, setUser] = useState<string | null>(null);

  // 👉 Pega as viagens salvas no contexto
  const { trips } = useTrips();

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("@meuapp:user");
      if (saved) {
        setUser(saved);
        setScreen("map");
      }
    })();
  }, []);

  return (
    <>
      {screen === "login" && (
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

              setScreen("map");
            }}
            onGoToRegister={() => setScreen("register")}
          />
        </SafeAreaView>
      )}

      {screen === "register" && (
        <SafeAreaView style={styles.safeContainer}>
          <RegisterScreen
            onBack={() => setScreen("login")}
            onRegister={() => setScreen("login")}
          />
        </SafeAreaView>
      )}

      {screen === "camera" && (
        <CameraScreen user={user ?? ""} onBack={() => setScreen("map")} />
      )}

      {screen === "map" && (
        <MapScreen
          user={user}
          trips={trips}   // 👈 AGORA O MAPSCREEN RECEBE AS VIAGENS
          onLogout={async () => {
            await AsyncStorage.removeItem("@meuapp:user");
            setUser(null);
            setScreen("login");
          }}
          onOpenCamera={() => setScreen("camera")}
          onOpenTrips={() => setScreen("trips")}
        />
      )}

      {screen === "trips" && (
        <TripsScreen user={user ?? ""} onBack={() => setScreen("map")} />
      )}
    </>
  );
}

export default function App() {
  return (
    <TripsProvider>
      <AppInner />
    </TripsProvider>
  );
}
