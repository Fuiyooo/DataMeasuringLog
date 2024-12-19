"use client"

export default function Measurement({ onBack }){
    return(

        <div>
            <button
            onClick={onBack}
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded text-lg mb-4"
            >Back</button>
            <h1 className="text-gray-900">Measurement</h1>
        </div>
    );
}