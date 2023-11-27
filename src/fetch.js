// async function fetchData() {
//   try {
//     setIsLoading(true);
//     const res = await fetch(
//       `http://www.omdbapi.com/?apikey=${apiKeyOmdb}&s=${query}`
//     );
//     const data = await res.json();
//     if (data.Response === "False") {
//       throw new Error("Ivalid input");
//     }
//     // setMovies(data.Search);
//     // setIsLoading(false);
//   } catch (error) {
//     // setError(String(error.message));
//     console.log(error.message);
//     // setIsLoading(false);
//   }
// }
// fetchData();
