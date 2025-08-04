// src/redux/slices/favoritesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventItem } from '../../types/EventItem';
import { storage } from '../../storage/mmkv';

interface FavoritesState {
  favorites: EventItem[];
}

const FAVORITES_KEY = 'favorites';

const loadFavorites = (): EventItem[] => {
  try {
    const raw = storage.getString(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveFavorites = (favorites: EventItem[]) => {
  try {
    storage.set(FAVORITES_KEY, JSON.stringify(favorites));
  } catch {
    console.warn('Failed to save favorites to MMKV');
  }
};

const initialState: FavoritesState = {
  favorites: loadFavorites(),
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<EventItem>) => {
      if (!state.favorites.find((e) => e.id === action.payload.id)) {
        state.favorites.push(action.payload);
        saveFavorites(state.favorites);
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter((e) => e.id !== action.payload);
      saveFavorites(state.favorites);
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
