import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  places: [],
};

export const placesSlice = createSlice({
  name: "place",
  initialState,
  reducers: {
    addPlace: (state, action) => {
      const exisistingPlace = state.places.find(
        (place) => place.title === action.payload.title
      );
      if (exisistingPlace) {
        return;
      }
      state.places.push(action.payload);
    },
    removePlace: (state, action) => {
      state.places = state.places.filter((e) => e.id !== action.payload);
    },
  },
});

export const { addPlace, removePlace } = placesSlice.actions;
export default placesSlice.reducer;
