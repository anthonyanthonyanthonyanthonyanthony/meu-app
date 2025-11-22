import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch } from "react-native";
import styles from "../styles";

export default function LoginScreen({
  onLogin,
}: {
  onLogin: (username: string, remember: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [remember, setRemember] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.rememberRow}>
        <Switch value={remember} onValueChange={setRemember} />
        <Text style={styles.rememberText}>Lembrar</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => onLogin(email || "Usuário", remember)}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}
