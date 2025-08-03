// src/screens/FavoritesContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { EventItem } from '../types/EventItem';

interface FavoritesContextType {
  favorites: EventItem[];
  addFavorite: (event: EventItem) => void;
  removeFavorite: (eventId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<EventItem[]>([]);

  const addFavorite = (event: EventItem) => {
    setFavorites((prevFavorites) => {
      if (!prevFavorites.find(e => e.id === event.id)) {
        return [...prevFavorites, event];
      }
      return prevFavorites;
    });
  };

  const removeFavorite = (eventId: string) => {
    setFavorites((prevFavorites) => prevFavorites.filter(e => e.id !== eventId));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
};
