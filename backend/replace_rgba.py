import sys

with open('evaluation.py', 'r') as f:
    text = f.read()

text = text.replace("'rgba(255,255,255,0.1)'", "(1.0, 1.0, 1.0, 0.1)")
text = text.replace("'rgba(255,255,255,0.2)'", "(1.0, 1.0, 1.0, 0.2)")

with open('evaluation.py', 'w') as f:
    f.write(text)

print("Replaced RGBA strings")
