import { createSlice } from '@reduxjs/toolkit';

// Initial state for the payment slice
const initialState = {
  paymentStatus: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
  paymentSessionId: null,
  error: null,
};

// Slice for handling payment-related state
const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    // Action to reset payment status
    resetPaymentStatus: (state) => {
      state.paymentStatus = 'idle';
      state.paymentSessionId = null;
      state.error = null;
    },
    // Action to start the payment process
    paymentRequest: (state) => {
      state.paymentStatus = 'loading';
      state.error = null;
    },
    // Action when payment is successful
    paymentSuccess: (state, action) => {
      state.paymentStatus = 'succeeded';
      state.paymentSessionId = action.payload.sessionId;
    },
    // Action when payment fails
    paymentFailure: (state, action) => {
      state.paymentStatus = 'failed';
      state.error = action.payload.error;
    },
  },
});

export const { resetPaymentStatus, paymentRequest, paymentSuccess, paymentFailure } = paymentSlice.actions;

export default paymentSlice.reducer;
