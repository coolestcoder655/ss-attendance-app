import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import os

# Get the directory of this script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Initialize Firebase Admin
cred_path = os.path.join(script_dir, "attendance-app-ss-firebase-adminsdk-fbsvc-06fcdb7f42.json")
cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred)

# Connect to Firestore
db = firestore.client()

# Fetch all documents from the 'submissions' collection
docs = db.collection('submissions').stream()

# Store combined student data
combined_students = []

for doc in docs:
    record = doc.to_dict()

    students = record["submittedClasses"]["students"]
    grade = record["submittedClasses"]["grade"]
    period = record["period"]
    date = record.get("datetime")

    # Convert Firestore timestamp to string
    if hasattr(date, 'isoformat'):
        date = date.isoformat()

    for student in students:
        combined_entry = {
            "name": student["name"],
            "isAbsent": student["isAbsent"],
            "notes": student["notes"],
            "grade": grade,
            "period": period,
            "date": date
        }
        combined_students.append(combined_entry)

# Convert to DataFrame
df = pd.DataFrame(combined_students)

# Export to Excel
output_file = os.path.join(script_dir, "combined_students.xlsx")
df.to_excel(output_file, index=False)

print(f"Excel file saved: {output_file}")
