import React, { useState } from "react";

const pillBtnStyle = {
  borderRadius: 50,
  padding: "10px 20px",
  border: "1px solid #007bff",
  backgroundColor: "#fff",
  color: "#007bff",
  cursor: "pointer",
  margin: "0 10px",
  fontWeight: "bold",
  minWidth: 120,
  transition: "all 0.3s ease",
};

const pillBtnHover = {
  backgroundColor: "#007bff",
  color: "#fff",
};

export default function InternshipPrep({ internshipInfo, setInternshipInfo, onBack }) {
  const [showOptions, setShowOptions] = useState(false);
  const [hover, setHover] = useState(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (internshipInfo.trim()) {
      setShowOptions(true);
    }
  };

  return (
    <div style={centerContainer}>
      <button onClick={onBack} style={{ marginBottom: 20 }}>
        &larr; Back
      </button>
      <h1>CareerPilot</h1>
      <h3>Tell us a bit about your internship</h3>
      {!showOptions && (
        <form onSubmit={handleSubmit}>
          <textarea
            rows={5}
            style={{ width: "100%", padding: 10, fontSize: 16, borderRadius: 5, borderColor: "#ccc" }}
            value={internshipInfo}
            onChange={(e) => setInternshipInfo(e.target.value)}
            placeholder="Write a brief description of the internship and company..."
          />
          <button type="submit" style={{ marginTop: 15, padding: "10px 20px", cursor: "pointer" }}>
            Submit
          </button>
        </form>
      )}
      {showOptions && (
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <button
            style={{ ...pillBtnStyle, ...(hover === "company" ? pillBtnHover : {}) }}
            onMouseEnter={() => setHover("company")}
            onMouseLeave={() => setHover(null)}
            onClick={() => alert("Company Research selected")}
          >
            Company Research
          </button>
          <button
            style={{ ...pillBtnStyle, ...(hover === "resume" ? pillBtnHover : {}) }}
            onMouseEnter={() => setHover("resume")}
            onMouseLeave={() => setHover(null)}
            onClick={() => alert("Resume Review selected")}
          >
            Resume Review
          </button>
          <button
            style={{ ...pillBtnStyle, ...(hover === "mock" ? pillBtnHover : {}) }}
            onMouseEnter={() => setHover("mock")}
            onMouseLeave={() => setHover(null)}
            onClick={() => alert("Mock Interview selected")}
          >
            Mock Interview
          </button>
        </div>
      )}
    </div>
  );
}
