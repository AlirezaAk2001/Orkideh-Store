import React, { createContext, useContext, useReducer, useEffect } from "react";

const FavoritesContext = createContext();

const initialState = {
  favorites: [],
  favoritesCount: 0,
};

// بارگذاری اولیه از localStorage
const loadInitialState = () => {
  const savedFavorites = localStorage.getItem("favorites");
  if (savedFavorites) {
    const parsedFavorites = JSON.parse(savedFavorites);
    return {
      favorites: parsedFavorites,
      favoritesCount: parsedFavorites.length,
    };
  }
  return { favorites: [], favoritesCount: 0 };
};

const favoritesReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_FAVORITES":
      const existingFavorite = state.favorites.find((item) => item.id === action.payload.id);
      if (!existingFavorite) {
        const newFavorites = [...state.favorites, action.payload];
        return {
          ...state,
          favorites: newFavorites,
          favoritesCount: newFavorites.length,
        };
      }
      return state;
    case "REMOVE_FROM_FAVORITES":
      const updatedFavorites = state.favorites.filter((item) => item.id !== action.payload);
      return {
        ...state,
        favorites: updatedFavorites,
        favoritesCount: updatedFavorites.length,
      };
    default:
      return state;
  }
};

export const FavoritesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(favoritesReducer, initialState, loadInitialState);

  // ذخیره توی localStorage هر وقت state تغییر کنه
  useEffect(() => {
    if (state.favorites.length > 0) {
      localStorage.setItem("favorites", JSON.stringify(state.favorites));
    } else {
      localStorage.removeItem("favorites");
    }
  }, [state.favorites]);

  const addToFavorites = (item) => {
    dispatch({ type: "ADD_TO_FAVORITES", payload: item });
  };

  const removeFromFavorites = (itemId) => {
    dispatch({ type: "REMOVE_FROM_FAVORITES", payload: itemId });
  };

  return (
    <FavoritesContext.Provider value={{ ...state, addToFavorites, removeFromFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites باید در FavoritesProvider استفاده شود");
  }
  return context;
};