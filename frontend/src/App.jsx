import React, { useState } from "react";
import Home from "./components/Home";
import ResumeReview from "./components/ResumeReview";
import InternshipPrep from "./components/InternshipPrep";

export default function App() {
  const [page, setPage] = useState("home");
  const [internshipInfo, setInternshipInfo] = useState("");

  const renderPage = () => {
    switch (page) {
      case "resume-review":
        return <ResumeReview onBack={() => setPage("home")} />;
      case "internship-prep":
        return (
          <InternshipPrep
            internshipInfo={internshipInfo}
            setInternshipInfo={setInternshipInfo}
            onBack={() => setPage("home")}
          />
        );
      default:
        return (
          <Home
            onSelectResumeReview={() => setPage("resume-review")}
            onSelectInternshipPrep={() => setPage("internship-prep")}
          />
        );
    }
  };

  return <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>{renderPage()}</div>;
}
