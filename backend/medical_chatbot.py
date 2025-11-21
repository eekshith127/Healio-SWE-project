import os
import requests
import json

# Read OpenRouter API key from environment for safety
# Set before running, e.g. (PowerShell on Windows):
#   $env:OPENROUTER_API_KEY = "sk-or-..."
API_KEY = os.getenv("OPENROUTER_API_KEY")

if not API_KEY:
    raise RuntimeError(
        "OPENROUTER_API_KEY environment variable is not set. "
        "Please set it to your OpenRouter API key."
    )

SYSTEM_PROMPT = (
    "You are a friendly medical assistant. You provide only basic health "
    "information, general wellness tips, and simple explanations. You do NOT "
    "diagnose medical conditions, prescribe medications, or replace "
    "professional medical advice."
)


def chat():
    print("Medical Chatbot (type 'exit' to quit)\n")

    while True:
        user_input = input("You: ")

        if user_input.lower() == "exit":
            break

        try:
            response = requests.post(
                url="https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {API_KEY}",
                    "Content-Type": "application/json",
                },
                data=json.dumps({
                    "model": "nvidia/nemotron-nano-9b-v2:free",
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": user_input},
                    ],
                }),
                timeout=30,
            )

            response.raise_for_status()
            data = response.json()
            reply = data["choices"][0]["message"]["content"]
            print("Bot:", reply, "\n")

        except Exception as e:
            print("Bot: Sorry, I had an issue talking to the API:", e, "\n")


if __name__ == "__main__":
    chat()
