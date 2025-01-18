import React, { useState, useEffect } from "react";

import addParameterPlan from "./functions/addParameterPlan";

function Parameter({ tools }) {
  const [formData, setFormData] = useState({
    barcodeId: "",
    namaBarang: "",
    typeBarang: "",
    parameters: Array.from({ length: 8 }, () => ({
      minValue: "",
      maxValue: "",
      id_tool: tools[0]?.id || "",
      unit: "unit",
    })),
  });

  const [numParameters, setNumParameters] = useState(8); // Default set to 8
  const [image, setImage] = useState(null);

  const addParameter = () => {
    if (numParameters < 20) {
      setNumParameters((prev) => prev + 1);
      setFormData((prevData) => ({
        ...prevData,
        parameters: [
          ...prevData.parameters,
          { minValue: "", maxValue: "", id_tool: "1" },
        ],
      }));
    }
  };

  const removeParameter = () => {
    if (numParameters > 1) {
      setNumParameters((prev) => prev - 1);
      setFormData((prevData) => ({
        ...prevData,
        parameters: prevData.parameters.slice(0, -1),
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setFormData((prev) => ({ ...prev, imageUrl })); // Update formData
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setFormData((prev) => ({ ...prev, imageUrl })); // Update formData
    }
  };

  const handleSave = () => {
    console.log(formData);

    // Call the addParameter function
    addParameterPlan(formData);

    // setFormData({
    //   barcodeId: "",
    //   namaBarang: "",
    //   typeBarang: "",
    //   parameters: Array.from({ length: 8 }, () => ({
    //     minValue: "",
    //     maxValue: "",
    //     toolName: "Option 1",
    //   })),
    // });
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
              onChange={(e) =>
                setFormData({ ...formData, barcodeId: e.target.value })
              }
            />
          </div>
          <div className="flex-1 mx-2">
            <input
              type="text"
              className="w-full h-12 px-4 bg-gray-200 border border-gray-400 rounded text-gray-700"
              placeholder="Nama Barang"
              onChange={(e) =>
                setFormData({ ...formData, namaBarang: e.target.value })
              }
            />
          </div>
          <div className="flex-1 mx-2">
            <input
              type="text"
              className="w-full h-12 px-4 bg-gray-200 border border-gray-400 rounded text-gray-700"
              placeholder="Type Barang"
              onChange={(e) =>
                setFormData({ ...formData, typeBarang: e.target.value })
              }
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

            <ParameterInput
              parameters={formData.parameters}
              tools={tools}
              onUpdate={(updatedParams) =>
                setFormData((prevData) => ({
                  ...prevData,
                  parameters: updatedParams,
                }))
              }
            />

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
              <button
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
                onClick={() => window.location.reload()}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ParameterInput({ parameters, onUpdate, tools }) {
  const handleChange = (index, key, value) => {
    const updatedParameters = [...parameters];
    updatedParameters[index][key] = value;
    onUpdate(updatedParameters);
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      {parameters.map((param, index) => (
        <div key={index} className="flex items-center mb-2">
          <span className="w-6 text-gray-700">{index + 1}.</span>
          <input
            type="text"
            value={param.minValue}
            onChange={(e) => handleChange(index, "minValue", e.target.value)}
            className="border border-gray-400 rounded px-2 py-1 w-20 mr-2 bg-gray-200 text-gray-700"
            placeholder="Min"
          />
          <span className="w-8 text-center text-gray-700">-</span>
          <input
            type="text"
            value={param.maxValue}
            onChange={(e) => handleChange(index, "maxValue", e.target.value)}
            className="border border-gray-400 rounded px-2 py-1 w-20 mr-2 bg-gray-200 text-gray-700"
            placeholder="Max"
          />
          {tools.length > 0 ? (
            <select
              value={param.id_tool}
              onChange={(e) => handleChange(index, "id_tool", e.target.value)}
              className="border border-gray-400 rounded px-2 py-1 w-32 bg-gray-200 text-gray-700"
            >
              {tools.map((tool, idx) => (
                <option key={idx} value={tool.id}>
                  {tool.name}
                </option>
              ))}
            </select>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default Parameter;
