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

User's Financial Statistics:
{stats_context}

User's Expense Data:
{expense_context}

Knowledge Context:
{chr(10).join(results)}

User's Question:
{data.question}
"""

    response = client.interactions.create(
        model="gemini-3.7-flash",
        input=prompt
    )

    return {
        "question": data.question,
        "answer": response.output_text,
        "sources": results
    }


# import os

# from fastapi import FastAPI
# from pydantic import BaseModel
# from dotenv import load_dotenv
# from google import genai

# from rag import load_chunks, retrieve, build_prompt
# load_dotenv()

# app = FastAPI()
# client = genai.Client(
#     api_key=os.getenv("GEMINI_API_KEY")
# )

# chunks = load_chunks()

# class Question(BaseModel):
#     question: str
#     expenses: list[dict] = []
#     financial_stats: dict = {}
    

# @app.get("/")
# def home():
#     return {
#         "message": "AI service is running"
#     }


# # @app.post("/ask")
# # def ask(data: Question):

# #     # 1. Retrieve relevant RAG chunks
# #     results = retrieve(
# #         data.question,
# #         chunks,
# #         top_k=2
# #     )

# #     # 2. Convert user's expenses into text
# #     expense_context = "\n".join(
# #         [
# #             f"Title: {expense.get('title')}, "
# #             f"Amount: ₹{expense.get('amount')}, "
# #             f"Category: {expense.get('category')}, "
# #             f"Payment Type: {expense.get('paymentType')}, "
# #             f"Date: {expense.get('date')}"
# #             for expense in data.expenses
# #         ]
# #     )

# #     # 3. Combine RAG + financial data
# #     rag_context = "\n\n".join(results)
# #     prompt = f"""
# # You are an AI financial assistant inside an expense tracking application.

# # Answer the user's question using the user's financial data
# # and the provided knowledge context.

# # Do not invent financial information.

# # User's Financial Statistics:
# # {stats_context}

# # User's Expense Data:
# # {expense_context}

# # Knowledge Context:
# # {chr(10).join(results)}


# # User's Question:
# # {data.question}
# # """

# #     # 4. Send ONE request to Gemini
# #     response = client.interactions.create(
# #         model="gemini-3.7-flash",
# #         input=prompt
# #     )

# #     # 5. Return answer
# #     return {
# #         "question": data.question,
# #         "answer": response.output_text,
# #         "sources": results
# #     }


# @app.post("/ask")
# def ask(data: Question):

#     chunks = load_chunks()

#     results = retrieve(
#         data.question,
#         chunks,
#         top_k=2
#     )

#     stats_context = f"""
# Total spending: ₹{data.financial_stats.get("total", 0)}

# Category spending:
# {data.financial_stats.get("categoryTotals", {})}

# Highest spending category:
# {data.financial_stats.get("highestCategory", "None")}

# Highest category amount:
# ₹{data.financial_stats.get("highestCategoryAmount", 0)}

# Highest individual expense:
# {data.financial_stats.get("highestExpense", {})}

# Average expense:
# ₹{data.financial_stats.get("average", 0)}

# Monthly spending:
# {data.financial_stats.get("monthlyTotals", {})}

# Monthly comparison:
# {data.financial_stats.get("monthlyComparison", {})}
# """

#     expense_context = "\n".join(
#         [
#             f"Title: {expense.get('title')}, "
#             f"Amount: ₹{expense.get('amount')}, "
#             f"Category: {expense.get('category')}, "
#             f"Payment Type: {expense.get('paymentType')}, "
#             f"Date: {expense.get('date')}"
#             for expense in data.expenses
#         ]
#     )

#     prompt = f"""
# You are an AI financial assistant inside an expense tracking application.

# Answer the user's question using the user's financial data
# and the provided knowledge context.

# Do not invent financial information.

# User's Financial Statistics:
# {stats_context}

# User's Expense Data:
# {expense_context}

# Knowledge Context:
# {chr(10).join(results)}

# User's Question:
# {data.question}
# """

#     response = client.interactions.create(
#         model="gemini-3.7-flash",
#         input=prompt
#     )

#     return {
#         "question": data.question,
#         "answer": response.output_text,
#         "sources": results
#     }