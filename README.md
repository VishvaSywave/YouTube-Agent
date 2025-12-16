# YouTube Agent 

A Node.js application that acts as a **YouTube video assistant**. It can transcribe and summarize YouTube videos into concise paragraph summaries using **Google Gemini AI**.

---

## Features

- Chat-like interface via HTTP API
- User-friendly flow:
  1. User says `hi` → agent introduces itself
  2. User says `yes` → agent asks for YouTube URL
  3. User sends video URL → agent returns a **concise paragraph summary**
- Summarizes long videos quickly
- Returns clean paragraph summary **without timestamps**
- Built with **Node.js**, **Express**, and **Google Gemini AI**

---

## Requirements

- Node.js v24+  
- Google Gemini AI API Key  
- YouTube video URL

---

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd YouTube_Agent
