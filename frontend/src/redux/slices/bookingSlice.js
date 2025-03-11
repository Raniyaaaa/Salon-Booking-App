import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000/booking";

const bookingSlice = createSlice({
  name: "booking",
  initialState: { appointments: [], loading: false, error: null },
  reducers: {
    setAppointments: (state, action) => {
      state.appointments = action.payload;
      state.error = null;
    },
    addAppointment: (state, action) => {
      state.appointments.push(action.payload);
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

export const { setAppointments, addAppointment, setLoading, setError } = bookingSlice.actions;
export default bookingSlice.reducer;

export const bookAppointment = (bookingData) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await axios.post(`${API_URL}/booking`, bookingData);
    dispatch(addAppointment(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data || "Booking failed"));
  } finally {
    dispatch(setLoading(false));
  }
};

export const getAppointments = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${API_URL}/mybookings`, config);
        dispatch(setAppointments(response.data));
    } catch (error) {
        dispatch(setError(error.response?.data || "Failed to fetch appointments"));
    } finally {
        dispatch(setLoading(false));
    }
};
