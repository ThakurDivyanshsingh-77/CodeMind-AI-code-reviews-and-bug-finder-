import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
print("API Key:", api_key)
genai.configure(api_key=api_key)

try:
    models = genai.list_models()
    for m in models:
        print(m.name, m.supported_generation_methods)
except Exception as e:
    print("Error:", e)
