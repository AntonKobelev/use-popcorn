import { useEffect, useState } from "react";
const apiKeyOmdb = process.env.REACT_APP_API_KEY;

export function useMovies(query) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [movies, setMovies] = useState([]);
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchData() {
        try {
          setError("");
          // setMovies([]);
          setIsLoading(true);

          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${apiKeyOmdb}&s=${query}`,
            { signal: controller.signal }
          );
          const data = await res.json();

          if (data.Response === "False") {
            throw new Error("Movie is not found");
          }
          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 3) {
        setError("");
        setMovies([]);
        return;
      }
      fetchData();

      return function () {
        controller.abort();
      };
    },
    [query, setMovies]
  );
  return { error, isLoading, movies };
}
