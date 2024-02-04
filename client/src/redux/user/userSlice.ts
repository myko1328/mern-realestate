import { createSlice } from "@reduxjs/toolkit";

export interface userState {
  currentUser: {
    id: string;
    username: string;
    avatar: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  error: string | null;
  loading: boolean;
}

const initialState = {
  currentUser: null as userState["currentUser"],
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
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
  },
});

export const { signInFailure, signInStart, signInSuccess } = userSlice.actions;

export default userSlice.reducer;
