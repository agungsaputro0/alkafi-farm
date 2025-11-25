import { forwardRef, InputHTMLAttributes, useState, useEffect, ReactNode } from 'react';
import Label from './Label';

interface InputElementProps extends InputHTMLAttributes<HTMLInputElement> {
  inputClass?: string;
  forwhat: string;
  labelMessage: string;
  typeInput: string;
  inputName: string;
  inputPlaceholder: string;
  customElement?: ReactNode;
}

const InputElement = forwardRef<HTMLInputElement, InputElementProps>(({
  inputClass,
  forwhat,
  labelMessage,
  typeInput,
  inputName,
  customElement,
  inputPlaceholder,
  value,
  ...props
}, ref) => {
  const [hasValue, setHasValue] = useState<boolean>(false);

  useEffect(() => {
    if (typeof value === 'string') {
      setHasValue(value.trim() !== '');
    }
  }, [value]);

  return (
    <div className={inputClass}>
      <Label className="text-white font-semibold" forwhat={forwhat} labelMessage={labelMessage} />
      <input
        name={inputName}
        id={inputName}
        type={typeInput}
        className={`text-sm w-full py-2 px-2 text-white bg-transparent
          placeholder:text-white placeholder:opacity-90 
          border-b-2 focus:border-white 
          ${hasValue ? 'border-greenlogo' : 'border-white'}
        `}
        placeholder={inputPlaceholder}
        ref={ref}
        value={value}
        {...props}
      />
    </div>
  );
});

InputElement.displayName = 'InputElement';

export default InputElement;
