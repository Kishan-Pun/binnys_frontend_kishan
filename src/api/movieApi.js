import axiosClient from "./axiosClient";

const movieApi = {
  getMovies: (params) => axiosClient.get("/movies", { params }),
  getSortedMovies: (params) => axiosClient.get("/movies/sorted", { params }),
  searchMovies: (params) => axiosClient.get("/movies/search", { params }),
  getMovieById: (id) => axiosClient.get(`/movies/${id}`),
  createMovie: (data) => axiosClient.post("/movies", data),
  updateMovie: (id, data) => axiosClient.put(`/movies/${id}`, data),
  deleteMovie: (id) => axiosClient.delete(`/movies/${id}`)
};

export default movieApi;
