import { forwardRef, SelectHTMLAttributes } from 'react';
import Label from './Label';

interface SelectElementProps extends SelectHTMLAttributes<HTMLSelectElement> {
  inputClass?: string;
  forwhat: string;
  labelMessage: string;
  options: { value: string; label: string }[];
}

const SelectElement = forwardRef<HTMLSelectElement, SelectElementProps>(({
  inputClass,
  forwhat,
  labelMessage,
  options,
  ...props
}, ref) => {
  return (
    <div className={inputClass}>
      <Label className="text-white font-semibold" forwhat={forwhat} labelMessage={labelMessage} />
      <select
       className={`text-sm w-full py-2 px-2 text-white bg-transparent placeholder:opacity-90
            border-b-2 ${props.value ? 'border-greenlogo' : 'border-white'} focus:border-white`}
        ref={ref}
        {...props}
      >
        {options.map(option => (
          <option className="text-black" key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});

SelectElement.displayName = 'SelectElement';

export default SelectElement;
