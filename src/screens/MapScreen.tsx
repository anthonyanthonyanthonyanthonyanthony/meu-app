import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import styles from "../styles";

export default function MapScreen({
  user,
  onLogout,
  onOpenCamera,
  onOpenTrips,
}: any) {
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permissão de localização negada.");
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      setLoading(false);
    })();
  }, []);

  if (loading || !location) {
    return (
      <View style={styles.centered}>
        <Text>Obtendo localização...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* TOPO */}
      <View style={local.topBar}>
        <Text style={local.topUser}>Olá, {user}</Text>

        <TouchableOpacity style={local.logoutBtn} onPress={onLogout}>
          <Text style={local.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* MAPA */}
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* SOMENTE MARCADOR DO USUÁRIO */}
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="Você está aqui"
        />
      </MapView>

      {/* BOTÃO REGISTRAR VIAGEM */}
      <TouchableOpacity style={local.btnMain} onPress={onOpenCamera}>
        <Text style={local.btnMainText}>Registrar Viagem</Text>
      </TouchableOpacity>

      {/* BOTÃO MINHAS VIAGENS */}
      <TouchableOpacity
        style={[local.btnMain, { right: 20, left: undefined }]}
        onPress={onOpenTrips}
      >
        <Text style={local.btnMainText}>Minhas Viagens</Text>
      </TouchableOpacity>
    </View>
  );
}

const local = StyleSheet.create({
  topBar: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },

  topUser: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  logoutBtn: {
    backgroundColor: "#c00",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  logoutText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },

  btnMain: {
    position: "absolute",
    bottom: 40,
    left: 20,
    backgroundColor: "#000000cc",
    paddingVertical: 14,
    paddingHorizontal: 13,
    borderRadius: 10,
  },

  btnMainText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
});
