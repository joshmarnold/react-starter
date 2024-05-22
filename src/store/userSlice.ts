import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  // Add other user profile fields as necessary
}

interface UserState {
  profile: UserProfile | null;
  session: string | null; // You might want to use a more detailed type
}

const initialState: UserState = {
  profile: null,
  session: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<UserProfile>) {
      state.profile = action.payload;
    },
    clearProfile(state) {
      state.profile = null;
    },
    setSession(state, action: PayloadAction<string>) {
      state.session = action.payload;
    },
    clearSession(state) {
      state.session = null;
    },
  },
});

export const { setProfile, clearProfile, setSession, clearSession } =
  userSlice.actions;
export default userSlice.reducer;
