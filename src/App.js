import { useEffect, useRef, useState } from "react";
import StarRaiting from "./StarRaiting";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputElement = useRef(null);
  useEffect(
    function () {
      function callback(e) {
        if (document.activeElement === inputElement.current) return;
        if (e.key === "Enter") {
          inputElement.current.focus();
          setQuery("");
        }
      }
      document.addEventListener("keydown", callback);
      return () => document.removeEventListener("keydown", callback);
      // const element = document.querySelector(".search");
      // element.focus();
    },
    [setQuery]
  );
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputElement}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

const apiKeyOmdb = process.env.REACT_APP_API_KEY;

export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [watched, setWatched] = useState(function () {
    const moviesFromStorage = localStorage.getItem("watched");
    return JSON.parse(moviesFromStorage);
  });

  function handleSelectedMovie(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  function handleDeleteMovieFromWatched(id) {
    console.log(id);
    console.log(watched);
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    console.log(watched);
  }

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

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
    [query]
  );
  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!error && !isLoading && (
            <MovieList movies={movies} onSelectMovie={handleSelectedMovie} />
          )}
          {error && <ErrorMessage errorMessage={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatchedMovie={handleAddWatchedMovie}
              watched={watched}
              // isHasMovies={isHasMovies}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatchedMovie={handleDeleteMovieFromWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatchedMovie,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState("");

  const isWatchingMovie = watched.some((movie) =>
    movie.imdbID.includes(selectedId)
  );

  const userWatchingRaiting = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Poster: poster,
    Title: title,
    Released: released,
    Runtime: runtime,
    Genre: genre,
    imdbRating,
    Plot: plot,
    Actors: actors,
    Director: director,
    imdbID,
  } = movie;
  // const [avrRaiting, setAvrRaiting] = useState(0);

  function addMovie() {
    const newMovie = {
      poster,
      title,
      imdbRating,
      runtime: Number(runtime.split(" ").at(0)) || 0,
      userRating,
      imdbID,
    };
    onAddWatchedMovie(newMovie);
    // setAvrRaiting(Number(imdbRating));
    // setAvrRaiting((curRaiting) => (curRaiting + userRating) / 2);
    onCloseMovie();
  }

  function handleUserRaiting(raiting) {
    setUserRating(raiting);
  }

  useEffect(
    function () {
      const closeMovieWithKeyDown = function (event) {
        if (event.key === "Escape") {
          onCloseMovie();
        }
      };
      document.addEventListener("keydown", closeMovieWithKeyDown);
      // document.removeEventListener("keydown", closeMovieWithKeyDown);
      return () =>
        document.removeEventListener("keydown", closeMovieWithKeyDown);
    },
    [onCloseMovie]
  );

  useEffect(
    function () {
      async function getMovieDetails() {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${apiKeyOmdb}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) {
        return;
      }
      document.title = `Movie | ${title}`;
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );
  return (
    <>
      <div className="details">
        <header>
          <button className="btn-back" onClick={onCloseMovie}>
            ⬅
          </button>
          <img src={poster} alt={`Poster of ${poster} movie`}></img>

          <div className="details-overview">
            <h2>{title}</h2>
            <p>{`${released} ▪ ${runtime}`}</p>
            <p>{genre}</p>
            <p>
              <span>⭐</span>
              {imdbRating} IMDb rating
            </p>
          </div>
        </header>
        {/* <p>{avrRaiting}</p> */}

        <section>
          <>
            {
              <div className="rating">
                {!isWatchingMovie ? (
                  <StarRaiting
                    maxRaiting={10}
                    onSetRaitingTest={handleUserRaiting}
                  />
                ) : (
                  <p>User Raiting is {userWatchingRaiting}⭐</p>
                )}
              </div>
            }

            {userRating > 0 && (
              <button className="btn-add" onClick={addMovie}>
                + Add movie
              </button>
            )}
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by ${director}</p>
          </>
        </section>
      </div>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ errorMessage }) {
  return (
    <div className="error">
      <span>⛔</span>
      {errorMessage}
    </div>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

// function Loader() {
//   return <p className="loader">Loader...</p>;
//   true;

//   return (
//     <div className="box">
//       <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
//         {isOpen ? "–" : "+"}
//       </button>
//       {isOpen && children}
//     </div>
//   );
// }

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(
    watched.map((movie) => movie.imdbRating)
  ).toFixed(2);
  const avgUserRating = average(
    watched.map((movie) => movie.userRating)
  ).toFixed(0);
  const avgRuntime = average(watched.map((movie) => movie.runtime)).toFixed(0);
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, onDeleteWatchedMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatchedMovie={onDeleteWatchedMovie}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatchedMovie }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onDeleteWatchedMovie(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}
