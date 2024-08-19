import axios from "axios";

// Helper function to handle API responses
const handleResponse = async (promise: Promise<any>, successStatus: number) => {
  try {
    const res = await promise;
    if (res.status !== successStatus) {
      throw new Error(`Unexpected response status: ${res.status}`);
    }
    return res.data;
  } catch (error) {
    // Log detailed error information
    console.error("API call failed:", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  return handleResponse(axios.post("/user/login", { email, password }), 200);
};

export const signupUser = async (name: string, email: string, password: string) => {
  return handleResponse(axios.post("/user/signup", { name, email, password }), 201);
};

export const checkAuthStatus = async () => {
  return handleResponse(axios.get("/user/auth-status"), 200);
};

export const sendChatRequest = async (message: string) => {
  return handleResponse(axios.post("/chat/new", { message }), 200);
};

export const getUserChats = async () => {
  return handleResponse(axios.get("/chat/all-chats"), 200);
};

export const deleteUserChats = async () => {
  return handleResponse(axios.delete("/chat/delete"), 200);
};

export const logoutUser = async () => {
  return handleResponse(axios.get("/user/logout"), 200);
};
