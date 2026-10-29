import os
import sys
from dotenv import load_dotenv

# Step 1: Check .env load
print("1. Loading .env file...")
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ ERROR: GEMINI_API_KEY nahi mili! Check karo ki .env file me key sahi se save hai.")
    sys.exit(1)
else:
    print(f"✅ Key mil gayi: {api_key[:6]}... (masked)")

# Step 2: Google GenAI Client
print("2. Initializing client...")
from google import genai

client = genai.Client()

print("3. Sending request to Gemini (waiting for response)...")
try:
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Say 'Hello Developer! Connection successful.' in one short line."
    )
    print("\n--- AI Response ---")
    print(response.text)
except Exception as e:
    print(f"\n❌ Error aaya: {e}")