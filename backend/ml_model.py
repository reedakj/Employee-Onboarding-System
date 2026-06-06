import pickle
import os
import numpy as np
from sklearn.ensemble import RandomForestClassifier

# The 3 possible results our model can predict
STATUS_LABELS = ["On Track", "At Risk", "Delayed"]

# What badge color/style to show for each status
BADGE_STYLE = {
    "On Track": {"color": "#15803d", "bg": "#dcfce7", "icon": "✅"},
    "At Risk":  {"color": "#b45309", "bg": "#fef3c7", "icon": "⚠️"},
    "Delayed":  {"color": "#b91c1c", "bg": "#fee2e2", "icon": "🔴"},
}

def train_and_save_model():
    """
    This function creates fake training data and teaches
    the ML model to predict onboarding status.
    It saves the result to model.pkl
    """
    print("Training model...")

    # We create 600 fake employee examples to train on
    rng = np.random.default_rng(42)
    n = 600

    total_tasks      = rng.integers(5, 20, n)
    tasks_completed  = np.array([rng.integers(0, t + 1) for t in total_tasks])
    total_progress   = rng.integers(5, 30, n)
    completed_prog   = np.array([rng.integers(0, t + 1) for t in total_progress])
    pending_prog     = total_progress - completed_prog

    # Calculate how far along each employee is
    completion_rate = tasks_completed / np.maximum(total_tasks, 1)
    progress_rate   = completed_prog  / np.maximum(total_progress, 1)

    # Label each example: 0=On Track, 1=At Risk, 2=Delayed
    labels = []
    for cr, pr, pend in zip(completion_rate, progress_rate, pending_prog):
        if cr >= 0.6 and pr >= 0.5:
            labels.append(0)   # On Track
        elif cr >= 0.3 or pr >= 0.3:
            labels.append(1)   # At Risk
        else:
            labels.append(2)   # Delayed

    # Build the feature matrix (what the model looks at)
    X = np.column_stack([
        tasks_completed,
        total_tasks,
        completed_prog,
        pending_prog,
        total_progress,
    ])
    y = np.array(labels)

    # Train the Random Forest model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)

    # Save it to a file so Flask can use it
    model_path = os.path.join(os.path.dirname(__file__), "model.pkl")
    with open(model_path, "wb") as f:
        pickle.dump({"model": model, "labels": STATUS_LABELS}, f)

    print("✅ model.pkl saved successfully!")


def predict_status(tasks_completed, total_tasks, completed_progress, pending_progress, total_progress):
    """
    Given numbers about an employee, returns their predicted status.
    Example return value:
    {
      "status": "At Risk",
      "badge": { "color": "...", "bg": "...", "icon": "⚠️" }
    }
    """
    model_path = os.path.join(os.path.dirname(__file__), "model.pkl")

    # If model doesn't exist yet, train it first
    if not os.path.exists(model_path):
        train_and_save_model()

    with open(model_path, "rb") as f:
        saved = pickle.load(f)

    model  = saved["model"]
    labels = saved["labels"]

    features = np.array([[
        tasks_completed,
        total_tasks,
        completed_progress,
        pending_progress,
        total_progress,
    ]])

    prediction = model.predict(features)[0]
    status     = labels[int(prediction)]

    return {
        "status": status,
        "badge":  BADGE_STYLE[status]
    }