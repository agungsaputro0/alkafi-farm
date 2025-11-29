import { forwardRef, useState } from "react";
import Label from "./Label";
import Select from "react-select";
import { Tooltip } from "antd";

interface SelectElementProps {
  inputClass?: string;
  id?: string;
  placeholder: string;
  forwhat: string;
  labelMessage: string;
  options: { value: string; label: string }[];
  onChange: (selectedOption: any) => void;
  onSearch?: (searchTerm: string) => void;
  value?: any; // 🔥 bisa string atau array
  name?: string;
  tooltipText?: string;
  isReady?: boolean;
  isMulti?: boolean; // 🔥 tambahkan ini
}

const SearchableSelect = forwardRef<HTMLDivElement, SelectElementProps>(
  (
    {
      inputClass,
      placeholder,
      forwhat,
      labelMessage,
      options,
      onChange,
      onSearch,
      value,
      name,
      tooltipText,
      isReady,
      isMulti = false, // 🔥 default false
    },
    ref
  ) => {
    const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    const handleSearchChange = (newSearchTerm: string) => {
      if (searchTimer) clearTimeout(searchTimer);

      const timer = setTimeout(() => {
        onSearch?.(newSearchTerm);
      }, 500);

      setSearchTimer(timer);
    };

    // 🔥 HANDLE SINGLE & MULTI VALUE
    const computedValue = (() => {
      if (isMulti) {
        // Jika multi, value selalu berbentuk Option[]
        if (Array.isArray(value)) return value;
        return [];
      } else {
        // Single mode: bisa string atau Option
        if (value && typeof value === "object") return value; // Option
        if (typeof value === "string")
          return options.find((opt) => opt.value === value) || null;

        return null;
      }
    })();


    return (
      <div className={inputClass}>
        <Label
          className="text-gray-800 font-semibold"
          forwhat={forwhat}
          labelMessage={labelMessage}
        />

        <div ref={ref}>
          <Tooltip
            title={isReady ? tooltipText : tooltipText}
            visible={isFocused && !!tooltipText && options.length <= 1}
            placement="topLeft"
          >
            <div
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            >
              <Select
                id={name}
                name={name}
                className="text-sm border-b-2 border-gray-500 w-full pt-2 pb-[9px] px-2 text-gray-800 placeholder:opacity-90 bg-transparent focus:border-gray-800 border-gray-300"
                options={options}
                onChange={onChange}
                onInputChange={handleSearchChange}
                placeholder={placeholder}
                isSearchable
                isMulti={isMulti} // 🔥 penting
                value={computedValue} // 🔥 support multi & single
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
                    color: "#4A5568",
                  }),
                  placeholder: (provided) => ({
                    ...provided,
                    color: "#A0AEC0",
                    opacity: 0.9,
                  }),
                  singleValue: (provided) => ({
                    ...provided,
                    color: "#4A5568",
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
