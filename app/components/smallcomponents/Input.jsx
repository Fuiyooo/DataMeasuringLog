import React from "react";

function Input({
  title,
  type,
  value,
  set,
  placeholder,
  name,
  handleChange,
  require,
}) {
  return (
    <>
      <label className="block mb-2 text-gray-900">{title}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={handleChange ? handleChange : (e) => set(e.target.value)}
        className="w-full p-2 mb-4 border rounded bg-gray-200 text-gray-900"
        placeholder={placeholder}
        required={!!require}
      />
    </>
  );
}

export default Input;
