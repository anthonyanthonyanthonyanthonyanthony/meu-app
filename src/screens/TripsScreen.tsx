import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { useTrips } from "../context/TripsContext";

type Props = {
  user: string;
  onBack: () => void;
};

export default function TripsScreen({ user, onBack }: Props) {
  const { trips, clearTripsForUser, removeTrip, editTrip } = useTrips();

  const userTrips = trips.filter((t) => t.user === user);

  const [editVisible, setEditVisible] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  function openZoom(uri: string) {
    setZoomImage(uri);
    setZoomVisible(true);
  }

  function closeZoom() {
    setZoomVisible(false);
  }

  function formatDate(dateString: string) {
    const d = new Date(dateString);
    return d.toLocaleString("pt-BR");
  }

  function openEditModal(item: any) {
    setEditingId(item.id);
    setEditValue(item.nomeLocal);
    setEditVisible(true);
  }

  function confirmEdit() {
    if (!editingId) return;
    if (!editValue.trim()) return;

    editTrip(editingId, editValue.trim());
    setEditVisible(false);
  }

  return (
    <View style={styles.container}>

      <Modal visible={zoomVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.zoomBg}
          activeOpacity={1}
          onPress={closeZoom}
        >
          <Image
            source={{ uri: zoomImage! }}
            style={styles.zoomImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>

      <Modal transparent visible={editVisible} animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Editar nome</Text>

            <TextInput
              value={editValue}
              onChangeText={setEditValue}
              style={styles.modalInput}
            />

            <View style={styles.modalRow}>
  <TouchableOpacity
    style={styles.modalCancel}
    onPress={() => setEditVisible(false)}
  >
    <Text style={styles.modalCancelText}>Cancelar</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.modalSave} onPress={confirmEdit}>
    <Text style={styles.modalSaveText}>Salvar</Text>
  </TouchableOpacity>
</View>

          </View>
        </View>
      </Modal>

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>◀ Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Minhas Viagens</Text>

        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Confirmar",
              "Deseja apagar TODAS as suas viagens?",
              [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Apagar",
                  style: "destructive",
                  onPress: () => clearTripsForUser(user),
                },
              ]
            )
          }
        >
          <Text style={styles.clearText}>Limpar</Text>
        </TouchableOpacity>
      </View>

      {userTrips.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Nenhuma viagem registrada ainda.</Text>
        </View>
      ) : (
        <FlatList
          data={userTrips}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <View style={styles.card}>

                
                <TouchableOpacity onPress={() => openZoom(item.fotoUri)}>
                  <Image source={{ uri: item.fotoUri }} style={styles.image} />
                </TouchableOpacity>

                <View style={styles.info}>
                  <Text style={styles.local}>{item.nomeLocal}</Text>
                  <Text style={styles.data}>{formatDate(item.data)}</Text>
                  <Text style={styles.coord}>
                    Lat: {item.latitude.toFixed(5)}
                  </Text>
                  <Text style={styles.coord}>
                    Lng: {item.longitude.toFixed(5)}
                  </Text>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.editBtn}
                      onPress={() => openEditModal(item)}
                    >
                      <Text style={styles.editText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() =>
                        Alert.alert(
                          "Apagar viagem",
                          `Deseja apagar "${item.nomeLocal}"?`,
                          [
                            { text: "Cancelar", style: "cancel" },
                            {
                              text: "Apagar",
                              style: "destructive",
                              onPress: () => removeTrip(item.id),
                            },
                          ]
                        )
                      }
                    >
                      <Text style={styles.deleteText}>Apagar</Text>
                    </TouchableOpacity>
                  </View>

                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f3f3" },

  zoomBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  zoomImage: {
    width: "90%",
    height: "80%",
    borderRadius: 12,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 43,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    elevation: 3,
  },

  backBtn: { paddingVertical: 5 },
  backText: { fontSize: 16, color: "#007AFF" },
  title: { fontSize: 20, fontWeight: "bold" },

  clearText: { color: "red", fontSize: 15 },

  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
  },

  cardContainer: { width: "100%", alignItems: "center" },

  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    flexDirection: "row",
    elevation: 3,
    padding: 12,
    marginBottom: 20,
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 10,
    marginRight: 12,
  },

  info: { flex: 1, justifyContent: "center" },

  local: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  data: { color: "#444", marginBottom: 4 },
  coord: { fontSize: 12, color: "#777" },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    width: "100%",
  },

  editBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  editText: { color: "#fff", fontWeight: "bold" },

  deleteBtn: {
    backgroundColor: "#ff4444",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  deleteText: { color: "#fff", fontWeight: "bold" },

  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
  },
  emptyText: { fontSize: 17, color: "#666" },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  modalRow: {
  flexDirection: "row",
  justifyContent: "flex-end",
  marginTop: 15,
},

modalCancel: {
  backgroundColor: "#ff4444",
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 8,
  marginRight: 10,
},

modalCancelText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
},

  modalSave: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  modalSaveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
