from sklearn.linear_model import LogisticRegression
import numpy as np

# Sample training data
X = np.array([
    [20, 1],
    [80, 1],
    [30, 0],
    [90, 1],
    [40, 0],
    [70, 1]
])

# Output
y = np.array([0, 1, 0, 1, 0, 1])

model = LogisticRegression()
model.fit(X, y)

def predict_result(marks, attendance):
    prediction = model.predict([[marks, attendance]])
    return "Pass" if prediction[0] == 1 else "Fail"