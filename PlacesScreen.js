import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { initializeApp } from "firebase/app";
import { getDatabase, push, remove, ref, onValue } from "firebase/database";
import { TextInput, Button } from 'react-native';
import { set, push as pushToDatabase } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  databaseURL: "your-database-url",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);

const PlacesScreen = () => {
  const [places, setPlaces] = useState([]);
  const [newPlace, setNewPlace] = useState({
    address: '',
  });
  const navigation = useNavigation();

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

  const handlePressPlace = (place) => {
    navigation.navigate('Map', { address: place.address });
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
          <TouchableOpacity key={place.id} onLongPress={() => handleLongPress(place.id)} onPress={() => handlePressPlace(place)}>
            <View>
              <Text>{place.address}</Text>
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
}

export default PlacesScreen;
