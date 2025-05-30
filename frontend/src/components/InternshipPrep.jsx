import React, { useState, useCallback } from "react";
import {
  uploadResume,
  reviewResumeIntern,
  fetchMockInterviewQuestions,
  fetchCompanyResearch,
  fetchMockFeedback
} from "../apiClient";
import ResumeFeedback from "./ResumeFeedback";
import { Feed } from "@mui/icons-material";

export default function InternshipPrep({ onBack }) {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // New fields for role & company for all API calls
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  // Add this state near the top if not already present:
const [feedbackById, setFeedbackById] = useState({});


  const centerContainer = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    minHeight: "80vh",
    width: "100vw",
    paddingTop: "100px",
    textAlign: "center",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role.trim() && company.trim()) {
      setShowOptions(true);
      setError(null);
    } else {
      setError("Please enter both role and company.");
    }
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

  // New states for parsed questions and user answers
  const [mockQuestionsParsed, setMockQuestionsParsed] = useState({ TQ: [], BQ: [], CS: [] });
  const [userAnswers, setUserAnswers] = useState({}); // { TQ1: '', BQ2: '', CS3: '' }
  const [idealAnswers, setIdealAnswers] = useState(null);

const parseQuestions = (rawText) => {
  console.log("Raw stringified JSON from API:", rawText);

  let parsedJSON = {};
  try {
    parsedJSON = JSON.parse(rawText); // Step 1: Parse stringified JSON
    console.log("Parsed JSON object:", parsedJSON);
  } catch (e) {
    console.error("Failed to parse questions JSON:", e);
    return { TQ: [], BQ: [], CS: [] };
  }

  const result = { TQ: [], BQ: [], CS: [] };

  // Step 2: Extract questions
  if (parsedJSON.technical) {
    result.TQ = parsedJSON.technical.map((q, index) => ({
      id: `TQ${index + 1}`,
      question: q,
    }));
    console.log("Extracted Technical Questions:", result.TQ);
  }

  if (parsedJSON.behavioral) {
    result.BQ = parsedJSON.behavioral.map((q, index) => ({
      id: `BQ${index + 1}`,
      question: q,
    }));
    console.log("Extracted Behavioral Questions:", result.BQ);
  }

  if (parsedJSON.case_study) {
    result.CS = parsedJSON.case_study.map((q, index) => ({
      id: `CS${index + 1}`,
      question: q,
    }));
    console.log("Extracted Case Study Questions:", result.CS);
  }

  return result;
};


