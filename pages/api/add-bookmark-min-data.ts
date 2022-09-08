// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PostgrestError } from '@supabase/supabase-js';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { isNull } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';
import { SingleListData } from '../../types/apiTypes';
import { MAIN_TABLE_NAME, TIMELESS_SCRAPPER_API } from '../../utils/constants';
import { supabase } from '../../utils/supabaseClient';

type Data = {
  data: SingleListData[] | null;
  error: PostgrestError | null;
  message: string | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const accessToken = req.body.access_token as string;
  const {} = supabase.auth.setAuth(accessToken);
  const url = req.body.url;
  const category_id = req.body.category_id;
  const update_access = req.body.update_access;
  const tokenDecode = jwtDecode(accessToken);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const userId = tokenDecode?.sub;

  const scrapperRes = await axios.post(TIMELESS_SCRAPPER_API, {
    url,
  });

  if (
    update_access === true &&
    !isNull(category_id) &&
    category_id !== 'null'
  ) {
    const { data, error } = await supabase.from(MAIN_TABLE_NAME).insert([
      {
        url: url,
        title: scrapperRes?.data?.title,
        user_id: userId,
        description: scrapperRes?.data?.description,
        ogImage: scrapperRes?.data?.OgImage,
        category_id: category_id,
      },
    ]);
    if (!isNull(error)) {
      res.status(500).json({ data: null, error: error, message: null });
    } else {
      res.status(200).json({ data: data, error: null, message: null });
    }
  } else {
    const { data, error } = await supabase.from(MAIN_TABLE_NAME).insert([
      {
        url: url,
        title: scrapperRes?.data?.title,
        user_id: userId,
        description: scrapperRes?.data?.description,
        ogImage: scrapperRes?.data?.OgImage,
        category_id: null,
      },
    ]);

    if (!isNull(error)) {
      res.status(500).json({ data: null, error: error, message: null });
    } else {
      res.status(200).json({
        data: data,
        error: null,
        message: !isNull(category_id)
          ? 'You dont have access to add to this category, this bookmark will be added without a category'
          : null,
      });
    }
  }
}