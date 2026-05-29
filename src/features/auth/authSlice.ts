import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserData } from './authApi';

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
}

// const loadStateFromStorage = (): AuthState => {
//   if (typeof window === 'undefined') {
//     return {
//       user: null,
//       isAuthenticated: false,
//     };
//   }

//   try {
//     const user = localStorage.getItem('user');

//     return {
//       user: user ? JSON.parse(user) : null,
//       isAuthenticated: !!user,
//     };
//   } catch {
//     return {
//       user: null,
//       isAuthenticated: false,
//     };
//   }
// };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

// const saveToStorage = (state: AuthState) => {
//   if (typeof window === 'undefined') return;

//   try {
//     if (state.user) {
//       localStorage.setItem('user', JSON.stringify(state.user));
//     } else {
//       localStorage.removeItem('user');
//     }
//   } catch {}
// };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      // saveToStorage(state);
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // saveToStorage(state);
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
