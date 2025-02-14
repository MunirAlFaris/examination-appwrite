import * as React from 'react';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import type { IMultiSelectOption } from '../../../universal/model';
import type { MultiValue } from 'react-select';

const darkThemeStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "#333",
    borderColor: "#555",
    color: "#fff",
    '&:hover': { borderColor: '#777' },
    minHeight: "44px",
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: "#333",
    color: "#fff",
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected
      ? "#555" // Background for selected options
      : isFocused
      ? "#444" // Background for focused options
      : "transparent",
    color: isSelected ? "#fff" : "#ccc", // Color for selected and non-selected options
    cursor: "pointer",
    '&:active': {
      backgroundColor: "#666", // Background when the option is clicked
    },
  }),
  singleValue: (styles) => ({
    ...styles,
    color: "#fff",
  }),
  input: (styles) => ({
    ...styles,
    color: "#fff",
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "#aaa",
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
    color: "#aaa",
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    backgroundColor: "#555",
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: "#444",
    color: "#fff",
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: "#fff",
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: "#aaa",
    '&:hover': {
      backgroundColor: "#555",
      color: "#fff",
    },
  }),
  clearIndicator: (styles) => ({
    ...styles,
    color: "#aaa",
    '&:hover': {
      color: "#fff",
    },
  }),
};

export default function MultiSelect (props: {
  value: any;
  options: any;
  onChange: (e: MultiValue<IMultiSelectOption>) => void;
  isForUsers?: boolean;
}) {
  const [theme, setTheme] = useState<boolean>(false);
  const customOption = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div
        ref={innerRef}
        {...innerProps}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        <img
          src={data.img}
          alt={data.label}
          style={{ width: 30, height: 30, marginRight: 10, borderRadius: "50%" }}
        />
        {data.label}
      </div>
    );
  };
  useEffect(() => {
    if(window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme(true)
    }
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change',({ matches }) => {
    if (matches) {
      setTheme(true)
    } else {
      setTheme(false)
    }
  })
  })
  return (
    <Select
      required
      value={props.value}
      hideSelectedOptions
      isMulti
      onChange={(e) => props.onChange(e)}
      options={props.options}
      placeholder='اختر...'
      isRtl
      noOptionsMessage={() => 'ليس هناك اي خيارات'}
      {...(theme ? {styles: darkThemeStyles} : {})}
      {...(props.isForUsers ?
        {components: {Option: customOption }}
        : {}
      )}
    />
  )
}