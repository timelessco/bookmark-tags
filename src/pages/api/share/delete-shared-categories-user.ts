// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createClient, type PostgrestError } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import { isEmpty } from "lodash";
import isNull from "lodash/isNull";
import type { NextApiResponse } from "next";

import type {
  DeleteSharedCategoriesUserApiPayload,
  FetchSharedCategoriesData,
  NextAPIReq,
} from "../../../types/apiTypes";
import { SHARED_CATEGORIES_TABLE_NAME } from "../../../utils/constants";

type DataRes = FetchSharedCategoriesData[] | null;
type ErrorRes = PostgrestError | null | { message: string } | string;

interface Data {
  data: DataRes;
  error: ErrorRes;
}

/**
 *
 * Deletes a collaborator in a category
 */

export default async function handler(
  req: NextAPIReq<DeleteSharedCategoriesUserApiPayload>,
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

  const { data, error }: { data: DataRes; error: ErrorRes } = await supabase
    .from(SHARED_CATEGORIES_TABLE_NAME)
    .delete()
    .match({ id: req.body.id })
    .select();

  if (!isNull(error)) {
    res.status(500).json({ data: null, error });
    throw new Error("ERROR");
  } else if (isEmpty(data)) {
    res
      .status(500)
      .json({ data: null, error: { message: "Something went wrong" } });
    throw new Error("ERROR");
  } else {
    res.status(200).json({ data, error: null });
  }
}