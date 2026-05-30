from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///employees.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    department = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), default="Pending")

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task_name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(500))
    status = db.Column(db.String(50), default="Pending")

class Progress(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'), nullable=False)
    task_id = db.Column(db.Integer, db.ForeignKey('task.id'), nullable=False)
    status = db.Column(db.String(50), default="Pending")

@app.route('/')
def home():
    return jsonify({"message": "Employee Onboarding Backend Working Successfully"})

@app.route('/api/employees', methods=['GET', 'POST'])
def employees():
    if request.method == 'GET':
        all_employees = Employee.query.all()
        result = []
        for emp in all_employees:
            result.append({
                "id": emp.id,
                "name": emp.name,
                "department": emp.department,
                "status": emp.status
            })
        return jsonify(result), 200

    if request.method == 'POST':
        data = request.get_json()
        new_emp = Employee(
            name=data['name'],
            department=data['department'],
            status=data.get('status', 'Pending')
        )
        db.session.add(new_emp)
        db.session.commit()
        return jsonify({"message": "Employee Added Successfully"}), 201

@app.route('/api/employees/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def employee_by_id(id):
    employee = Employee.query.get(id)
    if not employee:
        return jsonify({"message": "Employee Not Found"}), 404

    if request.method == 'GET':
        return jsonify({
            "id": employee.id,
            "name": employee.name,
            "department": employee.department,
            "status": employee.status
        }), 200

    if request.method == 'PUT':
        data = request.get_json()
        employee.name = data.get('name', employee.name)
        employee.department = data.get('department', employee.department)
        employee.status = data.get('status', employee.status)
        db.session.commit()
        return jsonify({"message": "Employee Updated Successfully"}), 200

    if request.method == 'DELETE':
        db.session.delete(employee)
        db.session.commit()
        return jsonify({"message": "Employee Deleted Successfully"}), 200

@app.route('/api/tasks', methods=['GET', 'POST'])
def tasks():
    if request.method == 'GET':
        all_tasks = Task.query.all()
        result = []
        for task in all_tasks:
            result.append({
                "id": task.id,
                "task_name": task.task_name,
                "description": task.description,
                "status": task.status
            })
        return jsonify(result), 200

    if request.method == 'POST':
        data = request.get_json()
        new_task = Task(
            task_name=data['task_name'],
            description=data.get('description', ''),
            status=data.get('status', 'Pending')
        )
        db.session.add(new_task)
        db.session.commit()
        return jsonify({"message": "Task Added Successfully"}), 201

@app.route('/api/tasks/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def task_by_id(id):
    task = Task.query.get(id)
    if not task:
        return jsonify({"message": "Task Not Found"}), 404

    if request.method == 'GET':
        return jsonify({
            "id": task.id,
            "task_name": task.task_name,
            "description": task.description,
            "status": task.status
        }), 200

    if request.method == 'PUT':
        data = request.get_json()
        task.task_name = data.get('task_name', task.task_name)
        task.description = data.get('description', task.description)
        task.status = data.get('status', task.status)
        db.session.commit()
        return jsonify({"message": "Task Updated Successfully"}), 200

    if request.method == 'DELETE':
        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": "Task Deleted Successfully"}), 200

@app.route('/api/progress', methods=['GET', 'POST'])
def progress():
    if request.method == 'GET':
        all_progress = Progress.query.all()
        result = []
        for p in all_progress:
            result.append({
                "id": p.id,
                "employee_id": p.employee_id,
                "task_id": p.task_id,
                "status": p.status
            })
        return jsonify(result), 200

    if request.method == 'POST':
        data = request.get_json()
        new_progress = Progress(
            employee_id=data['employee_id'],
            task_id=data['task_id'],
            status=data.get('status', 'Pending')
        )
        db.session.add(new_progress)
        db.session.commit()
        return jsonify({"message": "Task Assigned Successfully"}), 201

@app.route('/api/progress/<int:id>', methods=['PUT'])
def update_progress(id):
    progress = Progress.query.get(id)
    if not progress:
        return jsonify({"message": "Progress Not Found"}), 404

    data = request.get_json()
    progress.status = data.get('status', progress.status)
    db.session.commit()
    return jsonify({"message": "Progress Updated Successfully"}), 200

@app.route('/api/dashboard', methods=['GET'])
def dashboard():
    total_employees = Employee.query.count()
    total_tasks = Task.query.count()
    completed = Progress.query.filter_by(status='Completed').count()
    pending = Progress.query.filter_by(status='Pending').count()
    in_progress = Progress.query.filter_by(status='In Progress').count()

    return jsonify({
        "total_employees": total_employees,
        "total_tasks": total_tasks,
        "completed_tasks": completed,
        "pending_tasks": pending,
        "in_progress_tasks": in_progress
    }), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)