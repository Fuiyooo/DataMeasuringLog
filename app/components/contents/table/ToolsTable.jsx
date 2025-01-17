import React from "react";

// Components
import Button from "@/app/components/smallcomponents/Button";

function Table({ datas, edit, remove, showConfirmPopup, confirmModal }) {
  return (
    <>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-[#8fcef2] text-black">
            <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Nama</th>
            <th className="border border-gray-300 px-4 py-2 text-left">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {datas.map((data, index) => (
            <tr key={data.id} className="text-gray-700">
              <td className="border border-gray-300 px-4 py-2">{data.id}</td>
              <td className="border border-gray-300 px-4 py-2">{data.name}</td>
              <td className="border border-gray-300">
                <div className="flex px-4 py-2 gap-2">
                  <Button
                    title="Edit"
                    go={() => edit(data)}
                    bgColor="bg-blue-500"
                    hoverBgColor="bg-blue-600"
                    textColor="text-white"
                    size="px-3 py-1"
                  />
                  <Button
                    title="Remove"
                    go={() => remove(data)}
                    bgColor="bg-red-500"
                    hoverBgColor="bg-red-600"
                    textColor="text-white"
                    size="px-3 py-1"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showConfirmPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          {confirmModal}
        </div>
      )}
    </>
  );
}

export default Table;
