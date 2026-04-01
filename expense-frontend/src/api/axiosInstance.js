import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use(
  (req) => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        if (user?.token) {
          req.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error("Invalid user in localStorage");
      }
    }

    return req;
  },
  (error) => Promise.reject(error)
);

export default API;
