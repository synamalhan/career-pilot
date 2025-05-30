import React, { useState, useCallback } from "react";
import { uploadResume } from "../apiClient";
import ResumeFeedback from "./ResumeFeedback";

export default function ResumeReview({ onBack }) {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

   const centerContainer = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",  // Align near top vertically
  alignItems: "center",          // Center horizontally
  minHeight: "80vh", 
    width: "100vw",                // full viewport width
  paddingTop: "100px",            // Push content a bit down from top
  textAlign: "center",

};


  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError(null);
    }
  }, []);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) return alert("Please upload a resume file");
    setLoading(true);
    setError(null);
    try {
      const response = await uploadResume(file);
      setFeedback(response.data.feedback || JSON.stringify(response.data, null, 2));
    } catch (err) {
      console.error(err);
      setError("Failed to upload resume");
    }
    setLoading(false);
  };

  return (
    <>
  <button onClick={onBack} style={{ marginBottom: 20 , marginLeft: 20, padding: "5px 10px", cursor: "pointer", position:"fixed"}}>
        &larr;
      </button>
    <div className="w-full h-screen flex justify-center items-center bg-gray-50 px-4" style={centerContainer}>
      <div className="w-full max-w-2xl flex flex-col items-center text-center bg-white shadow-md rounded-lg p-8">
        <h1>CareerPilot</h1>
        <h2 className="text-3xl font-bold mb-6">📄 Resume Review</h2>

        {/* Drag and Drop with Outer Box (Inline CSS) */}
        <div
          style={{
            width: "100%",
            padding: "4px",
            border: "2px solid #3B82F6", // Tailwind's blue-500
            borderRadius: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="w-full flex flex-col items-center justify-center cursor-pointer transition-colors"
            style={{
              // border: "2px dashed #ffffff", // Tailwind's gray-300
              borderRadius: "0.375rem",
              padding: "1.5rem",
              // backgroundColor: "#000000", // Tailwind's gray-100
            }}
          >
            <p style={{ color: "#ffffff", marginBottom: "0.5rem" }}>
              {file ? (
                <>
                  <strong>Selected File:</strong> {file.name}
                </>
              ) : (
                "Drag & drop your resume here, or click to select"
              )}
            </p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              id="resumeUpload"
            />
            <label
              htmlFor="resumeUpload"
              style={{
                display: "inline-block",
                backgroundColor: "#2563EB", // Tailwind's blue-600
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                marginTop: "0.5rem",
                cursor: "pointer",
              }}
            >
              {file ? "Change File" : "Choose File"}
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          style={{ marginTop: "20px" }}
        >
          {loading ? "Uploading..." : "Submit Resume"}
        </button>

        {/* Error Display */}
        {error && <p className="text-red-600 mt-3 w-full">{error}</p>}

        {/* Feedback Display */}
        {feedback && (
          <div className="w-full mt-8 text-left">
            <ResumeFeedback feedback={feedback} />
          </div>
        )}
      </div>
    </div>
    </>
  );
}
