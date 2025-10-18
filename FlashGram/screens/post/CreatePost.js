import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  useColorScheme,
  SafeAreaView,
} from "react-native";
import { Camera, useCameraDevices } from "react-native-vision-camera";
import { API_URL, UNSPLASH_KEY, OPENAI_KEY } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function CreatePost({ navigation }) {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const cameraRef = useRef(null);

  const colors = {
    light: {
      background: "#f2f2f7",
      card: "#fff",
      text: "#111",
      inputBg: "#fff",
      inputText: "#111",
      icon: "#007bff",
    },
    dark: {
      background: "#121212",
      card: "#1e1e1e",
      text: "#fff",
      inputBg: "#1e1e1e",
      inputText: "#fff",
      icon: "#1e90ff",
    },
  };

  const theme = colorScheme === "dark" ? colors.dark : colors.light;

  const takePhoto = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.7, base64: false };
      const data = await cameraRef.current.takePictureAsync(options);
      setImage({ uri: data.uri, fileName: "photo.jpg", type: "image/jpeg" });
    }
  };

  const fetchUnsplashImage = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://api.unsplash.com/photos/random?client_id=${UNSPLASH_KEY}`);
      const data = await res.json();
      if (data?.urls) setImage({ uri: data.urls.small, fileName: "unsplash.jpg", type: "image/jpeg" });
    } catch (error) {
      console.error("Error Unsplash:", error);
      Alert.alert("Error al obtener imagen de Unsplash");
    } finally {
      setLoading(false);
    }
  };

  const generateDescription = async () => {
    if (!image) return Alert.alert("Primero selecciona una imagen");

    try {
      setLoading(true);
      const prompt = "Crea una descripción breve y atractiva para una foto tipo Instagram.";
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${OPENAI_KEY}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Eres un asistente creativo que describe fotos para redes sociales." },
            { role: "user", content: prompt },
          ],
        }),
      });

      const data = await res.json();
      const description = data?.choices?.[0]?.message?.content;
      if (description) setCaption(description);
    } catch (error) {
      console.error("Error OpenAI:", error);
      Alert.alert("Error al generar descripción");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!image) return Alert.alert("Selecciona una imagen primero");

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return Alert.alert("Error", "Inicia sesión nuevamente.");

      const formData = new FormData();
      formData.append("image", {
        uri: Platform.OS === "ios" ? image.uri.replace("file://", "") : image.uri,
        name: image.fileName || "photo.jpg",
        type: image.type || "image/jpeg",
      });
      formData.append("caption", caption);

      const res = await fetch(`${API_URL}/api/create`, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData });
      const data = await res.json();

      if (res.ok) {
        Alert.alert("✅ Publicación creada correctamente");
        navigation.navigate("Feed");
      } else {
        console.error("Error backend:", data);
        Alert.alert("Error", data.message || "No se pudo crear la publicación");
      }
    } catch (error) {
      console.error("Error de red:", error);
      Alert.alert("Error al crear la publicación");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <RNCamera
        ref={cameraRef}
        style={styles.cameraPreview}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
      />

      {/* Previsualización si se tomó o eligió imagen */}
      {image && <Image source={{ uri: image.uri }} style={styles.preview} />}

      <ScrollView contentContainerStyle={{ alignItems: "center", paddingBottom: 150 }}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, color: theme.inputText }]}
          placeholder="Escribe una descripción..."
          placeholderTextColor={theme.inputText + "88"}
          value={caption}
          onChangeText={setCaption}
          multiline
        />

        {/* Barra de íconos abajo */}
        <View style={styles.iconBar}>
          <TouchableOpacity onPress={takePhoto}>
            <Ionicons name="camera-outline" size={40} color={theme.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={fetchUnsplashImage}>
            <Ionicons name="image-outline" size={40} color={theme.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={generateDescription}>
            <Ionicons name="robot-outline" size={40} color={theme.icon} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.submitButton, { backgroundColor: theme.icon }]} onPress={handleSubmit}>
          <Text style={[styles.submitText, { color: "#fff" }]}>Publicar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  cameraPreview: { width: "100%", height: 400 },
  preview: { width: 200, height: 200, borderRadius: 10, marginTop: 10 },
  input: { width: "90%", padding: 12, borderRadius: 10, marginVertical: 20, fontSize: 16 },
  iconBar: { flexDirection: "row", justifyContent: "space-around", width: "80%", marginVertical: 20 },
  submitButton: { padding: 15, borderRadius: 12, width: "90%", alignItems: "center", marginBottom: 50 },
  submitText: { fontSize: 16, fontWeight: "bold" },
});
