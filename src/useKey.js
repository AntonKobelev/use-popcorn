import { useEffect } from "react";

export function useKey(key, action) {
  useEffect(
    function () {
      const closeMovieWithKeyDown = function (event) {
        if (event.key.toLowerCase() === key.toLowerCase()) {
          action();
        }
      };
      document.addEventListener("keydown", closeMovieWithKeyDown);
      // document.removeEventListener("keydown", closeMovieWithKeyDown);
      return () =>
        document.removeEventListener("keydown", closeMovieWithKeyDown);
    },
    [action, key]
  );
}
