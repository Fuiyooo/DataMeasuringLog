import React from "react";

function ButtonLogout({ signOut }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="p-4 text-left hover:bg-gray-700"
    >
      Log Out
    </button>
  );
}

export default ButtonLogout;
