import React, { useState } from "react";
import { uploadResume } from "../api/apiClient";

export default function ResumeReview() {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Please upload a resume file");
    setLoading(true);
    setError(null);
    try {
      const response = await uploadResume(file);
      setFeedback(JSON.stringify(response.data, null, 2)); // Adjust to your backend response
    } catch (err) {
      setError("Failed to upload resume");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Resume Review</h2>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Submit Resume"}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
      {feedback && (
        <pre className="bg-gray-100 p-4 mt-4 whitespace-pre-wrap rounded">
          {feedback}
        </pre>
      )}
    </div>
  );
}
