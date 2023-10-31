import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "User",
  initialState: {
    currentUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    signinStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    successUpdate: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateStart: (state) => {
      state.loading = true;
    },
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signoutStart: (state) => {
      state.loading = true;
    },
    signout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    ImageuploadStart: (state) => {
      state.loading = true;
    },
    ImageUploadSuccess: (state) => {
      state.loading = false;
      state.error = null;
    },
    ImageUploadError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  signinStart,
  signInSuccess,
  signInFailure,
  successUpdate,
  signout,
  updateFailure,
  updateStart,
  signoutStart,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  ImageUploadSuccess,
  ImageuploadStart,
  ImageUploadError,
} = userSlice.actions;

export const UserReducer = userSlice.reducer;
