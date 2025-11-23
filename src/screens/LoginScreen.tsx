import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch } from "react-native";
import styles from "../styles";

export default function LoginScreen({
  onLogin,
  onGoToRegister,
}: {
  onLogin: (usuario: string, senha: string, remember: boolean) => void;
  onGoToRegister: () => void;
}) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [remember, setRemember] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

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

      <View style={styles.rememberRow}>
        <Switch value={remember} onValueChange={setRemember} />
        <Text style={styles.rememberText}>Lembrar</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => onLogin(usuario, senha, remember)}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onGoToRegister} style={{ marginTop: 15 }}>
        <Text style={{ color: "#007AFF" }}>Criar uma conta</Text>
      </TouchableOpacity>
    </View>
  );
}
