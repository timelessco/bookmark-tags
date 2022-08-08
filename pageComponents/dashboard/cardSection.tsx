/* eslint-disable @next/next/no-img-element */

import { SingleListData } from '../../types/apiTypes';
import { PencilAltIcon, TrashIcon } from '@heroicons/react/solid';
import orderBy from 'lodash/orderBy';

interface CardSectionProps {
  listData: Array<SingleListData>;
  onDeleteClick: (post: SingleListData) => void;
  onEditClick: (item: SingleListData) => void;
}

const CardSection = ({
  listData = [],
  onDeleteClick,
  onEditClick = () => null,
}: CardSectionProps) => {
  return (
    <div className="relative pb-20 px-4 sm:px-6 lg:pb-28 lg:px-8">
      <div className="absolute inset-0">
        <div className="bg-white h-1/3 sm:h-2/3" />
      </div>
      <div className="relative max-w-7xl mx-auto">
        <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
          {orderBy(listData, ['id'], ['desc']).map((post) => (
            <div
              key={post.id}
              className="flex flex-col rounded-lg shadow-lg overflow-hidden"
            >
              <div className="flex-shrink-0">
                <img
                  className="h-48 w-full object-cover"
                  src={post.ogImage || post.screenshot}
                  alt=""
                />
              </div>
              <div className="flex-1 bg-white p-6 flex justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-indigo-600">
                    <span className="flex space-x-1">
                      {post?.addedTags?.map((tag) => {
                        return <div key={tag?.id}>#{tag?.name}</div>;
                      })}
                    </span>
                  </div>
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block mt-2"
                  >
                    <p className="text-xl font-semibold text-gray-900">
                      {post.title}
                    </p>
                    <p className="mt-3 text-base text-gray-500">
                      {post.description}
                    </p>
                  </a>
                </div>
                <div className="flex">
                  <PencilAltIcon
                    className="h-5 w-5 text-gray-400 cursor-pointer"
                    onClick={() => onEditClick(post)}
                  />
                  <TrashIcon
                    className="h-5 w-5 ml-1 text-gray-400 cursor-pointer"
                    aria-hidden="true"
                    onClick={() => onDeleteClick(post)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardSection;
