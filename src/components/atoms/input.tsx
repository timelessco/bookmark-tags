import { forwardRef, type InputHTMLAttributes } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import omit from "lodash/omit";

import { type ChildrenTypes } from "../../types/componentTypes";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
	className: string;
	errorClassName?: string;
	errorIconClassName?: string;
	errorText: string;
	id?: string;
	isDisabled?: boolean;
	isError: boolean;
	placeholder: string;
	rendedRightSideElement?: ChildrenTypes;
	wrapperClassName?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
	const {
		placeholder,
		value,
		onChange,
		onKeyUp,
		className = "",
		isError,
		errorText = "",
		isDisabled = false,
		id = "",
		wrapperClassName = "relative rounded-md",
		rendedRightSideElement,
		errorClassName = "",
		errorIconClassName = "",
	} = props;

	const inputClass = classNames(className, {
		"block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 rounded-md":
			isError,
		"block w-full border-gray-300 rounded-md": !isError,
		"disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none":
			isDisabled,
	});

	const errorClass = classNames(errorClassName, {
		"mt-2 text-xs text-red-600": true,
	});

	const errorIconClass = classNames(errorIconClassName, {
		"pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3":
			true,
	});

	return (
		<div className="w-full">
			<div className={wrapperClassName}>
				<input
					id={id}
					ref={ref}
					type="text"
					value={value}
					{...omit(props, ["isError", "errorText", "isDisabled"])}
					className={inputClass}
					disabled={isDisabled}
					onChange={onChange}
					onKeyUp={onKeyUp}
					placeholder={placeholder}
				/>
				{isError && (
					<div className={errorIconClass}>
						<ExclamationCircleIcon
							aria-hidden="true"
							className="h-5 w-5 text-red-500"
						/>
					</div>
				)}
				{rendedRightSideElement && rendedRightSideElement}
			</div>
			{isError && (
				<p className={errorClass} id="email-error">
					{errorText}
				</p>
			)}
		</div>
	);
});

Input.displayName = "Input";

export default Input;
