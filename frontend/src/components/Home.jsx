import React from "react";

const pillBtnStyle = {
  borderRadius: 50,
  padding: "10px 25px",
  border: "1px solid #007bff",
  backgroundColor: "#fff",
  color: "#007bff",
  cursor: "pointer",
  margin: "0 10px",
  fontWeight: "bold",
  minWidth: 130,
  transition: "all 0.3s ease",
};
const pillBtnHover = {
  backgroundColor: "#007bff",
  color: "#fff",
};

export default function Home({ onSelectResumeReview, onSelectInternshipPrep }) {
  const [hover, setHover] = React.useState(null);

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


  return (
    <div style={centerContainer}>
      <h1>CareerPilot</h1>
      <h3>What are you looking for?</h3>
      <div style={{ marginTop: 40 }}>
        <button
          style={{ ...pillBtnStyle, ...(hover === "resume" ? pillBtnHover : {}) }}
          onMouseEnter={() => setHover("resume")}
          onMouseLeave={() => setHover(null)}
          onClick={onSelectResumeReview}
        >
          Resume Review
        </button>
        <button
          style={{ ...pillBtnStyle, ...(hover === "internship" ? pillBtnHover : {}) }}
          onMouseEnter={() => setHover("internship")}
          onMouseLeave={() => setHover(null)}
          onClick={onSelectInternshipPrep}
        >
          Internship Prep
        </button>
      </div>
    </div>
  );
}
