import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000", // Change if backend URL differs
  headers: {
    "Content-Type": "application/json",
  },
});
const API_BASE_URL = "http://127.0.0.1:8000";

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post("/review-resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}


export async function fetchMockInterviewQuestions(role) {
  return apiClient.post("/mock-start", { role });
}

export async function submitMockFeedback(question, answer) {
  const formData = new FormData();
  formData.append("question", question);
  formData.append("answer", answer);
  return apiClient.post("/mock-start", formData);
}

export async function submitCompanyResearch(companyInfo, internshipInfo, resumeFile) {
  const formData = new FormData();
  formData.append("company_info", companyInfo);
  formData.append("internship_info", internshipInfo);
  formData.append("file", resumeFile);
  return apiClient.post("/company-chatbot", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}
