import React, { useState } from "react";

function Parameter({ props }) {
  const [numParameters, setNumParameters] = useState(8);
  const [image, setImage] = useState(null);

  const addParameter = () => {
    if (numParameters < 20) {
      setNumParameters((prev) => prev + 1);
    }
  };

  const removeParameter = () => {
    if (numParameters > 1) {
      setNumParameters((prev) => prev - 1);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <section className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-gray-50 shadow-md rounded-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1">
            <input
              type="text"
              className="w-full h-12 px-4 bg-gray-200 border border-gray-400 rounded text-gray-700"
              placeholder="Barcode ID"
            />
          </div>
          <div className="flex-1 mx-2">
            <input
              type="text"
              className="w-full h-12 px-4 bg-gray-200 border border-gray-400 rounded text-gray-700"
              placeholder="Nama Barang"
            />
          </div>
          <div className="flex-1 mx-2">
            <input
              type="text"
              className="w-full h-12 px-4 bg-gray-200 border border-gray-400 rounded text-gray-700"
              placeholder="Type Barang"
            />
          </div>
          <div className="flex-1 flex items-center justify-center h-12 bg-gray-200 rounded text-gray-700">
            {numParameters}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div
            className="col-span-4 bg-gray-200 h-96 rounded flex items-center justify-center border-dashed border-2 border-gray-400"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {image ? (
              <img
                src={image}
                alt="Uploaded"
                className="object-contain h-full w-full rounded"
              />
            ) : (
              <label
                htmlFor="fileInput"
                className="text-gray-500 cursor-pointer flex flex-col items-center"
              >
                <p>Drag and Drop or Click to Upload</p>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          <div className="col-span-8">
            <h2 className="text-lg font-medium text-gray-600 mb-4">
              Enter limits for the size of each measurement point
            </h2>

            {/* Reusable Parameter Input Component */}
            <ParameterInput numParameters={numParameters} />

            <div className="flex mt-6">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 mr-2"
                onClick={addParameter}
              >
                +
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
                onClick={removeParameter}
              >
                -
              </button>
            </div>

            <div className="flex justify-end mt-8 space-x-4">
              <button className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">
                Save
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700">
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
            className="border border-gray-400 rounded px-2 py-1 w-20 mr-2 bg-gray-200 text-gray-700"
            placeholder="Min"
          />
          <span className="w-8 text-center text-gray-700">-</span>
          <input
            type="text"
            className="border border-gray-400 rounded px-2 py-1 w-20 mr-2 bg-gray-200 text-gray-700"
            placeholder="Max"
          />
          <select
            className="border border-gray-400 rounded px-2 py-1 w-32 bg-gray-200 text-gray-700"
          >
            <option value="Option 1">Option 1</option>
            <option value="Option 2">Option 2</option>
            <option value="Option 3">Option 3</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default Parameter;
