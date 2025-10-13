import React, { useEffect, useState } from "react";
import { 
  View, Text, Image, FlatList, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, useColorScheme 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "@env";

export default function VerPost({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const colorScheme = useColorScheme(); // Detecta tema del sistema

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/posts`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.log("Error fetching posts:", err);
    }
  };

  const filteredPosts = posts.filter(
    post => post.caption.toLowerCase().includes(search.toLowerCase())
  );

  const colors = {
    light: {
      background: "#f2f2f7",
      card: "#fff",
      text: "#111",
      searchBg: "#fff",
      searchText: "#555",
      navBg: "#fff",
      icon: "#333",
      addButton: "#007bff",
    },
    dark: {
      background: "#121212",
      card: "#1e1e1e",
      text: "#fff",
      searchBg: "#1e1e1e",
      searchText: "#ccc",
      navBg: "#1e1e1e",
      icon: "#fff",
      addButton: "#1e90ff",
    },
  };

  const theme = colorScheme === "dark" ? colors.dark : colors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* Barra de búsqueda */}
      <View style={[styles.searchBar, { backgroundColor: theme.searchBg }]}>
        <Ionicons name="search" size={20} color={theme.searchText} style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Buscar publicaciones"
          placeholderTextColor={theme.searchText + "88"}
          value={search}
          onChangeText={setSearch}
          style={[styles.searchInput, { color: theme.text }]}
        />
      </View>

      {/* Lista de publicaciones */}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={[styles.post, { backgroundColor: theme.card }]}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.postFooter}>
              <Text style={[styles.caption, { color: theme.text }]}>{item.caption}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Barra de navegación inferior */}
      <View style={[styles.bottomNav, { backgroundColor: theme.navBg }]}>
        <TouchableOpacity onPress={() => navigation.navigate("VerPost")}>
          <Ionicons name="home-outline" size={30} color={theme.icon} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.addButton }]} 
          onPress={() => navigation.navigate("CreatePost")}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-outline" size={30} color={theme.icon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 25,
    height: 40,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 16 },

  post: {
    marginHorizontal: 10,
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  image: { width: "100%", height: 250 },
  postFooter: { padding: 10 },
  caption: { fontSize: 16 },

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: "#ccc",
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },
});
