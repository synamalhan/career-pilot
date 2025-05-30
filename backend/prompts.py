# prompts.py

review_resume_prompt = """
Analyze the following resume text. Provide detailed feedback including:
- Strengths
- Weaknesses
- Suggestions for improvement
Additionally, provide a rating out of 100 for the overall quality of the resume.

Resume Text:
{resume_text}
"""

review_resume_intern_prompt = """
The user is applying for the role: {role} at {company}.
Analyze the following resume text with respect to this internship. Provide detailed feedback including:
- Strengths
- Weaknesses
- Suggestions for improvement
Additionally, provide two ratings out of 100:
1. Suitability of the resume for this specific internship.
2. Overall resume quality for internships in this field.
Explain the reasoning for both ratings.

Resume Text:
{resume_text}
"""

mock_interview_prompt = """
You are an interview simulator. Based on the role "{role}" at the company "{company}", generate:
- 3 technical/role-specific questions
- 3 behavioral questions
- 3 case study or problem-solving questions
Label each question clearly. Here is the format you should follow:
TQ: 1,2,3 (Technical Questions)
BQ: 1,2,3 (Behavioral Questions)
CQ: 1,2,3 (Case Study Questions)
give me the questions in a JSON format with the keys "technical", "behavioral", and "case_study".

"""

company_research_prompt = """
Provide a brief summary of the company "{company}" and the expectations for the role "{role}".
Simulate a chatbot style response that can help the user prepare better for this internship.
"""
