import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import Label from "./Label";
import { DatePicker } from "antd";
import type { DatePickerProps } from "antd";
import type { Dayjs } from "dayjs";

type CommonProps = {
  inputClass?: string;
  forwhat: string;
  labelMessage: string;
  inputName: string;
  inputPlaceholder: string;
  customElement?: ReactNode;
};

// Mode input biasa
type NormalInputProps = CommonProps &
  InputHTMLAttributes<HTMLInputElement> & {
    typeInput: "text" | "number" | "password" | "email";
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
  };

// Mode year (DatePicker)
type YearInputProps = CommonProps & {
  typeInput: "year";
  value?: Dayjs | null;
  onChange?: (date: Dayjs | null, dateString: string) => void;
} & Omit<DatePickerProps, "picker" | "onChange" | "value">;

// Mode date (DatePicker)
type DateInputProps = CommonProps & {
  typeInput: "date";
  value?: Dayjs | null;
  onChange?: (date: Dayjs | null, dateString: string) => void;
} & Omit<DatePickerProps, "picker" | "onChange" | "value">;

type InputElementProps = NormalInputProps | YearInputProps | DateInputProps;

const InputElement = forwardRef<HTMLInputElement, InputElementProps>(
  (props, ref) => {
    const {
      inputClass,
      forwhat,
      labelMessage,
      typeInput,
      inputName,
      inputPlaceholder,
      customElement,
      ...rest
    } = props as any;

    const inputStyle =
      "text-sm border-b-2 border-gray-500 w-full pt-2 pb-[10px] px-2 text-gray-800 placeholder:opacity-90 bg-transparent focus:border-gray-800 border-gray-300";

    return (
      <div className={inputClass}>
        <Label
          className="text-gray-800 font-semibold"
          forwhat={forwhat}
          labelMessage={labelMessage}
        />

        {/* Year Picker */}
        {typeInput === "year" ? (
          <DatePicker
            picker="year"
            placeholder={inputPlaceholder}
            className={
              inputStyle +
              " !rounded-none !border-t-0 !border-l-0 !border-r-0 shadow-none"
            }
            style={{ width: "100%", height: "40px" }}
            {...(rest as DatePickerProps)}
          />
        ) : typeInput === "date" ? (
          <DatePicker
            placeholder={inputPlaceholder}
            format="YYYY-MM-DD"
            className={
              inputStyle +
              " !rounded-none !border-t-0 !border-l-0 !border-r-0 shadow-none"
            }
            style={{ width: "100%", height: "40px" }}
            {...(rest as DatePickerProps)}
          />
        ) : customElement ? (
          customElement
        ) : (
          <input
            autoComplete="off"
            name={inputName}
            id={inputName}
            type={typeInput}
            className={inputStyle}
            placeholder={inputPlaceholder}
            ref={ref}
            {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
      </div>
    );
  }
);

InputElement.displayName = "InputElement";

export default InputElement;
