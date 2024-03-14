import { StatusBar } from "expo-status-bar";
import { useState, useCallback, useRef, useEffect } from "react";

import { Ionicons } from "@expo/vector-icons";

import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { ScrollView } from "react-native";
import IconTextInput from "../IconText";
import { useDispatch, useSelector } from "react-redux";
import { addPlace, removePlace } from "../reducers/places";

export default function HomeScreen({ navigation }) {
  const [searchedCity, setSearchedCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [openList, setOpenList] = useState(false);
  const [touched, setTouched] = useState(false);
  const dispatch = useDispatch();
  const places = useSelector((state) => state.places?.places || []);

  const [suggestionsList, setSuggestionsList] = useState([]);
  const [selectedPlacesList, setSelectedPlacesList] = useState([]);

  const getSuggestions = useCallback(async (cityName) => {
    setTouched(false);
    setLoading(true);
    if (typeof cityName !== "string" || cityName.length < 3) {
      setSuggestionsList([]);
      return;
    }

    if (cityName.length >= 3) {
      setOpenList(true);
    } else {
      setOpenList(false);
    }

    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${cityName}`
    );
    const data = await response.json();

    console.log(data);

    const suggestions = data.features.map((feature) => ({
      id: feature.properties.city,
      title: feature.properties.city,
      context: feature.properties.context,
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
    }));

    suggestions.sort((a, b) => {
      // Compare the titles of suggestions
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();

      // Check if one of the titles starts with the searched city
      const startsWithA = titleA.startsWith(cityName.toLowerCase());
      const startsWithB = titleB.startsWith(cityName.toLowerCase());

      // If one starts with the search term and the other does not,
      // prioritize the one that starts with the search term
      if (startsWithA && !startsWithB) {
        return -1; // Place 'a' before 'b'
      } else if (!startsWithA && startsWithB) {
        return 1; // Place 'b' before 'a'
      }

      // If both start with the search term or neither starts with it,
      // use localeCompare to sort alphabetically
      return titleA.localeCompare(titleB);
    });

    setSuggestionsList(suggestions);

    setLoading(false);
  }, []);
  console.log(suggestionsList);

  const choosePlaceHandler = (selectedPlace) => {
    console.log(selectedPlace);
    dispatch(addPlace(selectedPlace));
    setSelectedPlacesList((prevList) => {
      const alreadyExists = prevList.some(
        (place) => place.title === selectedPlace.title
      );
      if (alreadyExists) {
        return prevList; // Return the existing list when the place is already selected
      }
      return [...prevList, selectedPlace]; // Add the selected place to the list
    });
    setOpenList(false);
    setSearchedCity(""); // Clear the searchedCity state
    setSuggestionsList([]); // Clear the suggestionsList state
  };

  useEffect(() => {
    if (!openList) {
      setSuggestionsList([]);
    }
  }, [openList]);

  return (
    <TouchableWithoutFeedback onPress={() => setOpenList(false)}>
      <ImageBackground
        style={styles.container}
        source={require("../assets/background.png")}
      >
        <StatusBar style="light" />
        <Text style={styles.title}>Where are we going?</Text>
        <View style={styles.inputContainer}>
          <IconTextInput
            onToggleSuggestions={setOpenList}
            onSuggestions={getSuggestions}
            suggestionsOpen={openList}
            loading={loading}
            setSearchedPlace={setSearchedCity}
            searchedPlace={searchedCity}
            touched={touched}
          />
        </View>
        {suggestionsList.length === 0 && searchedCity.length >= 3 && (
          <Text style={styles.notFound}>Nothing found</Text>
        )}
        <ScrollView style={styles.selectedPlacesListContainer}>
          {places.map((location) => {
            return (
              <View style={styles.locationsItem} key={location.id}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onPress={() => dispatch(removePlace(location.id))}
                >
                  <View>
                    <Ionicons name="location-sharp" size={24} color="#48da75" />
                  </View>
                  <View>
                    <Text style={{ fontWeight: "bold", textAlign: "right" }}>
                      {location.title}
                    </Text>
                    <Text
                      numberOfLines={null}
                      style={{ textAlign: "right", width: 200 }}
                    >
                      {location.context}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>

        {openList && (
          <View style={styles.suggestionListContainer}>
            <View style={styles.suggestionList}>
              {suggestionsList &&
                suggestionsList.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => {
                      choosePlaceHandler(suggestion);
                      setTouched(true);
                    }}
                  >
                    <Text style={{ color: "black" }}>{suggestion.title}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        )}
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    resizeMode: "cover",
  },
  title: {
    color: "#48DA75",
    fontSize: 64,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 64,
  },
  input: { backgroundColor: "white", width: "80%" },
  inputContainer: {
    flexDirection: "row",
    marginTop: 32,
  },

  notFound: {
    backgroundColor: "white",
    opacity: 0.8,
    padding: 14,
    width: Dimensions.get("window").width * 0.8,
    textAlign: "center",
    borderRadius: 8,
    marginTop: 8,
  },
  locationsItem: {
    backgroundColor: "white",
    opacity: 0.9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginBottom: 16,
    textAlign: "right",
    width: Dimensions.get("window").width * 0.8,
    borderRadius: 8,
    borderColor: "#48da75",
    borderWidth: 1,
    // width: "100%",
  },
  suggestionListContainer: {
    bottom: 230, // Adjust this value as needed
    width: "80%",
  },

  suggestionList: {
    width: Dimensions.get("window").width * 0.8,
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  suggestionItem: {
    backgroundColor: "white",
    opacity: 0.8,
    padding: 16,
  },
  selectedPlacesListContainer: {
    marginTop: 32,
  },
  mapButton: {
    backgroundColor: "#48DA75",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  mapButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
