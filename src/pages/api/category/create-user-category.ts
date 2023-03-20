// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  createClient,
  type PostgrestError,
  type PostgrestResponse,
} from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import { isEmpty } from "lodash";
import isNull from "lodash/isNull";
import type { NextApiResponse } from "next";
import slugify from "slugify";

import type {
  AddUserCategoryApiPayload,
  CategoriesData,
  NextAPIReq,
} from "../../../types/apiTypes";
import {
  CATEGORIES_TABLE_NAME,
  DUPLICATE_CATEGORY_NAME_ERROR,
  PROFILES,
} from "../../../utils/constants";

type Data = {
  data: CategoriesData[] | null;
  error: PostgrestError | null | { message: string } | jwt.VerifyErrors;
};

/**
 * Creats catagory for a user
 */

export default async function handler(
  req: NextAPIReq<AddUserCategoryApiPayload>,
  res: NextApiResponse<Data>,
) {
  jwt.verify(
    req.body.access_token,
    process.env.SUPABASE_JWT_SECRET_KEY,
    function (err) {
      if (err) {
        res.status(500).json({ data: null, error: err });
        throw new Error("ERROR");
      }
    },
  );
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY,
  );

  const { user_id: userId } = req.body;
  const { name } = req.body;

  // check if category name is already there for the user
  const { data: matchedCategoryName, error: matchedCategoryNameError } =
    await supabase
      .from(CATEGORIES_TABLE_NAME)
      .select(`category_name`)
      .eq("user_id", userId)
      .eq("category_name", name);

  if (!isNull(matchedCategoryNameError)) {
    res.status(500).json({ data: null, error: matchedCategoryNameError });
    throw new Error("ERROR");
  }

  if (isEmpty(matchedCategoryName)) {
    const { data, error }: PostgrestResponse<CategoriesData> = await supabase
      .from(CATEGORIES_TABLE_NAME)
      .insert([
        {
          category_name: name,
          user_id: userId,
          category_slug: `${slugify(name, { lower: true })}-${Math.floor(
            Math.random() * 10000,
          )}`,
        },
      ])
      .select();

    if (
      data &&
      !isEmpty(data) &&
      // !isNull(req.body.category_order) &&
      req.body.category_order !== undefined
    ) {
      const order = !isNull(req.body.category_order)
        ? req.body.category_order
        : [];
      const { error: orderError } = await supabase
        .from(PROFILES)
        .update({
          category_order: [...order, data[0]?.id],
        })
        .match({ id: userId }).select(`
      id, category_order`);

      if (!isNull(orderError)) {
        res.status(500).json({ data: null, error: orderError });
        throw new Error("ERROR");
      }
    }

    if (!isNull(error)) {
      res.status(500).json({ data: null, error });
      throw new Error("ERROR");
    } else {
      res.status(200).json({ data, error: null });
    }
  } else {
    res
      .status(500)
      .json({ data: null, error: { message: DUPLICATE_CATEGORY_NAME_ERROR } });
  }
}