const handleMockInterview = async () => {
  if (!role || !company) {
    setError("Please enter both role and company for Mock Interview.");
    return;
  }

  setLoading(true);
  setError(null);
  setMockQuestions("");
  setMockQuestionsParsed({ TQ: [], BQ: [], CS: [] });
  setUserAnswers({});
  setIdealAnswers(null);

  try {
    const response = await fetchMockInterviewQuestions(role, company);
    console.log("API full response:", response);

    const rawQuestions = response.data.questions || "";
    console.log("Raw `questions` field:", rawQuestions);

    setMockQuestions(rawQuestions);

    const parsed = parseQuestions(rawQuestions); // Properly parsed object
    setMockQuestionsParsed(parsed);
    console.log("Final Parsed Questions State:", parsed);
  } catch (err) {
    setError("Failed to fetch mock interview questions.");
    console.error("API error:", err);
  }

  setLoading(false);
};

  // Handle user input for answers
  const handleAnswerChange = (questionText, answerText) => {
  setUserAnswers((prev) => ({
    ...prev,
    [questionText]: answerText,
  }));
};


  const handleMockFeedbackSubmit = async () => {
  if (Object.keys(userAnswers).length === 0) {
    setError("Please answer at least one question before submitting.");
    return;
  }

  setLoading(true);
  setError(null);
  setIdealAnswers(null);

  try {
    const responses = Object.entries(userAnswers).map(([question, answer]) => ({
      question,
      answer,
    }));

    console.log("Submitting responses:", responses);

    const response = await fetchMockFeedback(company, role, responses);

    console.log("Full API response:", response);

    const feedbackRaw = response?.data?.feedback;

console.log("Raw feedback (string):", feedbackRaw);

let parsedFeedback = {};
try {
  const feedbackObj = JSON.parse(feedbackRaw); // ✅ PARSE THE STRING
  console.log("Parsed feedback object:", feedbackObj);

  for (const [id, fb] of Object.entries(feedbackObj)) {
    parsedFeedback[id] = {
      feedback: fb.feedback || "",
      improvement: fb.improvement || "",
      specificity: fb.specificity || "",
    };
    console.log(`Feedback for ${id}:`, parsedFeedback[id]);
  }

  setFeedbackById(parsedFeedback);
  console.log("Final feedbackById set:", parsedFeedback);
} catch (err) {
  console.error("Failed to parse feedback JSON:", e);
  setError("Failed to parse feedback from the server.");
  return;
}
    setIdealAnswers(response.data.ideal_answers || null);   
  console.log("Ideal answers:", response.data.ideal_answers);
  } catch (err) {
    setError("Failed to submit answers or fetch feedback.");
    console.error("API error:", err);
  } finally {
    setLoading(false);
  }
};

  const parseCompanyResearch = (data) => {
  try {
    if (!data || !data.summary) {
      throw new Error('No summary field found in data');
    }

    // summary is a JSON string with extra spaces/newlines, so trim it first
    const jsonString = data.summary.trim();

    const parsed = JSON.parse(jsonString);

    const splitLines = (text) =>
      text
        ? text
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0)
        : [];

    return {
      name: parsed.name || '',
      industry: parsed.industry || '',
      ceo: parsed.ceo || '',
      employees: parsed.employees || '',
      revenue: parsed.revenue || '',
      description: parsed.description || '',
      website: parsed.website || '',
      best_practices: splitLines(parsed.best_practices),
      role_expectations: splitLines(parsed.role_expectations),
      interview_tips: splitLines(parsed.interview_tips),
    };
  } catch (error) {
    console.error('Error parsing company research:', error);
    return null;
  }
};




  // Main handler to call API depending on selected option
  const handleUpload = async () => {
    if (!file) return alert("Please upload a resume file");
    setLoading(true);
    setError(null);
    setFeedback("");

    try {
      if (selectedOption === "resume") {
        const response = await uploadResume(file);
        setFeedback(response.data.feedback || JSON.stringify(response.data, null, 2));
      } else if (selectedOption === "resume-intern") {
        const response = await reviewResumeIntern(file, role, company);
        setFeedback(response.data.feedback || JSON.stringify(response.data, null, 2));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to upload resume or fetch feedback");
    }
    setLoading(false);
  };

  // For Mock Interview
  const [mockQuestions, setMockQuestions] = useState("");
 

  // For Company Research
  const [companyResearch, setCompanyResearch] = useState("");
  const handleCompanyResearch = async () => {
    if (!company || !role) {
      setError("Please enter both company and role for Company Research.");
      return;
    }
    setLoading(true);
    setError(null);
    setCompanyResearch("");
    try {
      const response = await fetchCompanyResearch(company, role);
        console.log("API full response:", response);
      setCompanyResearch(parseCompanyResearch(response.data));
    } catch (err) {
      setError("Failed to fetch company research.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={onBack}
        style={{ marginBottom: 20, marginLeft: 20, padding: "5px 10px", cursor: "pointer" }}
      >
        &larr;
      </button>
      <div style={centerContainer}>
        <h1 >CareerPilot</h1>

        {!showOptions && (
          <>
            <h3>Enter your internship details</h3>
            <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 600 }}>
              <input
                type="text"
                placeholder="Role (e.g. Software Engineering Intern)"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  padding: 10,
                  marginBottom: 10,
                  width: "100%",
                  borderRadius: 5,
                  borderColor: "#ccc",
                  fontSize: 16,
                }}
              />
              <input
                type="text"
                placeholder="Company Name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                style={{
                  padding: 10,
                  marginBottom: 10,
                  width: "100%",
                  borderRadius: 5,
                  borderColor: "#ccc",
                  fontSize: 16,
                }}
              />
              <button
                type="submit"
                style={{ marginTop: 15, padding: "10px 20px", cursor: "pointer" }}
              >
                Submit
              </button>
              {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
            </form>
          </>
        )}

        {showOptions && (
          <>
            <h3
              style={{
                width: "100%",
                maxWidth: 600,
                marginTop: 20,
                padding: 10,
                border: "1px solid #ccc",
                borderRadius: 6,
                maxHeight: 120,
                overflowY: "auto",
                textAlign: "left",
              }}
              title="Your entered internship info"
            >
              <b>Role:</b> {role} <br />
              <b>Company:</b> {company}
            </h3>

            <div style={{ marginTop: 20, textAlign: "center" }}>
              <button
                style={{
                  ...pillBtnStyle,
                  ...(selectedOption === "company" ? pillBtnHover : {}),
                }}
                onClick={() => setSelectedOption("company")}
              >
                Company Research
              </button>
              <button
                style={{
                  ...pillBtnStyle,
                  ...(selectedOption === "resume-intern" ? pillBtnHover : {}),
                }}
                onClick={() => setSelectedOption("resume-intern")}
              >
                Resume Review 
              </button>
              <button
                style={{
                  ...pillBtnStyle,
                  ...(selectedOption === "mock" ? pillBtnHover : {}),
                }}
                onClick={() => setSelectedOption("mock")}
              >
                Mock Interview
              </button>
            </div>

            {(selectedOption === "resume" || selectedOption === "resume-intern") && (
              <div style={{ marginTop: 60, width: "100%", maxWidth: 800 }}>
                <h2 style={{ fontSize: 24, marginBottom: 20 }}>
                  📄 {selectedOption === "resume" ? "Resume Review" : "Resume Review"}
                </h2>

                <div
                  style={{
                    border: "2px solid #3B82F6",
                    borderRadius: 8,
                    padding: "1.5rem",
                    marginBottom: "1rem",
                    textAlign: "center",
                    cursor: "pointer",
                  }}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => document.getElementById("resume-file").click()}
                  title="Drag & drop or click to upload your resume"
                >
                  {file ? (
                    <p>
                      Uploaded file: <b>{file.name}</b>
                    </p>
                  ) : (
                    <p>Drag & drop your resume here, or click to select file</p>
                  )}
                </div>

                <input
                  type="file"
                  id="resume-file"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      setFile(e.target.files[0]);
                      setError(null);
                    }
                  }}
                />

                <button
                  onClick={handleUpload}
                  style={{
                    padding: "10px 30px",
                    borderRadius: 6,
                    border: "none",
                    backgroundColor: "#3B82F6",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Get Feedback"}
                </button>

                {error && <p style={{ color: "red", marginTop: 15 }}>{error}</p>}
                {feedback && <ResumeFeedback feedback={feedback} />}
              </div>
            )}

            {selectedOption === "mock" && (
  <div style={{ marginTop: 60, width: "100%", maxWidth: 800 }}>
    <h2 style={{ fontSize: 24, marginBottom: 20 }}>🎤 Mock Interview</h2>

    <button
      onClick={handleMockInterview}
      style={{
        padding: "10px 30px",
        borderRadius: 6,
        border: "none",
        backgroundColor: "#3B82F6",
        color: "white",
        cursor: "pointer",
        fontWeight: "bold",
        marginBottom: 20,
      }}
      disabled={loading}
    >
      {loading ? "Loading Questions..." : "Generate Questions"}
    </button>

    {mockQuestionsParsed.TQ.length + mockQuestionsParsed.BQ.length + mockQuestionsParsed.CS.length > 0 && (
      <>
        {["TQ", "BQ", "CS"].map((section) => (
          <div key={section} style={{ marginBottom: 30 }}>
            <h3 style={{ textAlign: "left", textTransform: "capitalize" }}>
              {section === "TQ" ? "Technical Questions" : section === "BQ" ? "Behavioral Questions" : "Case Study"}
            </h3>
            {mockQuestionsParsed[section].map(({ id, question }) => (
  <div key={id} style={{ marginBottom: 15, textAlign: "left" }}>
    <p><b>{id}</b>: {typeof question === "object" ? JSON.stringify(question) : question}</p>
    <textarea
      rows={4}
      placeholder="Your answer..."
      style={{
        width: "100%",
        padding: 10,
        fontSize: 14,
        borderRadius: 6,
        borderColor: "#ccc",
        marginTop: 5,
      }}
      value={userAnswers[id] || ""}
      onChange={(e) => handleAnswerChange(id, e.target.value)}
    />

    {feedbackById?.[id] && (
      <div style={{
        backgroundColor: "rgba(59, 130, 246, 0.1)", // blue with low opacity
        padding: 10,
        borderRadius: 5,
        marginTop: 8,
        lineHeight: 1.5,
      }}>
        <p><strong>📣 Feedback:</strong> {feedbackById[id].feedback}</p>
        <p><strong>🔧 How to Improve:</strong> {feedbackById[id].improvement}</p>
        <p><strong>🎯 Specificity:</strong> {feedbackById[id].specificity}</p>
      </div>
    )}
  </div>
            ))}
          </div>
        ))}


        <button
          onClick={handleMockFeedbackSubmit}
          style={{
            padding: "10px 30px",
            borderRadius: 6,
            border: "none",
            backgroundColor: "#10B981",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Answers"}
        </button>
      </>
    )}

    {error && <p style={{ color: "red", marginTop: 15 }}>{error}</p>}
  </div>
)}

            {selectedOption === "company" && (
  <div style={{ marginTop: 60, maxWidth: 800, width: "100%", textAlign: "center" }}>
    <h2> 🏢 Company Research</h2>
    <button
      onClick={handleCompanyResearch}
      style={{
        padding: "10px 30px",
        borderRadius: 6,
        border: "none",
        backgroundColor: "#3B82F6",
        color: "white",
        cursor: "pointer",
        fontWeight: "bold",
        marginBottom: 20,
      }}
      disabled={loading}
    >
      {loading ? "Loading..." : "Get Company Info"}
    </button>
    {error && <p style={{ color: "red" }}>{error}</p>}
    {companyResearch && (
      <div style={{ textAlign: "left", padding: 20, borderRadius: 10 }}>
        <h3>{companyResearch.name}</h3>
        <p><strong>Industry:</strong> {companyResearch.industry}</p>
        <p><strong>CEO:</strong> {companyResearch.ceo}</p>
        <p><strong>Employees:</strong> {companyResearch.employees}</p>
        <p><strong>Revenue:</strong> {companyResearch.revenue}</p>
        <p><strong>Description:</strong> {companyResearch.description}</p>
        <p><strong>Website:</strong> <a href={companyResearch.website} target="_blank" rel="noopener noreferrer">{companyResearch.website}</a></p>

        <div style={{ marginTop: 20 }}>
          <h4>Best Practices</h4>
          <ul>
            {(companyResearch?.best_practices || []).map((line, i) => (
              <li key={i}>{line.replace(/^\d+\.\s*/, "")}</li>
            ))}
          </ul>

          <h4>Role Expectations</h4>
          <ul>
            {(companyResearch?.role_expectations || []).map((line, i) => (
              <li key={i}>{line.replace(/^\d+\.\s*/, "")}</li>
            ))}
          </ul>

          <h4>Interview Tips</h4>
          <ul>
            {(companyResearch?.interview_tips || []).map((line, i) => (
              <li key={i}>{line.replace(/^\d+\.\s*/, "")}</li>
            ))}
          </ul>
        </div>
      </div>
    )}
  </div>
)}


          </>
        )}
      </div>
    </>
  );
}

const pillBtnStyle = {
  padding: "10px 20px",
  margin: "0 10px 20px 10px",
  borderRadius: "30px",
  border: "1.5px solid #3B82F6",
  cursor: "pointer",
  fontWeight: "600",
  color: "#3B82F6",
  backgroundColor: "transparent",
  transition: "all 0.3s ease",
};

const pillBtnHover = {
  backgroundColor: "#3B82F6",
  color: "white",
};
