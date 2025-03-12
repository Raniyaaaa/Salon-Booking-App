import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "http://localhost:8000/stylists";

const initialState = {
  stylists: [],
  loading: false,
  error: null,
};

const stylistSlice = createSlice({
  name: "stylists",
  initialState,
  reducers: {
    setStylists(state, action) {
      state.stylists = Array.isArray(action.payload) ? action.payload : [];
    },
    addStylist(state, action) {
      state.stylists.push(action.payload);
    },
    updateStylistReducer(state, action) { 
      const index = state.stylists.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) state.stylists[index] = action.payload;
    },
    removeStylist(state, action) {
      state.stylists = state.stylists.filter((s) => s.id !== action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const fetchStylists = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.get(URL);
    console.log("Stylists", response.data);
    dispatch(setStylists(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
  } finally {
    dispatch(setLoading(false));
  }
};


export const addNewStylist = (stylistData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await axios.post(URL, stylistData);
    dispatch(addStylist(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
  } finally {
    dispatch(setLoading(false));
  }
};


export const updateStylist = (stylistData) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    console.log(stylistData);
    const response = await axios.put(`${URL}/${stylistData.id}`, stylistData);
    console.log(response)
    dispatch(updateStylistReducer(response.data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteStylist = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    await axios.delete(`${URL}/${id}`);
    dispatch(removeStylist(id));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || error.message));
  } finally {
    dispatch(setLoading(false));
  }
};

export const { setStylists, addStylist, updateStylistReducer, removeStylist, setLoading, setError } =
  stylistSlice.actions;

export default stylistSlice.reducer;
