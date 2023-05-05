import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

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

  return (
    <View style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  messageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MapScreen;
