import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000/profile";

const profileSlice = createSlice({
    name: "profile",
    initialState: { user: null, loading: false, error: null },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.error = null;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setUser, setLoading, setError } = profileSlice.actions;
export default profileSlice.reducer;

export const getProfile = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}/me`, config);
        dispatch(setUser(response.data));
    } catch (error) {
        dispatch(setError(error.response?.data || "Failed to fetch profile"));
    } finally {
        dispatch(setLoading(false));
    }
};

export const updateProfile = (profileData) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.put(`${API_URL}/update`, profileData, config);
        dispatch(setUser(response.data.user));
    } catch (error) {
        dispatch(setError(error.response?.data || "Profile update failed"));
    } finally {
        dispatch(setLoading(false));
    }
};
