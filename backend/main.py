from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from resume_utils import extract_text_from_pdf
from prompts import resume_review_prompt, interview_prompt
import requests

app = FastAPI()
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,              # Or use ["*"] for all origins (not recommended for prod)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://localhost:11434/api/generate"

def call_ollama(prompt):
    payload = {
        "model": "mistral",
        "prompt": prompt,
        "stream": False
    }
    response = requests.post(OLLAMA_URL, json=payload)
    return response.json()['response']

import os
import fitz  # PyMuPDF

def extract_text_from_pdf(path):
    doc = fitz.open(path)
    text = "\n".join([page.get_text() for page in doc])
    return text

@app.post("/review-resume")
async def review_resume(file: UploadFile = File(...)):
    os.makedirs("temp", exist_ok=True)
    path = f"temp/{file.filename}"

    with open(path, "wb") as f:
        f.write(await file.read())

    text = extract_text_from_pdf(path)

    prompt = f"""
    Analyze the following resume text. Break your feedback into:
    1. Work Experience
    2. Education
    3. Projects
    4. Skills
    For each, mention:
    - Strengths
    - Weaknesses
    - Suggestions for improvement
    Resume Text:
    {text}
    """

    feedback = call_ollama(prompt)
    return {"feedback": feedback}


@app.post("/mock-start")
async def mock_start(role: str = Form(...)):
    prompt = f"""
    You are an interview simulator. Based on the role "{role}", generate:
    - 3 technical/role-specific questions
    - 3 behavioral questions
    - 3 case study or problem-solving questions
    Label each question clearly.
    """
    questions = call_ollama(prompt)
    return {"questions": questions}

@app.post("/company-research")
async def company_research(
    file: UploadFile = File(...),
    internship_title: str = Form(...),
    company_name: str = Form(...)
):
    os.makedirs("temp", exist_ok=True)
    path = f"temp/{file.filename}"

    with open(path, "wb") as f:
        f.write(await file.read())

    resume_text = extract_text_from_pdf(path)

    prompt = f"""
    The user is applying for the role: {internship_title} at {company_name}.
    Resume:
    {resume_text}

    First, do a quick background on {company_name} and its expectations for interns.
    Then:
    1. Rate the resume out of 100 for this specific internship.
    2. Rate the resume out of 100 in general for internships in the same field.
    3. Give reasoning for both ratings and what could be improved.
    """

    analysis = call_ollama(prompt)
    return {"analysis": analysis}
