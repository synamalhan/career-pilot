from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from prompts import (
    review_resume_prompt,
    review_resume_intern_prompt,
    mock_interview_prompt,
    company_research_prompt,
)
import requests
import os
import fitz  # PyMuPDF

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://localhost:11434/api/generate"

def call_ollama(prompt: str) -> str:
    payload = {
        "model": "mistral",
        "prompt": prompt,
        "stream": False
    }
    response = requests.post(OLLAMA_URL, json=payload)
    response.raise_for_status()
    return response.json()['response']

def extract_text_from_pdf(path: str) -> str:
    doc = fitz.open(path)
    text = "\n".join([page.get_text() for page in doc])
    return text

@app.post("/review-resume")
async def review_resume(file: UploadFile = File(...)):
    os.makedirs("temp", exist_ok=True)
    path = f"temp/{file.filename}"
    with open(path, "wb") as f:
        f.write(await file.read())

    resume_text = extract_text_from_pdf(path)
    prompt = review_resume_prompt.format(resume_text=resume_text)

    feedback = call_ollama(prompt)
    return {"feedback": feedback}

@app.post("/review-resume-intern")
async def review_resume_intern(
    file: UploadFile = File(...),
    role: str = Form(...),
    company: str = Form(...)
):
    os.makedirs("temp", exist_ok=True)
    path = f"temp/{file.filename}"
    with open(path, "wb") as f:
        f.write(await file.read())

    resume_text = extract_text_from_pdf(path)
    prompt = review_resume_intern_prompt.format(
        role=role,
        company=company,
        resume_text=resume_text
    )

    feedback = call_ollama(prompt)
    return {"feedback": feedback}

@app.post("/mock-interview")
async def mock_interview(
    role: str = Form(...),
    company: str = Form(...)
):
    prompt = mock_interview_prompt.format(role=role, company=company)
    questions = call_ollama(prompt)
    return {"questions": questions}

@app.post("/company-research")
async def company_research(
    role: str = Form(...),
    company: str = Form(...)
):
    prompt = company_research_prompt.format(role=role, company=company)
    research_summary = call_ollama(prompt)
    return {"summary": research_summary}
