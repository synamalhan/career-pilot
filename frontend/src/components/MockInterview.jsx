import React, { useState } from "react";
import { fetchMockInterviewQuestions, submitMockFeedback } from "../api/apiClient";

export default function MockInterview() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState({});

  const startInterview = async () => {
    if (!role.trim()) return alert("Please enter a job role");
    setLoadingQuestions(true);
    try {
      const res = await fetchMockInterviewQuestions(role);
      setQuestions(res.data.questions || []);
      setAnswers({});
      setFeedback({});
    } catch {
      alert("Failed to fetch questions");
    }
    setLoadingQuestions(false);
  };

  const getFeedback = async (index) => {
    setLoadingFeedback((prev) => ({ ...prev, [index]: true }));
    try {
      const res = await submitMockFeedback(questions[index], answers[index] || "");
      setFeedback((prev) => ({ ...prev, [index]: res.data.feedback }));
    } catch {
      alert("Failed to get feedback");
    }
    setLoadingFeedback((prev) => ({ ...prev, [index]: false }));
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Mock Interview</h2>
      <input
        type="text"
        placeholder="Enter Job Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <button
        onClick={startInterview}
        disabled={loadingQuestions}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loadingQuestions ? "Loading Questions..." : "Start Interview"}
      </button>

      {questions.length > 0 &&
        questions.map((q, i) => (
          <div key={i} className="mt-6">
            <p className="font-semibold">{q}</p>
            <textarea
              rows={3}
              value={answers[i] || ""}
              onChange={(e) =>
                setAnswers((prev) => ({ ...prev, [i]: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            <button
              onClick={() => getFeedback(i)}
              disabled={loadingFeedback[i]}
              className="mt-2 bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
            >
              {loadingFeedback[i] ? "Checking..." : "Get Feedback"}
            </button>
            {feedback[i] && (
              <pre className="bg-gray-100 p-3 mt-2 whitespace-pre-wrap rounded">
                {feedback[i]}
              </pre>
            )}
          </div>
        ))}
    </div>
  );
}
