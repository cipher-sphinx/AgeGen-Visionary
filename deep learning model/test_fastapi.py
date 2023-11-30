import requests

# Define the URL of the FastAPI endpoint
url = "http://localhost:8000/predict/"

# Create a dictionary with the file to upload
files = {"files": ("test_image_1.jpeg", open("C:\Users\devel\OneDrive\Desktop\test_image_1.jpeg", "rb"))}


# Send the POST request with the file
response = requests.post(url, files=files)

# Print the response
print(response.status_code)
print(response.json())
