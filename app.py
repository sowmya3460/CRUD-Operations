from flask import Flask, render_template, request, jsonify
import json
import os
from model import predict_result

app = Flask(__name__)

DATA_FILE = "data.json"

# Load data
def load_data():
    if not os.path.exists(DATA_FILE):
        return []

    with open(DATA_FILE, "r") as file:
        return json.load(file)

# Save data
def save_data(data):
    with open(DATA_FILE, "w") as file:
        json.dump(data, file, indent=4)

# Home page
@app.route("/")
def home():
    return render_template("index.html")

# GET all students
@app.route("/students", methods=["GET"])
def get_students():
    data = load_data()
    return jsonify(data)

# CREATE student
@app.route("/students", methods=["POST"])
def create_student():
    data = load_data()

    student = request.json

    result = predict_result(
        student["marks"],
        student["attendance"]
    )

    student["result"] = result

    data.append(student)
    save_data(data)

    return jsonify({
        "message": "Student added successfully"
    })

# UPDATE student
@app.route("/students/<int:index>", methods=["PUT"])
def update_student(index):
    data = load_data()

    if index >= len(data):
        return jsonify({"error": "Student not found"}), 404

    updated_student = request.json

    result = predict_result(
        updated_student["marks"],
        updated_student["attendance"]
    )

    updated_student["result"] = result

    data[index] = updated_student

    save_data(data)

    return jsonify({
        "message": "Student updated successfully"
    })

# DELETE student
@app.route("/students/<int:index>", methods=["DELETE"])
def delete_student(index):
    data = load_data()

    if index >= len(data):
        return jsonify({"error": "Student not found"}), 404

    data.pop(index)

    save_data(data)

    return jsonify({
        "message": "Student deleted successfully"
    })

if __name__ == "__main__":
    app.run(debug=True)