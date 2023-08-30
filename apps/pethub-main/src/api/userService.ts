import { AccountTypeEnum } from "@/constants";
import { LoginCredentials } from "@/types";
import api from "./axiosConfig";

// TODO: Change stuff to fit the format of the finalized API after
export const loginService = async ({
  username,
  password,
  accountType,
}: LoginCredentials) => {
  /*
    TODO: remove this after. This is just to fit the current API req format for userType so the server works as of the current BE dev branch:
    https://github.com/IS4103-PetHub/PetHub-BE-Service/commit/777bb40f9c4ed7908d7ad5fc4a8cc92f98cbc688
  */
  const userType =
    accountType === AccountTypeEnum.PetOwner ? "petOwner" : "petBusiness";

  try {
    const body = {
      username: username,
      password: password,
      userType: userType,
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

export const forgotPasswordService = async (email: string) => {
  // TODO: Implement once API is available
  try {
    const body = {};
    let res = await api.post("xxx/forgotpassword", body);
    // console.log(
    //   "Calling Service: [userService - forgotPassword] with response:",
    //   res
    // );
    return res.data;
  } catch (e) {
    console.log("Error from [userService - forgotPassword]:", e);
    throw e;
  }
};
