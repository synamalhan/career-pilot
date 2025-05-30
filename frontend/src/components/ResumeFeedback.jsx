import React from "react";

export default function ResumeFeedback({ feedback }) {
  if (!feedback) return null;

  // Parse feedback text into structured sections
  const parseFeedback = (text) => {
    const sections = {};
    const lines = text.split("\n").filter((line) => line.trim() !== "");

    let currentSection = null;
    for (let line of lines) {
      const trimmed = line.trim();
      if (/^Strengths:$/i.test(trimmed)) {
        currentSection = "Strengths";
        sections[currentSection] = [];
      } else if (/^Weaknesses:$/i.test(trimmed)) {
        currentSection = "Weaknesses";
        sections[currentSection] = [];
      } else if (/^Suggestions for improvement:$/i.test(trimmed)) {
        currentSection = "Suggestions for Improvement";
        sections[currentSection] = [];
      } else if (/^Rating out of 100:/i.test(trimmed)) {
        currentSection = "Rating";
        sections[currentSection] = [trimmed.replace(/^Rating out of 100:/i, "").trim()];
      } else if (currentSection) {
        sections[currentSection].push(trimmed);
      }
    }

    return sections;
  };

  const sections = parseFeedback(feedback);

  return (
    <div style={{ textAlign: "left", maxWidth: "800px", marginTop: "30px" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>📋 Feedback Summary</h2>
      {Object.entries(sections).map(([title, items]) => (
        <div key={title} style={{ marginBottom: "24px" }}>
          <h3 style={{ fontWeight: "bold", color: "#ffffff", marginBottom: "8px" }}>{title}:</h3>
          {title === "Rating" ? (
            <p>
              <strong>{items[0].split(".")[0]}. <br></br></strong>
              {items[0].includes(".") && " " + items[0].substring(items[0].indexOf(".") + 1).trim()}
            </p>
          ) : (
            <div>
              {items.map((item, idx) => (
                <p key={idx} style={{ marginBottom: "8px" }}>{item}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
