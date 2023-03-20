// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createClient, type PostgrestError } from "@supabase/supabase-js";
import axios from "axios";
import jwt from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import { isNull } from "lodash";
import type { NextApiResponse } from "next";

import type {
  AddBookmarkMinDataPayloadTypes,
  NextAPIReq,
  SingleListData,
} from "../../../types/apiTypes";
import {
  ADD_UPDATE_BOOKMARK_ACCESS_ERROR,
  MAIN_TABLE_NAME,
  TIMELESS_SCRAPPER_API,
  UNCATEGORIZED_URL,
} from "../../../utils/constants";

type Data = {
  data: SingleListData[] | null;
  error: PostgrestError | null | string | jwt.VerifyErrors;
  message: string | null;
};

export default async function handler(
  req: NextAPIReq<AddBookmarkMinDataPayloadTypes>,
  res: NextApiResponse<Data>,
) {
  const accessToken = req.body.access_token;
  const { url } = req.body;
  const { category_id: categoryId } = req.body;
  const { update_access: updateAccess } = req.body;
  const tokenDecode: { sub: string } = jwtDecode(accessToken);
  const userId = tokenDecode?.sub;

  jwt.verify(accessToken, process.env.SUPABASE_JWT_SECRET_KEY, function (err) {
    if (err) {
      res.status(500).json({ data: null, error: err, message: null });
      throw new Error("ERROR");
    }
  });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
  );

  const scrapperRes = await axios.post<{
    title: string;
    description: string;
    OgImage: string;
  }>(TIMELESS_SCRAPPER_API, {
    url,
  });

  if (
    updateAccess === true &&
    !isNull(categoryId) &&
    categoryId !== "null" &&
    categoryId !== 0 &&
    categoryId !== UNCATEGORIZED_URL
  ) {
    const {
      data,
      error,
    }: {
      data: SingleListData[] | null;
      error: PostgrestError | null | string | jwt.VerifyErrors;
    } = await supabase
      .from(MAIN_TABLE_NAME)
      .insert([
        {
          url,
          title: scrapperRes.data.title,
          user_id: userId,
          description: scrapperRes?.data?.description,
          ogImage: scrapperRes?.data?.OgImage,
          category_id: categoryId,
        },
      ])
      .select();
    if (!isNull(error)) {
      res.status(500).json({ data: null, error, message: null });
      throw new Error("ERROR");
    } else {
      res.status(200).json({ data, error: null, message: null });
    }
  } else {
    const {
      data,
      error,
    }: {
      data: SingleListData[] | null;
      error: PostgrestError | null | string | jwt.VerifyErrors;
    } = await supabase
      .from(MAIN_TABLE_NAME)
      .insert([
        {
          url,
          title: scrapperRes?.data?.title,
          user_id: userId,
          description: scrapperRes?.data?.description,
          ogImage: scrapperRes?.data?.OgImage,
          category_id: 0,
        },
      ])
      .select();

    if (!isNull(error)) {
      res.status(500).json({ data: null, error, message: null });
      throw new Error("ERROR");
    } else {
      res.status(200).json({
        data,
        error: null,
        message:
          updateAccess === false ? ADD_UPDATE_BOOKMARK_ACCESS_ERROR : null,
      });
    }
  }
}