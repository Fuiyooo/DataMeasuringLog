import React, { useState, useEffect } from "react";

import addParameterPlan from "./functions/addParameterPlan";

function Measurement({ tools }) {
  const [formData, setFormData] = useState({
    barcodeId: "",
    namaBarang: "",
    typeBarang: "",
    parameters: Array.from({ length: 8 }, () => ({
      minValue: "",
      status: "", // Changed maxValue to status
      id_tool: tools[0]?.id || "",
      unit: "unit",
    })),
  });

  const [numParameters, setNumParameters] = useState(8); // Default set to 8
  const [imageUrl, setImageUrl] = useState(null); // Store image URL from database

  // Assuming image URL is passed from props or fetched from an API
  useEffect(() => {
    // Example of how you might fetch the image URL
    // setImageUrl('https://example.com/path/to/image.jpg');
    setImageUrl('https://via.placeholder.com/150'); // Example placeholder image URL
  }, []);

  const addParameter = () => {
    if (numParameters < 20) {
      setNumParameters((prev) => prev + 1);
      setFormData((prevData) => ({
        ...prevData,
        parameters: [
          ...prevData.parameters,
          { minValue: "", status: "", id_tool: "1" }, // Changed maxValue to status
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

  const handleSave = () => {
    console.log(formData);

    // Call the addParameter function
    addParameterPlan(formData);
  };

  return (
    <section className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-gray-50 shadow-md rounded-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1">
            <div className="w-full h-12 px-4 bg-gray-200 border border-gray-400 rounded text-gray-700 flex items-center justify-center">
              {formData.barcodeId || "Barcode ID"}
            </div>
          </div>
          <div className="flex-1 mx-2">
            <div className="w-full h-12 px-4 bg-gray-200 border border-gray-400 rounded text-gray-700 flex items-center justify-center">
              {formData.namaBarang || "Nama Barang"}
            </div>
          </div>
          <div className="flex-1 mx-2">
            <div className="w-full h-12 px-4 bg-gray-200 border border-gray-400 rounded text-gray-700 flex items-center justify-center">
              {formData.typeBarang || "Type Barang"}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center h-12 bg-gray-200 rounded text-gray-700">
            {numParameters}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4 bg-gray-200 h-96 rounded flex items-center justify-center border-dashed border-2 border-gray-400">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Uploaded"
                className="object-contain h-full w-full rounded"
              />
            ) : (
              <p>No Image Available</p>
            )}
          </div>

          <div className="col-span-8">
            <h2 className="text-lg font-medium text-gray-600 mb-4">
              Enter limits for the size of each measurement point
            </h2>

            <MeasurementInput
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

function MeasurementInput({ parameters, onUpdate, tools }) {
  const handleChange = (index, key, value) => {
    const updatedParameters = [...parameters];
    updatedParameters[index][key] = value;

    // Check if minValue is between 0 and 1
    if (key === "minValue") {
      const minValue = parseFloat(value);
      const status = (minValue >= 0 && minValue <= 1) ? "OK" : "NG";
      const statusColor = (minValue >= 0 && minValue <= 1) ? "bg-green-500" : "bg-red-500";

      updatedParameters[index].status = status;
      updatedParameters[index].statusColor = statusColor; // Add statusColor for dynamic background
    }

    onUpdate(updatedParameters);
  };

  return (
    <div className="grid grid-cols-2 gap-8">
      {parameters.map((param, index) => (
        <div key={index} className="flex items-center mb-2">
          <span className="w-6 text-gray-700">{index + 1}.</span>
          
          {/* Min Value input: Only numbers allowed */}
          <input
            type="number"
            value={param.minValue}
            onChange={(e) => handleChange(index, "minValue", e.target.value)}
            className="border border-gray-400 rounded px-2 py-1 w-20 mr-2 bg-gray-200 text-gray-700"
            placeholder="Min"
          />
          <span className="w-8 text-center text-gray-700">-</span>
          
          {/* Status */}
          <div
            className={`border border-gray-400 rounded px-2 py-1 w-20 mr-2 ${param.statusColor || 'bg-gray-200'} text-gray-700 flex items-center justify-center`}
          >
            {param.status || "Status"}
          </div>

          {/* Tool dropdown */}
          <div className="border border-gray-400 rounded px-2 py-1 w-32 bg-gray-200 text-gray-700 flex items-center justify-center">
            {tools.find(tool => tool.id === param.id_tool)?.name || "Tool"}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Measurement;
