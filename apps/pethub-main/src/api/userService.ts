import { AccountTypeEnum } from "@/types/constants";
import {
  ForgotPasswordPayload,
  LoginCredentials,
  ResetPasswordPayload,
} from "@/types/types";
import api from "./axiosConfig";

// TODO: Change stuff to fit the format of the finalized API after
export const loginService = async ({
  email,
  password,
  accountType,
}: LoginCredentials) => {
  try {
    const body = {
      email: email,
      password: password,
      accountType: accountType,
    };
    let url =
      accountType === AccountTypeEnum.PetOwner
        ? "/users/pet-owners/login"
        : "/users/pet-businesses/login";
    let res = await api.post(url, body);
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
    let res = await api.post("/users/forget-password", body);
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

export const resetPasswordService = async ({
  token,
  newPassword,
}: ResetPasswordPayload) => {
  try {
    const body = {
      newPassword: newPassword,
    };
    let res = await api.post(`/users/reset-password/${token}`, body);
    console.log(
      "Calling Service: [userService - resetPassword] with response:",
      res,
    );
    return res.data;
  } catch (e) {
    console.log("Error from [userService - resetPassword]:", e);
    throw e;
  }
};
