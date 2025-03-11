import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/admin";

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        users: [],
        appointments: [],
        loading: false,
        error: null,
    },
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
            state.loading = false;
            state.error = null;
        },
        setAppointments: (state, action) => {
            state.appointments = action.payload;
            state.loading = false;
            state.error = null;
        },
        removeUser: (state, action) => {
            state.users = state.users.filter((user) => user.id !== action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    },
});

export const { setUsers, setAppointments, removeUser, setLoading, setError } = adminSlice.actions;
export default adminSlice.reducer;

// Async functions with dispatch
export const fetchUsers = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${API_URL}/users`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        dispatch(setUsers(response.data));
    } catch (error) {
        dispatch(setError(error.response?.data || "Failed to fetch users"));
    }
};

export const fetchAppointments = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${API_URL}/appointments`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        dispatch(setAppointments(response.data));
    } catch (error) {
        dispatch(setError(error.response?.data || "Failed to fetch appointments"));
    }
};

export const deleteUser = (userId) => async (dispatch) => {
    try {
        await axios.delete(`${API_URL}/users/${userId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        dispatch(removeUser(userId));
    } catch (error) {
        dispatch(setError(error.response?.data || "Failed to delete user"));
    }
};
