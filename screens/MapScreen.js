import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

import { StyleSheet, Dimensions } from "react-native";
import { useSelector } from "react-redux";
import calculateDistance from "../distance";

export default function MapScreen() {
  const [currentPosition, setCurrentPosition] = useState({
    latitude: 0,
    longitude: 0,
  });
  const places = useSelector((state) => state.places.places);

  useEffect(() => {
    (async () => {
      const result = await Location.requestForegroundPermissionsAsync();
      const status = result?.status;

      if (status === "granted") {
        Location.watchPositionAsync({ distanceInterval: 10 }, (location) => {
          setCurrentPosition(location.coords);
        });
      }

      console.log(status);
    })();
  }, []);

  return (
    <MapView style={styles.map}>
      {currentPosition && (
        <Marker
          coordinate={{
            latitude: currentPosition.latitude,
            longitude: currentPosition.longitude,
          }}
          title="My position"
          pinColor="#48da75"
        />
      )}
      {places.map((place, index) => {
        console.log(currentPosition);
        console.log(place);
        const distance = calculateDistance(
          currentPosition.latitude,
          currentPosition.longitude,
          place.latitude,
          place.longitude
        );

        if (!isNaN(distance)) {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: place.latitude,
                longitude: place.longitude,
              }}
              title={place.title}
              description={`${Math.round(distance * 100) / 100}km`}
              pinColor="#48da75"
            />
          );
        }
      })}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
