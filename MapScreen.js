import React from 'react';
import { StyleSheet, View, Text, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Button } from "@rneui/themed";

const MapScreen = ({ route }) => {
  const { address } = route.params;
  const [region, setRegion] = React.useState(null);
  const [locationFound, setLocationFound] = React.useState(true);

  React.useEffect(() => {
    // Haetaan osoitteen koordinaatit Nominatim-palvelusta
    fetch(`https://nominatim.openstreetmap.org/search?q=${address}&format=json`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const result = data[0];
          setRegion({
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon),
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        } else {
          setLocationFound(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setLocationFound(false);
      });
  }, [address]);

  const handleEmailButtonPress = () => {
    const emailSubject = 'Sijainti';
    const emailBody = `Osoite: ${address}\nKoordinaatit: ${region.latitude}, ${region.longitude}`;

    Linking.openURL(`mailto:?subject=${emailSubject}&body=${emailBody}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {region ? (
          <MapView
            style={styles.map}
            region={region}
            initialRegion={region}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            <Marker coordinate={region} title={address} />
          </MapView>
        ) : (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>
              {locationFound ? 'Ladataan karttaa...' : 'Osoitetta ei löytynyt.'}
            </Text>
          </View>
        )}
      </View>

      {region && (
        <View style={styles.buttonContainer}>
          <Button raised
          icon={{
            name: "mail",
          }} title="Lähetä osoite" onPress={handleEmailButtonPress} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginVertical: 20,
  },
});

export default MapScreen;
