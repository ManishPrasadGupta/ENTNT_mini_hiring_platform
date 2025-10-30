import axios from "axios";

const api = axios.create({
  baseURL: "/", // MSW intercepts all local requests
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

export default api;
