import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./screens/auth/Login";
import Register from "./screens/auth/Register";
import VerPost from "./screens/post/VerPost";
import CreatePost from "./screens/post/CreatePost";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
         <Stack.Screen name="Verpost" component={VerPost} options={{ title: "Inicio" }} />
        <Stack.Screen name="CreatePost" component={CreatePost} options={{ title: "Nueva publicación" }} />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}
