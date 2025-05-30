import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Review resume only (file)
export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post("/review-resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// Review resume for internship: file + role + company
export async function reviewResumeIntern(file, role, company) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("role", role);
  formData.append("company", company);
  return apiClient.post("/review-resume-intern", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// Mock interview: role + company (JSON)
export async function fetchMockInterviewQuestions(role, company) {
  const formData = new FormData();
  formData.append("role", role);
  formData.append("company", company);
  return apiClient.post("/mock-interview", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// Company research: company + role (JSON)
export async function fetchCompanyResearch(company, role) {
  const formData = new FormData();    
  formData.append("company", company);
  formData.append("role", role);
  return apiClient.post("/company-research", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

