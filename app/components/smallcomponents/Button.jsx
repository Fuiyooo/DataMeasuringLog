import React from "react";

function Button({ title, go, bgColor, hoverBgColor, textColor, size, type }) {
  return (
    <button
      type={type}
      onClick={go}
      className={`${bgColor} hover:${hoverBgColor} ${textColor} ${
        size ? size : "px-4 py-2"
      } rounded `}
    >
      {title}
    </button>
  );
}

export default Button;
