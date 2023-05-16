import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { initializeApp } from "firebase/app";
import { getDatabase, push, remove, ref, onValue } from "firebase/database";
import { TextInput } from "react-native";
import { set, push as pushToDatabase } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { Header } from "@rneui/themed";
import { Icon } from "@rneui/themed";
import { Input, Button } from "@rneui/themed";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  // Firebase-konfiguraatio
  apiKey: "AIzaSyCo0rl8gAtcigJtZeAzFuUQHq_GxUNKorw",
  authDomain: "osoitekirja-90710.firebaseapp.com",
  databaseURL:
    "https://osoitekirja-90710-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "osoitekirja-90710",
  storageBucket: "osoitekirja-90710.appspot.com",
  messagingSenderId: "784034301711",
  appId: "1:784034301711:web:60599500fe97dd8bf4e07a",
};

const app = initializeApp(firebaseConfig);

const PlacesScreen = () => {
  const [places, setPlaces] = useState([]);
  const [newPlace, setNewPlace] = useState({
    address: "",
  });
  const navigation = useNavigation();
  const auth = getAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Haetaan tiedot Firebase-tietokannasta
    const db = getDatabase();
    const authListener = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        const userId = user.uid;
        const userPlacesRef = ref(db, `users/${userId}/places`);
        onValue(userPlacesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setPlaces(Object.values(data));
          } else {
            setPlaces([]);
          }
        });
      } else {
        setUser(null);
        setPlaces([]);
      }
    });

    return () => {
      // Poistetaan auth-kuuntelija komponentin purkautuessa
      authListener();
    };
  }, []);

  const handleSave = () => {
    if (!user) {
      Alert.alert("Virhe", "Kirjaudu sisään tallentaaksesi paikan.");
      return;
    }

    const db = getDatabase();
    const userId = user.uid;
    const userPlacesRef = ref(db, `users/${userId}/places`);
    const newPlaceRef = pushToDatabase(userPlacesRef, newPlace);
    set(newPlaceRef, {
      id: newPlaceRef.key,
      ...newPlace,
    });
    setNewPlace({ address: "" });
  };

  const handleLongPress = (placeId) => {
    Alert.alert("Poista paikka", "Haluatko varmasti poistaa tämän paikan?", [
      {
        text: "Peruuta",
        style: "cancel",
      },
      {
        text: "Poista",
        style: "destructive",
        onPress: () => {
          if (!user) {
            Alert.alert("Virhe", "Kirjaudu sisään poistaaksesi paikan.");
            return;
          }

          const db = getDatabase();
          const userId = user.uid;
          const placeRef = ref(db, `users/${userId}/places/${placeId}`);
          remove(placeRef);
        },
      },
    ]);
  };

  const handlePressPlace = (place) => {
    navigation.navigate("Map", { address: place.address });
  };

  return (
    <View>
      <View>
        <Input
          placeholder="Syötä osoite"
          value={newPlace.address}
          onChangeText={(text) => setNewPlace({ ...newPlace, address: text })}
        />
        <Button
          raised
          icon={{
            name: "save",
          }}
          title="Tallenna"
          onPress={handleSave}
        />
      </View>
      {places &&
        places.map((place) => (
          <TouchableOpacity
            key={place.id}
            onLongPress={() => handleLongPress(place.id)}
            onPress={() => handlePressPlace(place)}
          >
            <View>
              <Text style={{ marginBottom: 5, marginTop: 5 }}>
                {place.address}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
};

export default PlacesScreen;
