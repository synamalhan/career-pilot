import React, { useState } from "react";
import DragDropFile from "./DragDropFile";
import { uploadResume } from "../apiClient";

export default function ResumeReview({ onBack }) {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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
  const handleUpload = async (file) => {
    setLoading(true);
    try {
      const response = await uploadResume(file);
      setResult(`Resume uploaded: ${response.data.filename}`);
    } catch (err) {
      setResult("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={centerContainer}>
      <button onClick={onBack} style={{ marginBottom: 20 }}>
        &larr; Back
      </button>
      <h1>CareerPilot</h1>
      <h3>Review your Resume</h3>
      <DragDropFile onFileSelect={handleUpload} />
      {loading && <p>Uploading and analyzing...</p>}
      {result && <div style={{ marginTop: 20 }}>{result}</div>}
    </div>
  );
}
