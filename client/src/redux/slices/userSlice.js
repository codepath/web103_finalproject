import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { set } from "date-fns";
import cloneDeep from "lodash/cloneDeep";

const API_URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_SERVER_URL
    : "http://localhost:3001";

export const authLogIn = createAsyncThunk(
  "user/authLogIn",
  async ({ email, password }, { dispatch }) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(setLoggedInUser(res.data.user));
      dispatch(setEmail(res.data.user.email));
      dispatch(setAuthenticated(true));
      dispatch(toggleLoggedIn());
      //   const userData = res.data;
      //   return userData;
    } catch (error) {
      console.error("Error authenticating user:", error);
      throw error; // Re-throw the error to be caught in the rejected case
    }
  }
);

export const authRegister = createAsyncThunk(
  "user/authRegister",
  async (
    { first_name, last_name, zipcode, phone, user_name, email, password },
    { dispatch }
  ) => {
    console.log("attempt to register");
    const apiUrl = `${API_URL}/api/auth/register`;
    console.log(apiUrl);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        { first_name, last_name, zipcode, phone, user_name, email, password },
        { withCredentials: true }
      );

      console.log(res.data.user);
      dispatch(setLoggedInUser(res.data.user));
      dispatch(setEmail(res.data.user.email));
      dispatch(setAuthenticated(true));
      dispatch(toggleLoggedIn());
      //   const userData = res.data;
      //   return userData;
    } catch (error) {
      console.error("Error authenticating user:", error);
      throw error; // Re-throw the error to be caught in the rejected case
    }
  }
);

export const authLogOut = createAsyncThunk(
  "user/authLogOut",
  async (_, { dispatch }) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/logout`, {
        withCredentials: true,
      });
      dispatch(toggleLoggedIn());
    } catch (error) {
      console.error("Error logging out user:", error);
      throw error;
    }
  }
);

export const fetchUpdatedUserInfo = createAsyncThunk(
  "user/fetchUpdatedUserInfo",
  async (userId, { dispatch }) => {
    try {
      // Make your API request to fetch updated user information
      const res = await axios.get(`${API_URL}/api/users/${userId}`, {
        withCredentials: true,
      });

      // Dispatch the action to update the user in the Redux store
      dispatch(setLoggedInUser(res.data));
    } catch (error) {
      console.error("Error fetching updated user information:", error);
      throw error;
    }
  }
);

export const postNewProfilePhoto = createAsyncThunk(
  "user/postNewProfilePhoto",
  async ({ userId, newImageUrl }, { dispatch }) => {
    try {
      // Make your API request
      console.log(newImageUrl, "image url from redux");
      const res = await axios.patch(
        `${API_URL}/api/profile/new-profile-photo`,
        { id: userId, image_url: newImageUrl },
        { withCredentials: true }
      );
      // Dispatch the fetchUpdatedUserInfo thunk to refetch the user details
      dispatch(fetchUpdatedUserInfo(userId));
    } catch (error) {
      console.error("Error posting new profile photo:", error);
      throw error;
    }
  }
);

const initialState = {
  email: null,
  loggedInUser: null,
  isLoggedIn: false,
  isAuthenticated: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload;
    },
    toggleLoggedIn: (state) => {
      state.isLoggedIn = !state.isLoggedIn;
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    updateLoggedInUserImageUrl: (state, action) => {
      state.loggedInUser.image_url = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authLogIn.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(authLogIn.fulfilled, (state, action) => {
        state.status = "succeeded";
        // state.loggedInUser = action.payload;
      })
      .addCase(authLogIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(authRegister.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(authRegister.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload, "action payload create");
        state.loggedInUser = action.payload;
      })
      .addCase(authRegister.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(authLogOut.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(authLogOut.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loggedInUser = null; // Set to an empty array
      })
      .addCase(authLogOut.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUpdatedUserInfo.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(postNewProfilePhoto.rejected, (state, action) => {
        const actionWithoutCircularRefs = cloneDeep(action);
        console.error(
          "Error during postNewProfilePhoto:",
          actionWithoutCircularRefs
        );
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  setEmail,
  toggleLoggedIn,
  setAuthenticated,
  setLoggedInUser,
  updateLoggedInUserImageUrl,
} = userSlice.actions;
export default userSlice.reducer;
