import React, { useState, useRef } from "react";

export default function DragDropFile({ onFileSelect }) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragOver(false);
      }}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current.click()}
      style={{
        border: "2px dashed #007bff",
        borderRadius: 10,
        padding: 40,
        textAlign: "center",
        color: dragOver ? "#007bff" : "#999",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      {dragOver ? "Drop the file here..." : "Drag & Drop your resume here, or click to select file"}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: "none" }}
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
      />
    </div>
  );
}
