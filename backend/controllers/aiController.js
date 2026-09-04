const askAI = async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                message: "Question is required"
            });
        }

        const response = await fetch("https://expense-tracker-ai-5i1q.onrender.com/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                question: question
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);

    } catch (error) {
        console.error("AI service error:", error);

        res.status(500).json({
            message: "Could not connect to AI service"
        });
    }
};

module.exports = {
    askAI
};