import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; 

const IconTextInput = ({
  suggestionsOpen,
  onToggleSuggestions,
  loading,
  onSuggestions,
  setSearchedPlace,
  searchedPlace,
  touched,
}) => {
  const [textInputValue, setTextInputValue] = useState(searchedPlace);

  const onChangeText = (value) => {
    setTextInputValue(value); // Update the text input value
    setSearchedPlace(value); // Update the searched place state
    onSuggestions(value); // Call the suggestions callback
  };

  useEffect(() => {
    if (touched) {
      setTextInputValue("");
    }
  }, [touched]);
  return (
    <View style={{ flex: 1, alignItems: "center", zIndex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: "gray",
          borderRadius: 5,
          paddingHorizontal: 10,
          backgroundColor: "white",
          width: "80%",
          borderColor: "#48DA75",
          borderWidth: 2,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            height: 40,
            paddingLeft: 8,
            backgroundColor: "white",
            color: "#48DA75",
          }}
          placeholder="Search city"

          value={textInputValue}
          onChangeText={onChangeText}
        />
        {loading && textInputValue.length > 0 && (
          <ActivityIndicator size="small" color="grey" />
        )}
        {!loading && (
          <TouchableOpacity
            onPress={() => {
              setTextInputValue("");
              onToggleSuggestions(false);
            }}
            style={{ backgroundColor: "white" }}
          >
            <Ionicons
              name="close-circle-outline"
              size={24}
              color="grey"
              style={{ marginLeft: 10, backgroundColor: "white" }}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => onToggleSuggestions((prevValue) => !prevValue)}
          style={{ backgroundColor: "white" }}
        >
          <Ionicons
            name={suggestionsOpen ? "chevron-up" : "chevron-down"}
            size={24}
            color="grey"
            style={{ marginLeft: 10, backgroundColor: "white" }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IconTextInput;
