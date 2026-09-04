from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def load_chunks():

    with open("documents/os_notes.txt", "r", encoding="utf-8") as file:
        text = file.read()

    chunks = text.split("\n\n")

    return chunks


def retrieve(question, chunks, top_k=2):

    vectorizer = TfidfVectorizer()

    chunk_vectors = vectorizer.fit_transform(chunks)

    question_vector = vectorizer.transform([question])

    similarities = cosine_similarity(
        question_vector,
        chunk_vectors
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