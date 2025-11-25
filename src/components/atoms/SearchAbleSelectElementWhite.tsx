import { forwardRef, useState } from "react";
import Label from "./Label";
import Select from "react-select";
import { Tooltip } from "antd";
interface SelectElementProps {
  inputClass?: string;
  id?: string;
  forwhat: string;
  labelMessage: string;
  options: { value: string; label: string }[];
  onChange: (selectedOption: any) => void;
  onSearch: (searchTerm: string) => void;
  value?: string;
  name?: string;
  tooltipText?: string; // ✅ tambahkan ini
  isReady?: boolean;
  before?: string;
}


const SearchableSelect = forwardRef<HTMLDivElement, SelectElementProps>(
  ({ inputClass, forwhat, labelMessage, options, onChange, onSearch, value, name, tooltipText, isReady, before }, ref) => {
    const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearchChange = (newSearchTerm: string) => {
      if (searchTimer) {
        clearTimeout(searchTimer); // Clear the previous timeout if there's one
      }

      // Set a new timeout to call the onSearch function after a delay
      const timer = setTimeout(() => {
        setIsLoading(true); 
        onSearch(newSearchTerm); // Call the onSearch function after the delay
        setIsLoading(false); 
      }, 500); // 500ms delay (can be adjusted)

      setSearchTimer(timer); // Store the timer to clear it later
    };

    return (
      <div className={inputClass}>
        <Label className={`${isReady ? "text-white" : "text-slate-500"} font-semibold`} forwhat={forwhat} labelMessage={labelMessage} />
        <div ref={ref}>
          <Tooltip
            title={isReady ? tooltipText : `Silakan pilih ${before} terlebih dahulu`}
            visible={isFocused && !!tooltipText}
            placement="topLeft"
          >
            <div onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}>
          <Select
            id={name}
            name={name}
            className={`text-sm border-b-2 w-full py-2 px-2 ${isReady ? "text-white" : "text-slate-500"} placeholder:opacity-90 bg-transparent 
              ${value && value !== "0"
              ? "border-greenlogo focus:border-greenlogo"
              : isReady
                ? "border-white focus:border-white"
                : "border-slate-500 focus:border-slate-500"}
            `}
            options={isReady ? options : []}
            onChange={onChange}
            onInputChange={handleSearchChange} // Handle search change with delay
            placeholder="Select Option"
            isSearchable
            isLoading={isLoading} 
            value={
                isReady
                  ? options.find((option) => option.value === value)
                  : { label: `Silakan pilih ${before} terlebih dahulu`, value: "" }
              }
            styles={{
              control: (provided) => ({
                ...provided,
                border: 0,
                backgroundColor: "transparent",
                marginBottom: "-9px",
                marginTop: "-8px",
                boxShadow: "none",
                marginLeft: "-5px",
              }),
              input: (provided) => ({
                ...provided,
                color: "#FFFFFF",
              }),
              placeholder: (provided) => ({
                ...provided,
                color: "#FFFFFF",
                opacity: 0.9,
              }),
              singleValue: (provided) => ({
                ...provided,
                color: isReady ? "#FFFFFF" : "#b5bac3ff",
              }),
              option: (provided, state) => ({
                ...provided,
                color: state.isSelected ? "#fff" : "#4A5568",
                backgroundColor: state.isSelected
                  ? "#4A5568"
                  : state.isFocused
                  ? "#EDF2F7"
                  : "#fff",
              }),
              dropdownIndicator: (provided) => ({
                ...provided,
                color: "#A0AEC0",
              }),
              indicatorSeparator: () => ({
                display: "none",
              }),
            }}
          />
            </div>
          </Tooltip>
        </div>
      </div>
    );
  }
);

SearchableSelect.displayName = "SearchableSelect";

export default SearchableSelect;
