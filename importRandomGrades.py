import json
import random
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase
cred = credentials.Certificate('serviceAccountKey.json')  # Update with your service account key path
firebase_admin.initialize_app(cred)
db = firestore.client()

# Load class data (copy from your importGrades.py or load from file)
classData = '''
{
    "1A": {
      "grade": "1",
      "students": [
        { "name": "Alice", "isAbsent": false, "notes": "" },
        { "name": "Bob", "isAbsent": false, "notes": "" },
        { "name": "Charlie", "isAbsent": false, "notes": "" },
        { "name": "Diana", "isAbsent": false, "notes": "" },
        { "name": "Eve", "isAbsent": false, "notes": "" },
        { "name": "Frank", "isAbsent": false, "notes": "" },
        { "name": "Grace", "isAbsent": false, "notes": "" },
        { "name": "Hank", "isAbsent": false, "notes": "" },
        { "name": "Ivy", "isAbsent": false, "notes": "" },
        { "name": "Jack", "isAbsent": false, "notes": "" },
        { "name": "Karen", "isAbsent": false, "notes": "" },
        { "name": "Leo", "isAbsent": false, "notes": "" },
        { "name": "Mona", "isAbsent": false, "notes": "" },
        { "name": "Nina", "isAbsent": false, "notes": "" },
        { "name": "Oscar", "isAbsent": false, "notes": "" },
        { "name": "Paul", "isAbsent": false, "notes": "" },
        { "name": "Quinn", "isAbsent": false, "notes": "" },
        { "name": "Rose", "isAbsent": false, "notes": "" },
        { "name": "Steve", "isAbsent": false, "notes": "" },
        { "name": "Tina", "isAbsent": false, "notes": "" },
        { "name": "Uma", "isAbsent": false, "notes": "" },
        { "name": "Victor", "isAbsent": false, "notes": "" },
        { "name": "Wendy", "isAbsent": false, "notes": "" },
        { "name": "Xander", "isAbsent": false, "notes": "" },
        { "name": "Yara", "isAbsent": false, "notes": "" }
      ]
    },
    "1B": {
      "grade": "1",
      "students": [
        { "name": "Aaron", "isAbsent": false, "notes": "" },
        { "name": "Bella", "isAbsent": false, "notes": "" },
        { "name": "Cody", "isAbsent": false, "notes": "" },
        { "name": "Daisy", "isAbsent": false, "notes": "" },
        { "name": "Ethan", "isAbsent": false, "notes": "" },
        { "name": "Fiona", "isAbsent": false, "notes": "" },
        { "name": "Gavin", "isAbsent": false, "notes": "" },
        { "name": "Holly", "isAbsent": false, "notes": "" },
        { "name": "Ian", "isAbsent": false, "notes": "" },
        { "name": "Jill", "isAbsent": false, "notes": "" },
        { "name": "Kyle", "isAbsent": false, "notes": "" },
        { "name": "Luna", "isAbsent": false, "notes": "" },
        { "name": "Mason", "isAbsent": false, "notes": "" },
        { "name": "Nora", "isAbsent": false, "notes": "" },
        { "name": "Owen", "isAbsent": false, "notes": "" },
        { "name": "Piper", "isAbsent": false, "notes": "" },
        { "name": "Quincy", "isAbsent": false, "notes": "" },
        { "name": "Riley", "isAbsent": false, "notes": "" },
        { "name": "Sam", "isAbsent": false, "notes": "" },
        { "name": "Tara", "isAbsent": false, "notes": "" },
        { "name": "Ulysses", "isAbsent": false, "notes": "" },
        { "name": "Vera", "isAbsent": false, "notes": "" },
        { "name": "Will", "isAbsent": false, "notes": "" },
        { "name": "Xena", "isAbsent": false, "notes": "" },
        { "name": "Yvonne", "isAbsent": false, "notes": "" }
      ]
    },
    "2A": {
      "grade": "2",
      "students": [
        { "name": "Abby", "isAbsent": false, "notes": "" },
        { "name": "Ben", "isAbsent": false, "notes": "" },
        { "name": "Clara", "isAbsent": false, "notes": "" },
        { "name": "Derek", "isAbsent": false, "notes": "" },
        { "name": "Elsa", "isAbsent": false, "notes": "" },
        { "name": "Felix", "isAbsent": false, "notes": "" },
        { "name": "Gloria", "isAbsent": false, "notes": "" },
        { "name": "Harvey", "isAbsent": false, "notes": "" },
        { "name": "Isla", "isAbsent": false, "notes": "" },
        { "name": "Jonah", "isAbsent": false, "notes": "" },
        { "name": "Kylie", "isAbsent": false, "notes": "" },
        { "name": "Liam", "isAbsent": false, "notes": "" },
        { "name": "Maya", "isAbsent": false, "notes": "" },
        { "name": "Noah", "isAbsent": false, "notes": "" },
        { "name": "Olive", "isAbsent": false, "notes": "" },
        { "name": "Preston", "isAbsent": false, "notes": "" },
        { "name": "Queenie", "isAbsent": false, "notes": "" },
        { "name": "Reed", "isAbsent": false, "notes": "" },
        { "name": "Sophie", "isAbsent": false, "notes": "" },
        { "name": "Travis", "isAbsent": false, "notes": "" },
        { "name": "Ursula", "isAbsent": false, "notes": "" },
        { "name": "Vince", "isAbsent": false, "notes": "" },
        { "name": "Whitney", "isAbsent": false, "notes": "" },
        { "name": "Ximena", "isAbsent": false, "notes": "" },
        { "name": "Yusuf", "isAbsent": false, "notes": "" }
      ]
    },
    "2B": {
      "grade": "2",
      "students": [
        { "name": "Aiden", "isAbsent": false, "notes": "" },
        { "name": "Brenda", "isAbsent": false, "notes": "" },
        { "name": "Caleb", "isAbsent": false, "notes": "" },
        { "name": "Delia", "isAbsent": false, "notes": "" },
        { "name": "Emmett", "isAbsent": false, "notes": "" },
        { "name": "Frida", "isAbsent": false, "notes": "" },
        { "name": "Gabe", "isAbsent": false, "notes": "" },
        { "name": "Hazel", "isAbsent": false, "notes": "" },
        { "name": "Irene", "isAbsent": false, "notes": "" },
        { "name": "Julian", "isAbsent": false, "notes": "" },
        { "name": "Kara", "isAbsent": false, "notes": "" },
        { "name": "Logan", "isAbsent": false, "notes": "" },
        { "name": "Mila", "isAbsent": false, "notes": "" },
        { "name": "Nico", "isAbsent": false, "notes": "" },
        { "name": "Orla", "isAbsent": false, "notes": "" },
        { "name": "Peter", "isAbsent": false, "notes": "" },
        { "name": "Quinn", "isAbsent": false, "notes": "" },
        { "name": "Rosa", "isAbsent": false, "notes": "" },
        { "name": "Sebastian", "isAbsent": false, "notes": "" },
        { "name": "Tess", "isAbsent": false, "notes": "" },
        { "name": "Uriel", "isAbsent": false, "notes": "" },
        { "name": "Violet", "isAbsent": false, "notes": "" },
        { "name": "Warren", "isAbsent": false, "notes": "" },
        { "name": "Xavi", "isAbsent": false, "notes": "" },
        { "name": "Yelena", "isAbsent": false, "notes": "" }
      ]
    },
    "3A": {
      "grade": "3",
      "students": [
        { "name": "Amy", "isAbsent": false, "notes": "" },
        { "name": "Blake", "isAbsent": false, "notes": "" },
        { "name": "Carmen", "isAbsent": false, "notes": "" },
        { "name": "Dev", "isAbsent": false, "notes": "" },
        { "name": "Eliza", "isAbsent": false, "notes": "" },
        { "name": "Finn", "isAbsent": false, "notes": "" },
        { "name": "Georgia", "isAbsent": false, "notes": "" },
        { "name": "Hector", "isAbsent": false, "notes": "" },
        { "name": "India", "isAbsent": false, "notes": "" },
        { "name": "Jasper", "isAbsent": false, "notes": "" },
        { "name": "Kate", "isAbsent": false, "notes": "" },
        { "name": "Lucas", "isAbsent": false, "notes": "" },
        { "name": "Madeline", "isAbsent": false, "notes": "" },
        { "name": "Neil", "isAbsent": false, "notes": "" },
        { "name": "Opal", "isAbsent": false, "notes": "" },
        { "name": "Perry", "isAbsent": false, "notes": "" },
        { "name": "Quora", "isAbsent": false, "notes": "" },
        { "name": "Ray", "isAbsent": false, "notes": "" },
        { "name": "Sasha", "isAbsent": false, "notes": "" },
        { "name": "Tom", "isAbsent": false, "notes": "" },
        { "name": "Usha", "isAbsent": false, "notes": "" },
        { "name": "Valerie", "isAbsent": false, "notes": "" },
        { "name": "Wyatt", "isAbsent": false, "notes": "" },
        { "name": "Xia", "isAbsent": false, "notes": "" },
        { "name": "Yanni", "isAbsent": false, "notes": "" }
      ]
    },
    "3B": {
      "grade": "3",
      "students": [
        { "name": "Aria", "isAbsent": false, "notes": "" },
        { "name": "Brody", "isAbsent": false, "notes": "" },
        { "name": "Cassie", "isAbsent": false, "notes": "" },
        { "name": "Dylan", "isAbsent": false, "notes": "" },
        { "name": "Eli", "isAbsent": false, "notes": "" },
        { "name": "Freya", "isAbsent": false, "notes": "" },
        { "name": "Gwen", "isAbsent": false, "notes": "" },
        { "name": "Harris", "isAbsent": false, "notes": "" },
        { "name": "Isabel", "isAbsent": false, "notes": "" },
        { "name": "Jonas", "isAbsent": false, "notes": "" },
        { "name": "Keira", "isAbsent": false, "notes": "" },
        { "name": "Lars", "isAbsent": false, "notes": "" },
        { "name": "Melody", "isAbsent": false, "notes": "" },
        { "name": "Noel", "isAbsent": false, "notes": "" },
        { "name": "Orion", "isAbsent": false, "notes": "" },
        { "name": "Phoebe", "isAbsent": false, "notes": "" },
        { "name": "Quaid", "isAbsent": false, "notes": "" },
        { "name": "Rina", "isAbsent": false, "notes": "" },
        { "name": "Silas", "isAbsent": false, "notes": "" },
        { "name": "Talia", "isAbsent": false, "notes": "" },
        { "name": "Ulrich", "isAbsent": false, "notes": "" },
        { "name": "Vada", "isAbsent": false, "notes": "" },
        { "name": "Wes", "isAbsent": false, "notes": "" },
        { "name": "Xenia", "isAbsent": false, "notes": "" },
        { "name": "Yuki", "isAbsent": false, "notes": "" }
      ]
    },
    "4A": {
      "grade": "4",
      "students": [
        { "name": "Anya", "isAbsent": false, "notes": "" },
        { "name": "Bryce", "isAbsent": false, "notes": "" },
        { "name": "Cleo", "isAbsent": false, "notes": "" },
        { "name": "Dante", "isAbsent": false, "notes": "" },
        { "name": "Esther", "isAbsent": false, "notes": "" },
        { "name": "Franklin", "isAbsent": false, "notes": "" },
        { "name": "Greta", "isAbsent": false, "notes": "" },
        { "name": "Hugo", "isAbsent": false, "notes": "" },
        { "name": "Imani", "isAbsent": false, "notes": "" },
        { "name": "Jake", "isAbsent": false, "notes": "" },
        { "name": "Kayla", "isAbsent": false, "notes": "" },
        { "name": "Logan", "isAbsent": false, "notes": "" },
        { "name": "Monica", "isAbsent": false, "notes": "" },
        { "name": "Nate", "isAbsent": false, "notes": "" },
        { "name": "Odette", "isAbsent": false, "notes": "" },
        { "name": "Parker", "isAbsent": false, "notes": "" },
        { "name": "Quentin", "isAbsent": false, "notes": "" },
        { "name": "Rory", "isAbsent": false, "notes": "" },
        { "name": "Selena", "isAbsent": false, "notes": "" },
        { "name": "Troy", "isAbsent": false, "notes": "" },
        { "name": "Unity", "isAbsent": false, "notes": "" },
        { "name": "Vanessa", "isAbsent": false, "notes": "" },
        { "name": "Wayne", "isAbsent": false, "notes": "" },
        { "name": "Xander", "isAbsent": false, "notes": "" },
        { "name": "Yasmin", "isAbsent": false, "notes": "" }
      ]
    },
    "4B": {
      "grade": "4",
      "students": [
        { "name": "Ariel", "isAbsent": false, "notes": "" },
        { "name": "Brady", "isAbsent": false, "notes": "" },
        { "name": "Camila", "isAbsent": false, "notes": "" },
        { "name": "Darren", "isAbsent": false, "notes": "" },
        { "name": "Emery", "isAbsent": false, "notes": "" },
        { "name": "Faye", "isAbsent": false, "notes": "" },
        { "name": "Graham", "isAbsent": false, "notes": "" },
        { "name": "Helena", "isAbsent": false, "notes": "" },
        { "name": "Isaac", "isAbsent": false, "notes": "" },
        { "name": "Jada", "isAbsent": false, "notes": "" },
        { "name": "Kian", "isAbsent": false, "notes": "" },
        { "name": "Lara", "isAbsent": false, "notes": "" },
        { "name": "Miles", "isAbsent": false, "notes": "" },
        { "name": "Nadia", "isAbsent": false, "notes": "" },
        { "name": "Omar", "isAbsent": false, "notes": "" },
        { "name": "Paige", "isAbsent": false, "notes": "" },
        { "name": "Quinn", "isAbsent": false, "notes": "" },
        { "name": "Rafael", "isAbsent": false, "notes": "" },
        { "name": "Sky", "isAbsent": false, "notes": "" },
        { "name": "Tina", "isAbsent": false, "notes": "" },
        { "name": "Uri", "isAbsent": false, "notes": "" },
        { "name": "Vivian", "isAbsent": false, "notes": "" },
        { "name": "Willa", "isAbsent": false, "notes": "" },
        { "name": "Xochitl", "isAbsent": false, "notes": "" },
        { "name": "Yaretzi", "isAbsent": false, "notes": "" }
      ]
    }
}
'''
classes = json.loads(classData)

# Grade structure
subjects = [
    'Period 1',
    'Period 2',
    'Period 3',
]
components = {
    'Period 1': ['Homework', 'Attendance', 'Exams'],
    'Period 2': ['Homework', 'Attendance', 'Exams'],
    'Period 3': ['Homework', 'Attendance', 'Exams'],
}

semesters = ['semester1', 'semester2',]

def random_grade():
    return random.randint(60, 100)

def random_grade_list(n=3):
    return [random.randint(60, 100) for _ in range(n)]

def generate_random_grades():
    grades = {}
    for semester in semesters:
        grades[semester] = {}
        for subject in subjects:
            grades[semester][subject] = {}
            for comp in components[subject]:
                grades[semester][subject][comp] = random_grade_list()
    return grades

# Upload random grades for each student in each class
def upload_random_grades():
    for class_name, class_info in classes.items():
        for student in class_info['students']:
            student_name = student['name']
            grades = generate_random_grades()
            # You can use student_name as the document ID or add a unique field
            doc_ref = db.collection('grades').document(student_name)
            doc_ref.set({
                'name': student_name,
                'class': class_name,
                'grades': grades
            })
            print(f"Uploaded grades for {student_name} in {class_name}")

if __name__ == "__main__":
    upload_random_grades()
