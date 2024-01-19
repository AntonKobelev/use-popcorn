import { useEffect, useState } from "react";

export function useLocalStorageState(initialState, key) {
  const [value, setValue] = useState(function () {
    try {
      const moviesFromStorage = localStorage.getItem(key);
      return moviesFromStorage ? JSON.parse(moviesFromStorage) : initialState;
    } catch (err) {
      console.error(err);
      return initialState;
    }
  });

  useEffect(
    function () {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (err) {
        console.error(err);
      }
    },
    [value, key]
  );
  return [value, setValue];
}
