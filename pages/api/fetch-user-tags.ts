// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createClient, PostgrestError } from '@supabase/supabase-js';
import { isEmpty } from 'lodash';
import isNull from 'lodash/isNull';
import type { NextApiRequest, NextApiResponse } from 'next';
import { UserTagsData } from '../../types/apiTypes';
import { TAG_TABLE_NAME } from '../../utils/constants';

// fetches tags for a perticular user
type Data = {
  data: UserTagsData[] | null;
  error: PostgrestError | null | string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_KEY as string
  );

  const userId = req.query.user_id;

  if (!userId || isEmpty(userId)) {
    res.status(500).json({ data: null, error: 'User id is missing' });
  }

  const { data, error } = await supabase
    .from(TAG_TABLE_NAME)
    .select(`*`)
    .eq('user_id', userId);

  if (!isNull(error)) {
    res.status(500).json({ data: null, error: error });
  } else {
    res.status(200).json({ data: data, error: null });
  }
}
