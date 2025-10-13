import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, useColorScheme, Image 
} from "react-native";
import { API_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const colorScheme = useColorScheme();

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
        navigation.replace("Verpost", { email });
      } else {
        Alert.alert("Error", data.message || "Credenciales inválidas");
      }
    } catch (err) {
      Alert.alert("Error", "No se pudo conectar con el servidor");
    }
  };

  const themeColors = {
    light: { background: "#f2f2f7", text: "#111", button: "#007bff", link: "#007bff", inputBackground: "#fff" },
    dark: { background: "#121212", text: "#fff", button: "#1e90ff", link: "#1e90ff", inputBackground: "#1e1e1e" },
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

      <Text style={[styles.title, { color: colors.text }]}>Iniciar Sesión</Text>

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
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={[styles.link, { color: colors.link }]}>¿No tienes cuenta? Regístrate</Text>
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
    borderRadius: 50, // hace el logo circular
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
