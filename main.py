from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
model = OllamaLLM(model="llama2")

template = """"
You are a helpful assistant that assists the user with his code in all the possible coding laguages

here are some examples of how you can help the user: {examples}

here is the question from the user: {question}
"""
prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model
while True:
    print("Welcome to the coding assistant!")
    question = input("Ask your question (q to quit): ")
    print("\n\n----------------------------------\n\n")
    if question == "q":
        break   
    result = chain.invoke({"examples":[], "question": question})
    print(result)
