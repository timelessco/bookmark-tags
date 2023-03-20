// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createClient, type PostgrestError } from "@supabase/supabase-js";
import jwt_decode from "jwt-decode";
import isEmpty from "lodash/isEmpty";
import isNull from "lodash/isNull";
import type { NextApiRequest, NextApiResponse } from "next";

import { SHARED_CATEGORIES_TABLE_NAME } from "../../utils/constants";

/**
 * Adds user as colaborator in DB
 */

type Data = {
  success: string | null;
  error: string | null | PostgrestError;
};

interface InviteTokenData {
  email: string;
  category_id: number;
  edit_access: boolean;
  userId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
  );

  if (req?.query?.token) {
    const tokenData: InviteTokenData = jwt_decode(req?.query?.token as string);

    const insertData = {
      email: tokenData?.email,
      category_id: tokenData?.category_id,
      edit_access: tokenData?.edit_access,
      userId: tokenData?.userId,
    };

    // check if user with category Id is already there in DB
    const { data, error } = await supabase
      .from(SHARED_CATEGORIES_TABLE_NAME)
      .select("*")
      .eq("category_id", insertData?.category_id)
      .eq("email", insertData?.email);

    // if data is empty then the user invite was deleted
    if (isEmpty(data) && isNull(error)) {
      res.status(500).json({
        success: null,
        error: `This user invite has been deleted , error: ${
          isNull(error) ? "db error null" : error
        }`,
      });
      throw new Error("ERROR");
    }

    // the data will be present as it will be added with is_accept_pending true when invite is sent
    if (!isNull(data) && data[0]?.is_accept_pending === true) {
      // const { error: catError } = await supabase
      //   .from(SHARED_CATEGORIES_TABLE_NAME)
      //   .insert({
      //     category_id: insertData?.category_id,
      //     email: insertData?.email,
      //     edit_access: false,
      //     user_id: insertData?.userId,
      //   })
      //   .select();

      const { error: catError } = await supabase
        .from(SHARED_CATEGORIES_TABLE_NAME)
        .update({
          is_accept_pending: false,
        })
        .eq("email", insertData?.email)
        .eq("category_id", insertData?.category_id);

      if (isNull(catError)) {
        res.status(200).json({
          success: "User has been added as a colaborator to the category",
          error: null,
        });
      } else if (catError?.code === "23503") {
        // if collab user does not have an existing account
        res.status(500).json({
          success: null,
          error: `You do not have an existing account , please create one and visit this invite lint again ! error : ${catError?.message}`,
        });
        throw new Error("ERROR");
      } else {
        res.status(500).json({
          success: null,
          error: catError?.message,
        });
        throw new Error("ERROR");
      }
    } else {
      res.status(500).json({
        success: null,
        error: isNull(error)
          ? "The user is alredy a colaborator of this category"
          : error,
      });
      throw new Error("ERROR");
    }
  }
}