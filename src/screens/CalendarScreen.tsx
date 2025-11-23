import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  Platform,
  FlatList,
  Modal,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Calendar from "expo-calendar";
import styles from "../styles";

export default function CalendarScreen({ onBack }: { onBack: () => void }) {
  const [idCalendario, setIdCalendario] = useState<string | null>(null);

  // Data e hora para novo evento
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [horaInicio, setHoraInicio] = useState(new Date());
  const [horaFim, setHoraFim] = useState(new Date());

  // Pickers visuais
  const [mostrarData, setMostrarData] = useState(false);
  const [mostrarHoraInicio, setMostrarHoraInicio] = useState(false);
  const [mostrarHoraFim, setMostrarHoraFim] = useState(false);

  // Eventos do dia
  const [eventosDoDia, setEventosDoDia] = useState<any[]>([]);

  // Modal de edição
  const [modalVisible, setModalVisible] = useState(false);
  const [eventoEditando, setEventoEditando] = useState<any>(null);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaData, setNovaData] = useState(new Date());
  const [novaHoraInicio, setNovaHoraInicio] = useState(new Date());
  const [novaHoraFim, setNovaHoraFim] = useState(new Date());

  // Permissões
  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Permita acesso ao calendário.");
        return;
      }
      const calendarios = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );
      if (calendarios.length > 0) {
        setIdCalendario(calendarios[0].id);
      }
    })();
  }, []);

  // Buscar eventos sempre que data mudar
  useEffect(() => {
    buscarEventosDoDia();
  }, [dataSelecionada, idCalendario]);

  async function buscarEventosDoDia() {
    if (!idCalendario) return;

    const inicio = new Date(dataSelecionada);
    inicio.setHours(0, 0, 0, 0);

    const fim = new Date(dataSelecionada);
    fim.setHours(23, 59, 59, 999);

    try {
      const eventos = await Calendar.getEventsAsync(
        [idCalendario],
        inicio,
        fim
      );
      setEventosDoDia(eventos);
    } catch (err) {
      console.log("Erro ao buscar eventos:", err);
    }
  }

  async function adicionarEvento() {
    if (!idCalendario) return;

    const inicio = new Date(dataSelecionada);
    inicio.setHours(horaInicio.getHours(), horaInicio.getMinutes());

    const fim = new Date(dataSelecionada);
    fim.setHours(horaFim.getHours(), horaFim.getMinutes());

    try {
      const idEvento = await Calendar.createEventAsync(idCalendario, {
        title: "Lembrar de revisar o projeto",
        startDate: inicio,
        endDate: fim,
        timeZone: "America/Sao_Paulo",
      });

      Alert.alert("Evento criado!", `ID: ${idEvento}`);
      buscarEventosDoDia();
    } catch (erro) {
      Alert.alert("Erro ao criar evento", String(erro));
    }
  }

  // --- EDITAR EVENTO ---
  function abrirModalEditar(evento: any) {
    setEventoEditando(evento);
    setNovoTitulo(evento.title);

    const data = new Date(evento.startDate);
    const inicio = new Date(evento.startDate);
    const fim = new Date(evento.endDate);

    setNovaData(data);
    setNovaHoraInicio(inicio);
    setNovaHoraFim(fim);

    setModalVisible(true);
  }

  async function salvarEdicao() {
    if (!eventoEditando) return;

    const inicio = new Date(novaData);
    inicio.setHours(novaHoraInicio.getHours(), novaHoraInicio.getMinutes());

    const fim = new Date(novaData);
    fim.setHours(novaHoraFim.getHours(), novaHoraFim.getMinutes());

    try {
      await Calendar.updateEventAsync(eventoEditando.id, {
        title: novoTitulo,
        startDate: inicio,
        endDate: fim,
      });

      Alert.alert("Atualizado!", "Evento alterado com sucesso.");
      setModalVisible(false);
      buscarEventosDoDia();
    } catch (err) {
      Alert.alert("Erro ao editar", String(err));
    }
  }

  async function apagarEvento(id: string) {
  Alert.alert(
    "Confirmar exclusão",
    "Tem certeza que deseja apagar este evento?",
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Apagar",
        style: "destructive",
        onPress: async () => {
          try {
            await Calendar.deleteEventAsync(id);
            Alert.alert("Excluído!", "Evento removido.");
            buscarEventosDoDia();
          } catch (err) {
            Alert.alert("Erro ao excluir", String(err));
          }
        },
      },
    ]
  );
}


  function formatarHora(h: Date) {
    return h.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <View style={[styles.container, { justifyContent: "center" }]}>
      <View style={styles.centerWrapper}></View>
      <Text style={styles.title}>Calendário</Text>

      <View style={local.boxInputs}>
        <Button title="Escolher data" onPress={() => setMostrarData(true)} />
        <Text style={local.info}>Data: {dataSelecionada.toLocaleDateString("pt-BR")}</Text>

        {mostrarData && (
          <DateTimePicker
            value={dataSelecionada}
            mode="date"
            display="calendar"
            onChange={(_, d) => {
              setMostrarData(false);
              if (d) setDataSelecionada(d);
            }}
          />
        )}

        <Button title="Horário início" onPress={() => setMostrarHoraInicio(true)} />
        <Text style={local.info}>Início: {formatarHora(horaInicio)}</Text>

        {mostrarHoraInicio && (
          <DateTimePicker
            value={horaInicio}
            mode="time"
            is24Hour={true}
            onChange={(_, d) => {
              setMostrarHoraInicio(false);
              if (d) setHoraInicio(d);
            }}
          />
        )}

        <Button title="Horário término" onPress={() => setMostrarHoraFim(true)} />
        <Text style={local.info}>Fim: {formatarHora(horaFim)}</Text>

        {mostrarHoraFim && (
          <DateTimePicker
            value={horaFim}
            mode="time"
            is24Hour={true}
            onChange={(_, d) => {
              setMostrarHoraFim(false);
              if (d) setHoraFim(d);
            }}
          />
        )}

        <Button title="Adicionar evento" onPress={adicionarEvento} />
        <View style={{ height: 10 }} />
        <Button title="Voltar" onPress={onBack} />
      </View>

      <Text style={[styles.title, { marginTop: 25, fontSize: 22 }]}>
        Eventos do dia
      </Text>

      <FlatList
        style={{ marginTop: 10, width: "100%" }}
        data={eventosDoDia}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={local.evento}>
            <Text style={local.titulo}>{item.title}</Text>
            <Text style={local.hora}>
              {new Date(item.startDate).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              →{" "}
              {new Date(item.endDate).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>

            <View style={local.botoesLinha}>
              <Button title="Editar" onPress={() => abrirModalEditar(item)} />
              <Button
  title="Apagar"
  color="#c00"
  onPress={() => apagarEvento(item.id)}
/>

            </View>
          </View>
        )}
      />

      {/* MODAL DE EDIÇÃO */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={local.modalFundo}>
          <View style={local.modalBox}>
            <Text style={styles.title}>Editar Evento</Text>

            <TextInput
              style={local.input}
              value={novoTitulo}
              onChangeText={setNovoTitulo}
              placeholder="Título"
            />

            <Button title="Alterar data" onPress={() => setMostrarData(true)} />
            <Text style={local.info}>
              {novaData.toLocaleDateString("pt-BR")}
            </Text>

            <Button
              title="Hora início"
              onPress={() => setMostrarHoraInicio(true)}
            />
            <Text style={local.info}>{formatarHora(novaHoraInicio)}</Text>

            <Button title="Hora fim" onPress={() => setMostrarHoraFim(true)} />
            <Text style={local.info}>{formatarHora(novaHoraFim)}</Text>

            <View style={{ height: 10 }} />

            <Button title="Salvar alterações" onPress={salvarEdicao} />
            <View style={{ height: 10 }} />
            <Button
              title="Excluir evento"
              color="#b00"
              onPress={() => {
                apagarEvento(eventoEditando.id);
                setModalVisible(false);
              }}
            />
            <View style={{ height: 10 }} />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const local = StyleSheet.create({
  boxInputs: {
    alignItems: "center",
    width: "100%",
  },
  info: {
    marginVertical: 8,
    fontSize: 16,
  },
  evento: {
    width: "90%",
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },
  titulo: {
    fontSize: 16,
    fontWeight: "bold",
  },
  hora: {
    color: "#444",
    marginBottom: 8,
  },
  botoesLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalFundo: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
});
