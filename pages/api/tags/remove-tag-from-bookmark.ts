// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createClient, PostgrestError } from '@supabase/supabase-js';
import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import type { NextApiRequest, NextApiResponse } from 'next';
import { UserTagsData } from '../../../types/apiTypes';
import { isAccessTokenAuthenticated } from '../../../utils/apiHelpers';
import { BOOKMARK_TAGS_TABLE_NAME } from '../../../utils/constants';

// removes tags for a bookmark
type Data = {
  data: UserTagsData[] | null;
  error: PostgrestError | null | { message: string } | string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (!isAccessTokenAuthenticated(req.body.access_token)) {
    res.status(500).json({ data: null, error: 'invalid access token' });
    return;
  }
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_KEY as string
  );

  const { data, error } = await supabase
    .from(BOOKMARK_TAGS_TABLE_NAME)
    .delete()
    .match({ id: req.body?.bookmark_tag_id });

  if (isEmpty(data)) {
    res
      .status(500)
      .json({ data: null, error: { message: 'Something went wrong' } });
  }

  if (!isNull(error)) {
    res.status(500).json({ data: null, error: error });
  } else {
    res.status(200).json({ data: data, error: null });
  }
}