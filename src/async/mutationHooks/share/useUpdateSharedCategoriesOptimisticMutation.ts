import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BOOKMARKS_KEY,
  SHARED_CATEGORIES_TABLE_NAME,
  USER_PROFILE,
} from '../../../utils/constants';
import { updateSharedCategoriesUserAccess } from '../../supabaseCrudHelpers';
import { useSession } from '@supabase/auth-helpers-react';
import { FetchSharedCategoriesData } from '../../../types/apiTypes';
import useGetCurrentCategoryId from '../../../hooks/useGetCurrentCategoryId';

// updates shared cat data optimistically
export default function useUpdateSharedCategoriesOptimisticMutation() {
  const queryClient = useQueryClient();
  const session = useSession();
  const { category_id } = useGetCurrentCategoryId();

  const updateSharedCategoriesOptimisticMutation = useMutation(
    updateSharedCategoriesUserAccess,
    {
      onMutate: async (data) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries([USER_PROFILE, session?.user?.id]);

        // Snapshot the previous value
        const previousTodos = queryClient.getQueryData([
          SHARED_CATEGORIES_TABLE_NAME,
        ]);

        // Optimistically update to the new value
        queryClient.setQueryData(
          [SHARED_CATEGORIES_TABLE_NAME],
          (old: { data: FetchSharedCategoriesData[] } | undefined) => {
            return {
              ...old,
              data: old?.data?.map((item) => {
                return {
                  ...item,
                  category_views: data?.updateData?.category_views,
                };
              }),
            } as { data: FetchSharedCategoriesData[] };
          }
        );

        // Return a context object with the snapshotted value
        return { previousTodos };
      },
      // If the mutation fails, use the context returned from onMutate to roll back
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(
          [SHARED_CATEGORIES_TABLE_NAME],
          context?.previousTodos
        );
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries([SHARED_CATEGORIES_TABLE_NAME]);
        queryClient.invalidateQueries([
          BOOKMARKS_KEY,
          session?.user?.id,
          category_id,
        ]);
      },
    }
  );

  return { updateSharedCategoriesOptimisticMutation };
}