import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

df = pd.read_csv("students.csv")

X = df[['study_hours', 'attendance', 'assignments']]
y = df['result']

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X, y)

os.makedirs("model", exist_ok=True)

joblib.dump(model, "model/student_model.pkl")

print("Model trained successfully!")