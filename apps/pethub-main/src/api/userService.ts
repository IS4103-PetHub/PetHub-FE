import {
  ForgotPasswordPayload,
  ResendVerifyEmailPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
} from "shared-utils";
import { AccountTypeEnum } from "shared-utils";
import { LoginCredentials } from "@/types/types";
import api from "./axiosConfig";

// TODO: Change stuff to fit the format of the finalized API after
export const loginService = async ({
  email,
  password,
  accountType,
}: LoginCredentials) => {
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
  return res.data;
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

export const verifyEmail = async ({ token }: VerifyEmailPayload) => {
  try {
    let res = await api.post(`/users/verify-email/${token}`);
    return res.data;
  } catch (error) {
    console.log("ERROR: unable to verify email", error);
    throw error;
  }
};

export const resendVerifyEmail = async ({
  email,
}: ResendVerifyEmailPayload) => {
  try {
    let res = await api.post(`/users/resend-verify-email/${email}`);
    return res.data;
  } catch (error) {
    console.log("ERROR: unable to resend email", error);
    throw error;
  }
};
