import React from "react";

function Parameter({ props, addParameter, removeParameter, numParameters }) {
  return (
    <section>
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1 bg-gray-300 h-12 rounded">
            <p className="text-gray-500 text-center">Barcode ID</p>
          </div>
          <div className="flex-1 bg-gray-300 h-12 rounded mx-2">
            <p className="text-gray-500 text-center">Nama Barang</p>
          </div>
          <div className="flex-1 bg-gray-300 h-12 rounded mx-2">
            <p className="text-gray-500 text-center">Type Barang</p>
          </div>
          <div className="flex-1 bg-gray-300 h-12 rounded "></div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4 bg-gray-300 h-96 rounded flex items-center justify-center">
            <p className="text-gray-500">Gambar Placeholder</p>
          </div>

          <div className="col-span-8">
            <h2 className="text-lg font-medium text-gray-600 mb-4">
              Enter limits for the size of each measurement point
            </h2>

            {/* Reusable Parameter Input Component */}
            <ParameterInput numParameters={numParameters} />

            <div className="flex mt-6">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-700 mr-2"
                onClick={addParameter}
              >
                +
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-700"
                onClick={removeParameter}
              >
                -
              </button>
            </div>

            <div className="mt-6">
              <label className="block text-gray-700 font-medium mb-2">
                Item Quantity:
              </label>
              <input
                type="number"
                className="border border-gray-300 rounded px-2 py-1 w-32"
              />
            </div>

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
    </section>
  );
}

function ParameterInput({ numParameters }) {
  return (
    <div className="grid grid-cols-2 gap-8">
      {Array.from({ length: numParameters }).map((_, index) => (
        <div key={index} className="flex items-center mb-2">
          <span className="w-6 text-gray-700">{index + 1}.</span>
          <input
            type="text"
            className="border border-gray-300 rounded px-2 py-1 w-20 mr-2"
            placeholder="Min"
          />
          <span className="w-8 text-center text-gray-700">-</span>
          <input
            type="text"
            className="border border-gray-300 rounded px-2 py-1 w-20"
            placeholder="Max"
          />
        </div>
      ))}
    </div>
  );
}

export default Parameter;
