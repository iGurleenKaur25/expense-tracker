import axiosInstance from "./axiosInstance";

export const askAI = async (question) => {
    const response = await axiosInstance.post("/ai/ask", {
        question: question
    });

    return response.data;
};