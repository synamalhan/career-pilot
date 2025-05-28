def resume_review_prompt(text):
    return f"""You are an expert career coach.
Review this resume and provide specific, actionable feedback:
{text}"""

def interview_prompt(answer, question):
    return f"""You're an interview coach.
Here's a candidate's answer to the question: '{question}'
Answer: '{answer}'
Please provide strengths, weaknesses, and improvement tips."""
