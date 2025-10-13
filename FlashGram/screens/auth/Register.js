import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, useColorScheme, Image 
} from "react-native";
import { API_URL } from "@env";

export default function RegisterScreen({ navigation }) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const colorScheme = useColorScheme();

  const handleRegister = async () => {
    if (!displayName || !email || !password) return Alert.alert("Error", "Todos los campos son obligatorios");

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("✅ Cuenta creada", "Ya puedes iniciar sesión");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", data.message || "No se pudo registrar");
      }
    } catch (err) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  const themeColors = {
    light: { background: "#f2f2f7", text: "#111", button: "#28a745", link: "#007bff", inputBackground: "#fff" },
    dark: { background: "#121212", text: "#fff", button: "#1e7e34", link: "#1e90ff", inputBackground: "#1e1e1e" },
  };

  const colors = colorScheme === "dark" ? themeColors.dark : themeColors.light;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Logo circular */}
      <View style={styles.logoContainer}>
<Image 
  source={require("../../assets/logo2.png")} 
  style={styles.logo} 
/>

      </View>

      <Text style={[styles.title, { color: colors.text }]}>Crear Cuenta</Text>

      <TextInput
        placeholder="Nombre de usuario"
        placeholderTextColor={colors.text + "88"}
        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
        value={displayName}
        onChangeText={setDisplayName}
      />

      <TextInput
        placeholder="Correo electrónico"
        placeholderTextColor={colors.text + "88"}
        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Contraseña"
        placeholderTextColor={colors.text + "88"}
        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.button }]} 
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={[styles.link, { color: colors.link }]}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  
  logoContainer: {
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50, // circular
    resizeMode: "cover",
  },

  title: { fontSize: 32, fontWeight: "700", marginBottom: 20 },

  input: { 
    width: "100%", 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 15, 
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },

  button: { 
    width: "100%", 
    padding: 15, 
    borderRadius: 12, 
    alignItems: "center", 
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },

  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },

  link: { marginTop: 20, fontSize: 16 },
});
