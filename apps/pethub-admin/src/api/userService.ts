import api from "./axiosConfig.js";

export const loginService = async (username: string, password: string) => {
  try {
    const body = {};
    let res = await api.post("xxx/login", body);
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
