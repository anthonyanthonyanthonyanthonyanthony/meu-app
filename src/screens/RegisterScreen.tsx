import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import styles from "../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterScreen({
  onRegister,
  onBack,
}: {
  onRegister: (usuario: string, senha: string) => void;
  onBack: () => void;
}) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [confSenha, setConfSenha] = useState("");

  async function registrar() {
    if (!usuario || !senha || !confSenha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (senha !== confSenha) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    const stored = await AsyncStorage.getItem("@meuapp:users");
    let users = stored ? JSON.parse(stored) : [];

    const exists = users.some((u: any) => u.usuario === usuario);

    if (exists) {
      Alert.alert("Erro", "Este usuário já está cadastrado.");
      return;
    }

    users.push({ usuario, senha });

    await AsyncStorage.setItem("@meuapp:users", JSON.stringify(users));

    Alert.alert("Conta criada!", "Agora faça login.");
    onRegister(usuario, senha);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={usuario}
        onChangeText={setUsuario}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        secureTextEntry
        value={confSenha}
        onChangeText={setConfSenha}
      />

      <TouchableOpacity style={styles.button} onPress={registrar}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ marginTop: 15 }} onPress={onBack}>
        <Text style={{ color: "#007AFF" }}>Voltar ao login</Text>
      </TouchableOpacity>
    </View>
  );
}
