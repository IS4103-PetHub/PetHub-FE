import { AccountTypeEnum } from "@/types/constants";
import { ForgotPasswordPayload, LoginCredentials } from "@/types/types";
import api from "./axiosConfig";

// TODO: Change stuff to fit the format of the finalized API after
export const loginService = async ({
  username,
  password,
  accountType,
}: LoginCredentials) => {
  try {
    const body = {
      username: username,
      password: password,
      accountType: accountType,
    };
    let res = await api.post("/login", body);
    // console.log(
    //   "Calling Service: [userService - userLogin] with response:",
    //   res
    // );
    if (res.data && res.status == 200) {
      return res.data;
    } else {
      return null;
    }
  } catch (e) {
    console.log("Error from [userService - userLogin]:", e);
    return null;
  }
};

export const forgotPasswordService = async ({
  email,
}: ForgotPasswordPayload) => {
  try {
    const body = {
      email: email,
    };
    console.log("BODY", body);
    let res = await api.post("/forget-password", body);
    // console.log(
    //   "Calling Service: [userService - forgotPassword] with response:",
    //   res
    // );
    // if (res.data && res.status == 200) {
    //   return res.data;
    // } else {
    //   return null;
    // }
    return res.data;
  } catch (e) {
    console.log("Error from [userService - forgotPassword]:", e);
    throw e;
  }
};
