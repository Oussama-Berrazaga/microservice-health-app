import type { AxiosResponse } from "axios";
import api from "./axios";

// Matches your Java Records
interface LoginRequest {
  username: string; // or whatever your record field name is
  password: string;
}

interface LoginResponse {
  token: string;
}

const loginApi = (
  payload: LoginRequest,
): Promise<AxiosResponse<LoginResponse>> => {
  // Implementation for login API call
  return api.post("/auth/login", payload);
};

export { loginApi };
export type { LoginRequest, LoginResponse };
