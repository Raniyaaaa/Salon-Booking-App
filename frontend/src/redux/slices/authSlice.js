import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000/auth";

const storedUser = JSON.parse(localStorage.getItem("user"));
const authSlice = createSlice({
  name: "auth",
  initialState: { 
    user: storedUser || null,  // Retrieve user from localStorage if present
    token: localStorage.getItem("token") || null, 
    loading: false, 
    error: null 
  },
  reducers: {
    setUser: (state, action) => {
        console.log("ACTION", action);
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem("user", JSON.stringify(action.payload.user)); // Save user to localStorage
      localStorage.setItem("token", action.payload.token); // Save token to localStorage
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;

// Async functions with dispatch
export const registerUser = (userData) => async (dispatch) => {
    try {
      // Dispatch loading action before making the request
      dispatch(setLoading(true));
  
      // Make the API call to register the user
      const response = await axios.post(`${API_URL}/register`, userData);
      return (response);
    } catch (error) {
      // Handle error response, check for response or other errors
      const errorMessage = error.response?.data?.message || error.message || "Registration failed";
      dispatch(setError(errorMessage));
      
    } finally {
      // Stop the loading spinner after the request finishes
      dispatch(setLoading(false));
    }
  };

export const loginUser = (email, password) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.post(`${API_URL}/login`, {
            email,
            password
        });
        dispatch(setUser(response.data));
        return true;
    } catch (error) {
        dispatch(setError(error.response?.data || "Login failed"));
    } finally {
        dispatch(setLoading(false));
    }
};

export const logoutUser = () => async (dispatch) => {
    localStorage.removeItem("token");
    dispatch(clearUser());
};
