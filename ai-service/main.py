import os

from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai

from rag import load_chunks, retrieve, build_prompt
load_dotenv()

app = FastAPI()
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

chunks = load_chunks()

class Question(BaseModel):
    question: str

@app.get("/")
def home():
    return {
        "message": "AI service is running"
    }
@app.post("/ask")
def ask(data: Question):

    # 1. Retrieve relevant chunks
    results = retrieve(
        data.question,
        chunks,
        top_k=2
    )
    # 2. Create prompt using question + retrieved chunks
    prompt = build_prompt(
        data.question,
        results
    )

    # 3. ONE call to Gemini
    response = client.interactions.create(
        model="gemini-3.7-flash",
        input=prompt
    )

    # 4. Return answer
    return {
        "question": data.question,
        "answer": response.output_text,
        "sources": results
    }