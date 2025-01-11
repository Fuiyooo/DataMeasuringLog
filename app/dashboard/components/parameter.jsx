import React from 'react';

export default function ParameterSettings() {
  return (
    <div className="m-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1 bg-gray-300 h-12 rounded"></div>
          <div className="flex-1 bg-gray-300 h-12 rounded mx-2"></div>
          <div className="flex-1 bg-gray-300 h-12 rounded mx-2"></div>
          <div className="flex-1 bg-gray-300 h-12 rounded"></div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <div className="bg-gray-300 h-96 rounded flex items-center justify-center">
              <p className="text-gray-500">Placeholder</p> {/* Ganti dengan gambar jika diperlukan */}
            </div>
            {/* Input Quantity tepat di bawah placeholder */}
            <div className="mt-4">
              <label htmlFor="quantity" className="block text-gray-700 font-medium mb-2">
                Quantity:
              </label>
              <input
                id="quantity"
                type="number"
                className="border border-gray-300 rounded px-2 py-1 w-full"
                min="1"
              />
            </div>
          </div>

          <div className="col-span-8">
            <h2 className="text-lg font-medium text-gray-600 mb-4">
              Enter limits for the size of each measurement point
            </h2>

            {/* Reusable Parameter Input Component */}
            <ParameterInput />

            <div className="flex justify-end mt-8 space-x-4">
              <button className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600">
                Save
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ParameterInput() {
  const numParameters = 12; // Fixed number of parameters
  return (
    <div className="grid grid-cols-2 gap-8">
      {Array.from({ length: numParameters }).map((_, index) => (
        <div key={index} className="flex items-center mb-2">
          <span className="w-6 text-gray-700">{index + 1}.</span>
          <input
            type="number"
            className="border border-gray-300 rounded px-2 py-1 w-20 mr-2"
            placeholder="Min"
            min="0"
          />
          <span className="w-8 text-center text-gray-700">-</span>
          <input
            type="number"
            className="border border-gray-300 rounded px-2 py-1 w-20"
            placeholder="Max"
            min="0"
          />
        </div>
      ))}
    </div>
  );
}
