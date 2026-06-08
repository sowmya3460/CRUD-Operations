let editIndex = -1;

async function fetchStudents() {

    const response = await fetch('/students');
    const students = await response.json();

    const table = document.getElementById('studentTable');
    table.innerHTML = '';

    let pass = 0;
    let fail = 0;

    students.forEach((student, index) => {

        if (student.result.toLowerCase() === "pass") {
            pass++;
        } else {
            fail++;
        }

        const badge =
            student.result.toLowerCase() === "pass"
                ? '<span class="badge-pass">PASS</span>'
                : '<span class="badge-fail">FAIL</span>';

        table.innerHTML += `
            <tr>
                <td>${student.name}</td>
                <td>${student.marks}</td>
                <td>${student.attendance}</td>
                <td>${badge}</td>

                <td>
                    <button class="edit-btn"
                            onclick="editStudent(${index})">
                        Edit
                    </button>

                    <button class="delete-btn"
                            onclick="deleteStudent(${index})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });

    const totalStudents = document.getElementById("totalStudents");
    const passCount = document.getElementById("passCount");
    const failCount = document.getElementById("failCount");

    if (totalStudents) totalStudents.innerText = students.length;
    if (passCount) passCount.innerText = pass;
    if (failCount) failCount.innerText = fail;
}

async function addStudent() {

    const name = document.getElementById('name').value;
    const marks = parseInt(document.getElementById('marks').value);
    const attendance = parseInt(document.getElementById('attendance').value);

    if (!name || isNaN(marks) || isNaN(attendance)) {
        alert("Please fill all fields");
        return;
    }

    const studentData = {
        name,
        marks,
        attendance
    };

    if (editIndex !== -1) {

        await fetch(`/students/${editIndex}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });

        editIndex = -1;

        document.getElementById("addBtn").innerText = "Add Student";
    }
    else {

        await fetch('/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });
    }

    clearForm();
    fetchStudents();
}

async function deleteStudent(index) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    await fetch(`/students/${index}`, {
        method: 'DELETE'
    });

    fetchStudents();
}

async function editStudent(index) {

    const response = await fetch('/students');
    const students = await response.json();

    const student = students[index];

    document.getElementById('name').value = student.name;
    document.getElementById('marks').value = student.marks;
    document.getElementById('attendance').value = student.attendance;

    editIndex = index;

    document.getElementById("addBtn").innerText = "Update Student";
}

function clearForm() {

    document.getElementById('name').value = '';
    document.getElementById('marks').value = '';
    document.getElementById('attendance').value = '';
}

document.addEventListener("DOMContentLoaded", () => {

    fetchStudents();

    const searchInput = document.getElementById("searchInput");

    if (searchInput) {

        searchInput.addEventListener("keyup", function () {

            const value = this.value.toLowerCase();

            document.querySelectorAll("#studentTable tr")
                .forEach(row => {

                    row.style.display =
                        row.innerText.toLowerCase().includes(value)
                            ? ""
                            : "none";
                });
        });
    }
});