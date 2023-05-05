import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const auth = getAuth();

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert("Salasanat eivät täsmää!");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Rekisteröityminen onnistui, siirry takaisin kirjautumissivulle
        navigation.navigate("Login");
      })
      .catch((error) => {
        // Rekisteröityminen epäonnistui, näytä virheilmoitus
        alert(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rekisteröidy</Text>
      <TextInput
        style={styles.input}
        placeholder="Sähköpostiosoite"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={(value) => setEmail(value)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Salasana"
        secureTextEntry={true}
        onChangeText={(value) => setPassword(value)}
        value={password}
      />
      <TextInput
        style={styles.input}
        placeholder="Vahvista salasana"
        secureTextEntry={true}
        onChangeText={(value) => setConfirmPassword(value)}
        value={confirmPassword}
      />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Rekisteröidy</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
  },
  registerButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginTop: 10,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
