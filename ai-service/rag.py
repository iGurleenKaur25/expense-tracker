from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer("all-MiniLM-L6-v2")


def load_chunks():
    with open("documents/os_notes.txt", "r", encoding="utf-8") as file:
        text = file.read()

    chunks = text.split("\n\n")

    return chunks


def retrieve(question, chunks, top_k=2):

    chunk_embeddings = model.encode(chunks)
    question_embedding = model.encode([question])

    similarities = cosine_similarity(
        question_embedding,
        chunk_embeddings
    )[0]

    top_indices = similarities.argsort()[-top_k:][::-1]

    results = []

    for index in top_indices:
        results.append(chunks[index])

    return results


def build_prompt(question, results):

    context = "\n\n".join(results)

    prompt = f"""
Answer the question using only the provided context.

If the answer is not present in the context, say:
"I don't have enough information in the provided documents."

Context:
{context}

Question:
{question}
"""

    return prompt