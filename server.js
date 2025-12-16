import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Transcribe video
async function transcribeYouTube(videoUrl) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = "Please provide a word-for-word transcription of this video. Include timestamps if possible.";

    const result = await model.generateContent([
        prompt,
        {
            fileData: {
                mimeType: "video/mp4",
                fileUri: videoUrl
            }
        }
    ]);

    const response = await result.response;
    return response.text(); 
}

// Summarize transcript into paragraph
async function summarizeTranscript(transcriptText) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
Here is a transcript of a YouTube video:

"${transcriptText}"

Please provide a concise summary of this video in paragraph form, covering the main points only. Do not include timestamps.
`;

    const result = await model.generateContent([prompt]);
    const response = await result.response;
    return response.text();
}

// Chat flow state
let awaiting = null;

app.post("/agent", async (req, res) => {
    const { message } = req.body;

    // Step 1: User says hi
    if (message.toLowerCase() === "hi") {
        awaiting = "yes_or_no";
        return res.json({
            message: "Hello! I am your YouTube Agent 🤖. I can summarize YouTube videos for you. Would you like me to do that?"
        });
    }

    //  User responds yes/no
    if (awaiting === "yes_or_no") {
        if (message.toLowerCase() === "yes") {
            awaiting = "video_url";
            return res.json({ message: "Great! Please share your YouTube video link." });
        } else {
            awaiting = null;
            return res.json({ message: "No problem! Let me know if you change your mind." });
        }
    }

    //  User sends video URL
    if (awaiting === "video_url") {
        try {
            const transcript = await transcribeYouTube(message);

            // Generate concise summary from transcript
            const summary = await summarizeTranscript(transcript);

            awaiting = null;
            return res.json({
                message: "Here's a concise summary of your video:",
                summary: summary
            });
        } catch (err) {
            console.error(err);
            return res.json({ message: "Sorry, I could not process that video. Please try another link." });
        }
    }
    res.json({ message: "I didn't understand that. Please say 'hi' to start." });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("YouTube Agent running on port 3000");
});
