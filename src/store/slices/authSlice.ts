import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  role: 'user' | 'admin' | null;
  uid: string | null;
}

const initialState: AuthState = {
  role: null,
  uid: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ uid: string; role: 'user' | 'admin' }>) {
      state.uid = action.payload.uid;
      state.role = action.payload.role;
    },
    logout(state) {
      state.uid = null;
      state.role = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
