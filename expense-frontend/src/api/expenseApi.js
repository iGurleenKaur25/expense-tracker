import axiosInstance from "./axiosInstance";

export const getExpenses = () =>
  axiosInstance.get("/expenses");

export const addExpenses = (data) =>
  axiosInstance.post("/expenses", data);
