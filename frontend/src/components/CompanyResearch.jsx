import React, { useState } from "react";
import { submitCompanyResearch } from "../api/apiClient";

export default function CompanyResearch() {
  const [companyInfo, setCompanyInfo] = useState("");
  const [internshipInfo, setInternshipInfo] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!resumeFile) return alert("Please upload your resume");
    if (!companyInfo.trim() || !internshipInfo.trim())
      return alert("Please enter company and internship info");

    setLoading(true);
    setResult(null);
    try {
      const res = await submitCompanyResearch(companyInfo, internshipInfo, resumeFile);
      setResult(res.data);
    } catch {
      alert("Failed to analyze resume and company info");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Company Research & Resume Fit</h2>

      <textarea
        placeholder="Internship Info"
        value={internshipInfo}
        onChange={(e) => setInternshipInfo(e.target.value)}
        rows={4}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <textarea
        placeholder="Company Info"
        value={companyInfo}
        onChange={(e) => setCompanyInfo(e.target.value)}
        rows={4}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setResumeFile(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze Fit"}
      </button>

      {result && (
        <div className="mt-6 space-y-3">
          <div>
            <h3 className="font-semibold">Company Summary:</h3>
            <p>{result.summary}</p>
          </div>
          <div>
            <h3 className="font-semibold">Match Score:</h3>
            <p>{result.match_score} / 100</p>
          </div>
          <div>
            <h3 className="font-semibold">Resume Quality:</h3>
            <p>{result.resume_score} / 100</p>
          </div>
        </div>
      )}
    </div>
  );
}
