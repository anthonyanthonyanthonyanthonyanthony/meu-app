import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import * as Calendar from "expo-calendar";
import styles from "../styles";

export default function CalendarScreen({ onBack }: { onBack: () => void }) {
  const [idCalendario, setIdCalendario] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "É necessário permitir o acesso ao calendário.");
        return;
      }
      const calendarios = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      if (calendarios.length > 0) {
        setIdCalendario(calendarios[0].id);
      } else {
        Alert.alert("Erro", "Nenhum calendário encontrado no dispositivo.");
      }
    })();
  }, []);

  async function adicionarEvento() {
    if (!idCalendario) {
      Alert.alert("Erro", "Nenhum calendário disponível.");
      return;
    }
    const dataInicio = new Date();
    const dataFim = new Date();
    dataFim.setHours(dataFim.getHours() + 1);
    try {
      const idEvento = await Calendar.createEventAsync(idCalendario, {
        title: "Lembrar de revisar o projeto",
        startDate: dataInicio,
        endDate: dataFim,
        notes: "Revisar código e enviar relatório",
        timeZone: "America/Sao_Paulo",
        location: "Escritório",
      });
      Alert.alert("Evento criado!", `ID do evento: ${idEvento}`);
    } catch (erro) {
      console.error("Erro ao criar evento:", erro);
      Alert.alert("Erro ao criar evento", String(erro));
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Anotar no Calendário</Text>
      <Button title="Adicionar evento de teste" onPress={adicionarEvento} />
      <View style={{ height: 12 }} />
      <Button title="Voltar" onPress={onBack} />
    </View>
  );
}
