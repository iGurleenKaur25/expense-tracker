import { useState } from "react";
import { askAI } from "../api/aiApi";

function AIAssistant() {

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAsk = async () => {

        if (!question.trim()) {
            return;
        }

        try {
            setLoading(true);
            setAnswer("");

            const data = await askAI(question);

            setAnswer(data.answer);

        } catch (error) {

    console.error("AI ERROR:", error);

    setAnswer(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong while contacting the AI."
    );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>AI Financial Assistant</h1>

            <input
                type="text"
                placeholder="Ask about your finances..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />

            <button onClick={handleAsk}>
                {loading ? "Thinking..." : "Ask AI"}
            </button>

            {answer && (
                <div>
                    <h3>AI Response</h3>
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
}

export default AIAssistant;