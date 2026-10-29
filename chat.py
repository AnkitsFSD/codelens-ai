import os
import sys
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client()

chat = client.chats.create(model="gemini-2.5-flash")

print("=" * 55)
print("🤖 Gemini AI Chat Ready! (Type 'exit' ya 'quit' to stop)")
print("=" * 55)

while True:
    try:
        user_input = input("\nYou: ").strip()
        if not user_input:
            continue
            
        if user_input.lower() in ["exit", "quit", "q"]:
            print("\nExiting chat. Keep building!")
            break

        print("Gemini: ", end="", flush=True)
        response = chat.send_message(user_input)
        print(response.text)

    except KeyboardInterrupt:
        print("\n\nSession stopped.")
        break
    except Exception as e:
        print(f"\n❌ Error: {e}")