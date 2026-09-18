import os

from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai

from rag import load_chunks, retrieve

load_dotenv()

app = FastAPI()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


class Question(BaseModel):
    question: str
    expenses: list[dict] = []
    financial_stats: dict = {}


@app.get("/")
def home():
    return {
        "message": "AI service is running"
    }


@app.post("/ask")
def ask(data: Question):

    chunks = load_chunks()

    results = retrieve(
        data.question,
        chunks,
        top_k=2
    )

    stats_context = f"""
Total spending: ₹{data.financial_stats.get("total", 0)}

Category spending:
{data.financial_stats.get("categoryTotals", {})}

Highest spending category:
{data.financial_stats.get("highestCategory", "None")}

Highest category amount:
₹{data.financial_stats.get("highestCategoryAmount", 0)}

Highest individual expense:
{data.financial_stats.get("highestExpense", {})}

Average expense:
₹{data.financial_stats.get("average", 0)}

Monthly spending:
{data.financial_stats.get("monthlyTotals", {})}

Monthly comparison:
{data.financial_stats.get("monthlyComparison", {})}
"""

    expense_context = "\n".join(
        [
            f"Title: {expense.get('title')}, "
            f"Amount: ₹{expense.get('amount')}, "
            f"Category: {expense.get('category')}, "
            f"Payment Type: {expense.get('paymentType')}, "
            f"Date: {expense.get('date')}"
            for expense in data.expenses
        ]
    )

    prompt = f"""
You are an AI financial assistant inside an expense tracking application.

Answer the user's question using the user's financial data
and the provided knowledge context.

Do not invent financial information.

"""
    try:
        response = client.interactions.create(
            model="gemini-3.7-flash",
            input=prompt
        )

    except Exception as error:
        print("GEMINI ERROR:", error)

        if "429" in str(error) or "quota" in str(error).lower():
            return {
                "question": data.question,
                "answer": "The AI service has temporarily reached its Gemini API limit. Please try again later.",
                "sources": results,
                "error": "GEMINI_RATE_LIMIT"
            }

        raise error

    return {
        "question": data.question,
        "answer": response.output_text,
        "sources": results
    }