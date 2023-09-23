import { getToken } from "next-auth/jwt";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  token: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) => {
  const token = await getToken({ req, raw: true });
  if (token) {
    res.status(200).json({ token: token });
  } else {
    res.status(401).json({ token: "Not authenticated" });
  }
};
