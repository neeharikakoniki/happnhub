import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventItem } from '../../types/EventItem';

interface FavoritesState {
  favorites: EventItem[];
}

const initialState: FavoritesState = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite(state, action: PayloadAction<EventItem>) {
      if (!state.favorites.find(f => f.id === action.payload.id)) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite(state, action: PayloadAction<string>) {
      state.favorites = state.favorites.filter(f => f.id !== action.payload);
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
