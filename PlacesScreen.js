import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { initializeApp } from "firebase/app";
import { getDatabase, push, remove, ref, onValue } from "firebase/database";
import { TextInput, Button } from 'react-native';
import { set, push as pushToDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCo0rl8gAtcigJtZeAzFuUQHq_GxUNKorw",
    authDomain: "osoitekirja-90710.firebaseapp.com",
    databaseURL: "https://osoitekirja-90710-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "osoitekirja-90710",
    storageBucket: "osoitekirja-90710.appspot.com",
    messagingSenderId: "784034301711",
    appId: "1:784034301711:web:9fb369ee40ea4871f4e07a"
  };

  const app = initializeApp(firebaseConfig);

  const PlacesScreen = () => {
    const [places, setPlaces] = useState([]);
    const [newPlace, setNewPlace] = useState({
      address: '',
    });
  
    useEffect(() => {
      // Fetch data from Firebase database
      const db = getDatabase();
      const placesRef = ref(db, 'places');
      onValue(placesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setPlaces(Object.values(data));
        } else {
          setPlaces([]);
        }
      });
    }, []);
  
    const handleSave = () => {
      const db = getDatabase();
      const newPlaceRef = pushToDatabase(ref(db, 'places'), newPlace);
      set(newPlaceRef, {
        id: newPlaceRef.key,
        ...newPlace,
      });
      setNewPlace({ address: '' });
    };
  
    const handleLongPress = (placeId) => {
      const db = getDatabase();
      const placeRef = ref(db, `places/${placeId}`);
      remove(placeRef);
    };
  
    return (
      <View>
        <View>
          <TextInput
            placeholder="Address"
            value={newPlace.address}
            onChangeText={(text) => setNewPlace({ ...newPlace, address: text })}
          />
          <Button title="Save" onPress={handleSave} />
        </View>
        {places &&
          places.map((place) => (
            <TouchableOpacity key={place.id} onLongPress={() => handleLongPress(place.id)}>
              <View>
                <Text>{place.address}</Text>
              </View>
            </TouchableOpacity>
          ))}
      </View>
    );
  }
  
  export default PlacesScreen;