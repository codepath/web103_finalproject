import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import propertiesReducer from "./slices/propertiesSlice";

const rootReducer = combineReducers({
  user: userReducer,
  properties: propertiesReducer,
});

export default rootReducer;
