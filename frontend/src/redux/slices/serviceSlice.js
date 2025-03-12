import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const URL = "http://localhost:8000/services";

const serviceSlice = createSlice({
  name: "services",
  initialState: {
    services: [],
    categories: [],
    filteredServices: [],
  },
  reducers: {
    setServices: (state, action) => {
      state.services = action.payload;
      state.filteredServices = action.payload;
      state.categories = [...new Set(action.payload.map((service) => service.category))];
    },
    addService: (state, action) => {
        state.services.push(action.payload);

        if (state.filteredServices.length === 0 || state.filteredServices[0]?.category === action.payload.category) {
          state.filteredServices.push(action.payload);
        }

        if (!state.categories.includes(action.payload.category)) {
          state.categories.push(action.payload.category);
        }
    },
    updateService: (state, action) => {
        const index = state.services.findIndex((service) => service.id === action.payload.id);
        
        if (index !== -1) {
          const oldCategory = state.services[index].category;
          state.services[index] = action.payload;

          const filteredIndex = state.filteredServices.findIndex((s) => s.id === action.payload.id);
          if (filteredIndex !== -1) {
            state.filteredServices[filteredIndex] = action.payload;
          }

          if (!state.categories.includes(action.payload.category)) {
            state.categories.push(action.payload.category);
          }

          const isOldCategoryStillUsed = state.services.some((s) => s.category === oldCategory);
          if (!isOldCategoryStillUsed) {
            state.categories = state.categories.filter((cat) => cat !== oldCategory);
          }
        }
    },      
    deleteService: (state, action) => {
        const serviceToDelete = state.services.find((service) => service.id === action.payload);
        state.services = state.services.filter((service) => service.id !== action.payload);
        state.filteredServices = state.filteredServices.filter((service) => service.id !== action.payload);
  
        if (serviceToDelete) {
          const isCategoryStillUsed = state.services.some((service) => service.category === serviceToDelete.category);
          if (!isCategoryStillUsed) {
            state.categories = state.categories.filter((cat) => cat !== serviceToDelete.category);
          }
        }
    },
    filterByCategory: (state, action) => {
      state.filteredServices =
        action.payload === "All"
          ? state.services
          : state.services.filter((service) => service.category === action.payload);
    },
  },
});

export const fetchServices = () => async (dispatch) => {
  try {
    const response = await axios.get(URL);
    dispatch(setServices(response.data));
  } catch (error) {
    console.error("Error fetching services:", error);
  }
};

export const createService = (serviceData) => async (dispatch) => {
  try {
    const response = await axios.post(URL, serviceData);
    dispatch(addService(response.data));
  } catch (error) {
    console.error("Error adding service:", error);
  }
};

export const modifyService = (serviceData) => async (dispatch) => {
  try {
    const response = await axios.put(`${URL}/${serviceData.id}`, serviceData);
    dispatch(updateService(response.data));
  } catch (error) {
    console.error("Error updating service:", error);
  }
};

export const removeService = (id) => async (dispatch) => {
  try {
    await axios.delete(`${URL}/${id}`);
    dispatch(deleteService(id));
  } catch (error) {
    console.error("Error deleting service:", error);
  }
};

export const { setServices, addService, updateService, deleteService, filterByCategory } = serviceSlice.actions;
export default serviceSlice.reducer;
