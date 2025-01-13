import React from "react";

function SmallModal({ title, buttons, textColor }) {
  return (
    <div className="bg-[#222E43] p-6 rounded shadow-lg text-center">
      <p
        className={`mb-4 text-lg font-bold ${
          textColor ? textColor : "text-white"
        } `}
      >
        {title}
      </p>
      <div className="flex justify-center gap-4">{buttons}</div>
    </div>
  );
}
export default SmallModal;
