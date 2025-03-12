import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000/booking";

const bookingSlice = createSlice({
  name: "booking",
  initialState: { appointments: [], loading: false, error: null },
  reducers: {
    setAppointments: (state, action) => {
      state.appointments = action.payload;
    },
    addAppointment: (state, action) => {
      state.appointments.push(action.payload);
      state.error = null;
    },
    cancelAppointment: (state, action) => {
      state.appointments = state.appointments.filter(
        (appointment) => appointment.id !== action.payload
      );
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

export const {
  setAppointments,
  addAppointment,
  cancelAppointment,
  setLoading,
  setError,
} = bookingSlice.actions;

export default bookingSlice.reducer;


export const getAppointments = (token) => async (dispatch) => {
  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    console.log(config)
    console.log(token);
    const response = await axios.get(`${API_URL}/mybookings`, config);
    console.log(response)
    dispatch(setAppointments(response.data));
    console.log(response.data)
  } catch (error) {
    dispatch(setError(error.response?.data || "Failed to fetch appointments"));
  } finally {
    dispatch(setLoading(false));
  }
};


export const cancelUserAppointment = (appointmentId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    console.log(appointmentId)
    await axios.delete(`${API_URL}/${appointmentId}`);
    dispatch(cancelAppointment(appointmentId));
  } catch (error) {
    dispatch(setError(error.response?.data || "Failed to cancel appointment"));
  } finally {
    dispatch(setLoading(false));
  }
};
