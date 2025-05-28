import React, { useState } from "react";
import ResumeReview from "./components/ResumeReview";
import MockInterview from "./components/MockInterview";
import CompanyResearch from "./components/CompanyResearch";

export default function App() {
  const [tab, setTab] = useState("resume");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <nav className="flex gap-4 mb-6">
        <button
          onClick={() => setTab("resume")}
          className={`px-4 py-2 rounded ${
            tab === "resume" ? "bg-blue-600 text-white" : "bg-gray-300"
          }`}
        >
          Resume Review
        </button>
        <button
          onClick={() => setTab("mock")}
          className={`px-4 py-2 rounded ${
            tab === "mock" ? "bg-green-600 text-white" : "bg-gray-300"
          }`}
        >
          Mock Interview
        </button>
        <button
          onClick={() => setTab("company")}
          className={`px-4 py-2 rounded ${
            tab === "company" ? "bg-purple-600 text-white" : "bg-gray-300"
          }`}
        >
          Company Research
        </button>
      </nav>

      {tab === "resume" && <ResumeReview />}
      {tab === "mock" && <MockInterview />}
      {tab === "company" && <CompanyResearch />}
    </div>
  );
}
