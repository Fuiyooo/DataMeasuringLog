import React, { useState, useEffect } from "react";

// Functions
import addItem from "./functions/addItem";
import getParameterPlan from "./functions/getParameterPlan";

function Measurement() {
  const [numParameters, setNumParameters] = useState(0);

  const [paramData, setParamData] = useState({
    namaBarang: "",
    typeBarang: "",
    image: "",
    parameters: Array.from({ length: numParameters }, () => ({
      maxValue: "",
      minValue: "",
      status: "",
      tool: "",
    })),
  });

  const [formData, setFormData] = useState([]);

  const [imageUrl, setImageUrl] = useState(null); // Store image URL from database

  const [barcode, setBarcode] = useState("");
  const [debouncedBarcode, setDebouncedBarcode] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBarcode(barcode);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [barcode]);

  useEffect(() => {
    if (debouncedBarcode) {
      fetchItemParams(debouncedBarcode);
    }
  }, [debouncedBarcode]);

  const handleSave = () => {
    // Call the addItem function
    addItem(paramData, formData);

    // TODO: Add success message
  };

  const fetchItemParams = async (barcodeId) => {
    // Fetch the item parameters
    const params = await getParameterPlan(barcodeId);
    setParamData({
      id_item: params.item_information.id_item || "",
      namaBarang: params.item_information.name || "",
      typeBarang: params.item_information.type || "",
      image: params.item_information.image || "",
      parameters:
        params.parameters?.map((param) => ({
          maxValue: param.maxValue || "",
          minValue: param.minValue || "",
          status: "",
          tool: param.tool || "",
          // Include existing parameter ID if available
          ...(param.id && { id: param.id }),
        })) || [],
    });

    if (params.item_information.image) {
      setImageUrl(params.item_information.image);
    } else {
      setImageUrl(null); // If no image, reset to null
    }
  };

  useEffect(() => {
    setNumParameters(paramData.parameters.length);
  }, [paramData]);

  return (
    <section className="bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto bg-gray-50 shadow-md rounded-lg p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1">
            <div className="w-full h-12 px-4 bg-gray-200 border border-gray-400 rounded text-gray-700 flex items-center justify-center">
              <input
                type="text"
                placeholder="Barcode ID"
                className="bg-inherit focus:outline-none w-full text-center"
                onChange={(e) => setBarcode(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 mx-2">
            <div className="w-full h-12 px-4 bg-gray-200 border border-gray-400 rounded text-gray-700 flex items-center justify-center">
              {paramData.namaBarang || "Nama Barang"}
            </div>
          </div>
          <div className="flex-1 mx-2">
            <div className="w-full h-12 px-4 bg-gray-200 border border-gray-400 rounded text-gray-700 flex items-center justify-center">
              {paramData.typeBarang || "Type Barang"}
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
              Enter the values for each measurement point
            </h2>

            <MeasurementInput
              parameters={paramData.parameters}
              onUpdate={(updatedParams) =>
                setFormData((prevData) => ({
                  ...prevData,
                  parameters: updatedParams,
                }))
              }
            />

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
  const handleFormDataChange = (index, key, value) => {
    const updatedParameters = [...parameters];
    updatedParameters[index][key] = value;

    // Check if value is between 0 and 1
    if (key === "value") {
      const input_value = parseFloat(value);
      const status =
        input_value >= parameters[index].minValue &&
        input_value <= parameters[index].maxValue
          ? "OK"
          : "NG";
      const statusColor =
        input_value >= parameters[index].minValue &&
        input_value <= parameters[index].maxValue
          ? "bg-green-500"
          : "bg-red-500";

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
            onChange={(e) =>
              handleFormDataChange(index, "value", e.target.value)
            }
            className="border border-gray-400 rounded px-2 py-1 w-20 mr-2 bg-gray-200 text-gray-700"
            placeholder="Value"
          />
          <span className="w-8 text-center text-gray-700 mr-2 ">-</span>

          {/* Status */}
          <div
            className={`border border-gray-400 rounded px-2 py-1 w-20 mr-2 ${
              param.statusColor || "bg-gray-200"
            } text-gray-700 flex items-center justify-center`}
          >
            {param.status || "Status"}
          </div>

          {/* Tool */}
          <div className="border border-gray-400 rounded px-2 py-1 w-32 bg-gray-200 text-gray-700 flex items-center justify-center">
            {param.tool || "Tool"}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Measurement;
