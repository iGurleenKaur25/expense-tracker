from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

text = "Deadlock occurs when processes wait for resources."

embedding = model.encode(text)

print(embedding)
print("Number of dimensions:", len(embedding))