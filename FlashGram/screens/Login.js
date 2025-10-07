import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Error", "Todos los campos son obligatorios");

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        await AsyncStorage.setItem("token", data.token);
        navigation.replace("Home", { email });
      } else {
        Alert.alert("Error", data.message || "Credenciales inválidas");
      }
    } catch (err) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        placeholder="Correo electrónico"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Contraseña"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Aquí está el enlace para registrarse */}
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  input: { width: "100%", borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10 },
  button: { backgroundColor: "#007bff", padding: 12, borderRadius: 8, width: "100%", alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  link: { marginTop: 15, color: "#007bff" },
});
