import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import PlacesScreen from "./PlacesScreen";
import MapScreen from "./MapScreen";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";

const Stack = createStackNavigator();

// Luo navigointi komponentti
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Aseta "Login" näyttö "LoginScreen" komponentille */}
        <Stack.Screen name="Login" component={LoginScreen} />
        {/* Aseta "Register" näyttö "RegisterScreen" komponentille */}
        <Stack.Screen name="Register" component={RegisterScreen} />
        {/* Aseta "My Places" näyttö "PlacesScreen" komponentille */}
        <Stack.Screen name="My Places" component={PlacesScreen} />
        {/* Aseta "Map" näyttö "MapScreen" komponentille */}
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
