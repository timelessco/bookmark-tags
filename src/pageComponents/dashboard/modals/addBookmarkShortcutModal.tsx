import isEmpty from "lodash/isEmpty";
import { useForm, type SubmitHandler } from "react-hook-form";

import Input from "../../../components/atoms/input";
import LabelledComponent from "../../../components/labelledComponent";
import Modal from "../../../components/modal";
import Spinner from "../../../components/spinner";
import { useModalStore } from "../../../store/componentStore";
import { URL_PATTERN } from "../../../utils/constants";

interface AddBookarkShortcutModalProps {
  onAddBookmark: (url: string) => void;
  isAddBookmarkLoading: boolean;
}

const AddBookarkShortcutModal = (props: AddBookarkShortcutModalProps) => {
  const { onAddBookmark, isAddBookmarkLoading } = props;
  const showAddBookmarkShortcutModal = useModalStore(
    state => state.showAddBookmarkShortcutModal,
  );

  const toggleShowAddBookmarkShortcutModal = useModalStore(
    state => state.toggleShowAddBookmarkShortcutModal,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{ url: string }>();
  const onSubmit: SubmitHandler<{ url: string }> = data => {
    onAddBookmark(data.url);
    reset({ url: "" });
  };

  return (
    <Modal
      open={showAddBookmarkShortcutModal}
      onClose={toggleShowAddBookmarkShortcutModal}
    >
      {isAddBookmarkLoading ? (
        <div className="flex justify-center">
          <Spinner />
        </div>
      ) : (
        <LabelledComponent label="Add URL">
          {/* disabling as handleSubmit is part of react hook form  */}
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register("url", {
                required: true,
                pattern: URL_PATTERN,
              })}
              placeholder="Add URL"
              className=" bg-custom-gray-8 px-2 py-1  outline-none focus:border-transparent"
              isError={!isEmpty(errors)}
              errorText="Enter valid URL"
              id="add-url-input"
            />
          </form>
        </LabelledComponent>
      )}
    </Modal>
  );
};

export default AddBookarkShortcutModal;
