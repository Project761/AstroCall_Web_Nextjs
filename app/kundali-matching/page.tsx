"use client";

import { useState } from "react";

export default function KundaliMatching() {
  const [maleData, setMaleData] = useState({ name: "", dob: "", tob: "", pob: "" });
  const [femaleData, setFemaleData] = useState({ name: "", dob: "", tob: "", pob: "" });
  const [result, setResult] = useState(null);

  const handleMaleInputChange = (e: any) => {
    setMaleData({ ...maleData, [e.target.name]: e.target.value });
  };

  const handleFemaleInputChange = (e: any) => {
    setFemaleData({ ...femaleData, [e.target.name]: e.target.value });
  };

  const calculateMatching = () => {
    const score = Math.floor(Math.random() * 31) + 70; // Random score between 70-100
    setResult(score);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Kundali Matching</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Male Details</h2>
            <div className="space-y-4">
              <input type="text" name="name" placeholder="Name" value={maleData.name} onChange={handleMaleInputChange} className="w-full px-3 py-2 border rounded" />
              <input type="date" name="dob" placeholder="Date of Birth" value={maleData.dob} onChange={handleMaleInputChange} className="w-full px-3 py-2 border rounded" />
              <input type="time" name="tob" placeholder="Time of Birth" value={maleData.tob} onChange={handleMaleInputChange} className="w-full px-3 py-2 border rounded" />
              <input type="text" name="pob" placeholder="Place of Birth" value={maleData.pob} onChange={handleMaleInputChange} className="w-full px-3 py-2 border rounded" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Female Details</h2>
            <div className="space-y-4">
              <input type="text" name="name" placeholder="Name" value={femaleData.name} onChange={handleFemaleInputChange} className="w-full px-3 py-2 border rounded" />
              <input type="date" name="dob" placeholder="Date of Birth" value={femaleData.dob} onChange={handleFemaleInputChange} className="w-full px-3 py-2 border rounded" />
              <input type="time" name="tob" placeholder="Time of Birth" value={femaleData.tob} onChange={handleFemaleInputChange} className="w-full px-3 py-2 border rounded" />
              <input type="text" name="pob" placeholder="Place of Birth" value={femaleData.pob} onChange={handleFemaleInputChange} className="w-full px-3 py-2 border rounded" />
            </div>
          </div>
        </div>

        <button onClick={calculateMatching} className="w-full mt-8 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600">
          Calculate Matching
        </button>

        {result && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-8 text-center">
            <h3 className="text-2xl font-semibold mb-4">Matching Result</h3>
            <div className="text-5xl font-bold text-orange-500 mb-4">{result}%</div>
            <p className="text-gray-700">
              {result >= 80 ? "Excellent Match!" : result >= 60 ? "Good Compatibility!" : "Consult an Astrologer"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
