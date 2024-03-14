import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import places from "./reducers/places";

const store = configureStore({
  reducer: { places },
});

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarStyle: {
              backgroundColor: "rgba(34,36,40,1)",
            },
            tabBarIcon: ({ color, size }) => {
              let iconName = "";

              if (route.name === "Map") {
                iconName = "navigate-outline";
              } else if (route.name === "Home") {
                iconName = "home-outline";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#48DA75",
            tabBarInactiveTintColor: "#335561",
            headerShown: false,
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Map" component={MapScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
