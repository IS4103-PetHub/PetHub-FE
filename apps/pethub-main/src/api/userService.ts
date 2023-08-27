import { LoginCredentials } from "@/types";
import api from "./axiosConfig";

export const loginService = async ({
  username,
  password,
}: LoginCredentials) => {
  try {
    const body = {
      username: username,
      password: password,
    };
    let res = await api.post("/login", body);
    console.log(
      "Calling Service: [userService - userLogin] with response:",
      res,
    );
    return res.data;
  } catch (e) {
    console.log("Error from [userService - userLogin]:", e);
    throw e;
  }
};

export const forgotPasswordService = async (email: string) => {
  // Implement once API is available
  try {
    const body = {};
    let res = await api.post("xxx/forgotpassword", body);
    console.log(
      "Calling Service: [userService - forgotPassword] with response:",
      res,
    );
    return res.data;
  } catch (e) {
    console.log("Error from [userService - forgotPassword]:", e);
    throw e;
  }
};
