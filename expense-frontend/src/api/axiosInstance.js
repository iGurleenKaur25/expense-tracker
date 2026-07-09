import axios from "axios";

const API = axios.create({
  baseURL: "https://expense-tracker-nbex.onrender.com/api",
});

API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined") {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

export default API;
