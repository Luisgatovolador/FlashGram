import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation, route }) {
  const { email } = route.params || {};

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido!</Text>
      <Text style={styles.subtitle}>Correo: {email}</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, marginBottom: 30 },
  button: { backgroundColor: "#dc3545", padding: 12, borderRadius: 8, width: "60%", alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
