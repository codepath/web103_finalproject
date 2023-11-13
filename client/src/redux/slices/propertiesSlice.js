import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_SERVER_URL
    : "http://localhost:3001";

export const fetchUserProperties = createAsyncThunk(
  "properties/fetcUserProperties",
  async ({ userId }, { dispatch }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/properties/${userId}`,
        {},
        { withCredentials: true }
      );
      dispatch(setUserProperties(res.data));
      //   const userData = res.data;
      //   return userData;
    } catch (error) {
      console.error("Error fetching user properties:", error);
      throw error;
    }
  }
);

export const fetchUserPropertyById = createAsyncThunk(
  "properties/fetchUserPropertyById",
  async ({ propertyId }, { dispatch }) => {
    try {
      const res = await axios.get(
        `${API_URL}/api/properties/view/${propertyId}`,
        {},
        { withCredentials: true }
      );
      dispatch(setCurrentProperty(res.data));
    } catch (error) {
      console.error("Error fetching single property", error);
      throw error;
    }
  }
);

export const createNewUserProperty = createAsyncThunk(
  "properties/createNewUserProperty",
  async (
    {
      address1,
      address2,
      city,
      state,
      zipcode,
      rating,
      numBeds,
      numBaths,
      numBedrooms,
      propertyType,
      imagesArray,
      amenitiesArray,
    },
    { dispatch }
  ) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/properties/${hostId}`,
        {
          address1,
          address2,
          city,
          state,
          zipcode,
          rating,
          numBeds,
          numBaths,
          numBedrooms,
          propertyType,
          imagesArray,
          amenitiesArray,
        },
        { withCredentials: true }
      );
      dispatch(addUserPropertyToList(res.data));
    } catch (error) {
      console.error("Error creating new user property", error);
      throw error;
    }
  }
);

const initialState = {
  userProperties: [],
  currentProperty: [],
  error: null,
};

const propertiesSlice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    setUserProperties: (state, action) => {
      state.userProperties = action.payload;
    },
    setCurrentProperty: (state, action) => {
      state.currentProperty = action.payload;
    },
    addUserPropertyToList(state) {
      if (state.currentProperty) {
        state.userProperties.push(state.currentProperty);
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProperties.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserProperties.fulfilled, (state, action) => {
        state.status = "succeeded";
        // state.loggedInUser = action.payload;
      })
      .addCase(fetchUserProperties.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUserPropertyById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserPropertyById.fulfilled, (state, action) => {
        state.status = "succeeded";
        // state.loggedInUser = action.payload;
      })
      .addCase(fetchUserPropertyById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createNewUserProperty.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createNewUserProperty.fulfilled, (state, action) => {
        state.status = "succeeded";
        // state.loggedInUser = action.payload;
      })
      .addCase(createNewUserProperty.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  setUserProperties,
  setCurrentProperty,
  addUserPropertyToList,
  setError,
} = propertiesSlice.actions;
export default propertiesSlice.reducer;
