import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import bookingReducer from './slices/bookingSlice';
import adminReducer from './slices/adminSlice';
import paymentReducer from './slices/paymentSlice';
import serviceReducer from "./slices/serviceSlice";
import stylistReducer from "./slices/stylistSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        booking: bookingReducer,
        admin: adminReducer,
        payment: paymentReducer,
        services: serviceReducer,
        stylists: stylistReducer,
    },
});

export default store;