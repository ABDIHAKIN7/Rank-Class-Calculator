const $ = id => document.getElementById(id);

/* PAGE SWITCH */
function showPage(pageId) {
  document.querySelectorAll(".page")
    .forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  if(pageId === 'list') displayStudents(); // Update list when List page opens
}

/* DATA */
let students = JSON.parse(localStorage.getItem("history")) || [];

document.addEventListener("DOMContentLoaded", displayStudents);

function allowLettersOnly(input) {
  input.value = input.value
    .replace(/[^a-zA-Z ]/g, "")
    .replace(/\s+/g, " ");
}

function calculateRank() {
  const name = $("studentName").value.trim();
  const marks = +$("marks").value;

  if (!/^[A-Za-z]+( [A-Za-z]+)+$/.test(name))
    return show("Geli magac dhammeystiran (Ahmed Ali)", "red");

  if (marks < 0 || marks > 100)
    return show("Geli marks sax ah (0 - 100)", "red");

  if (students.some(s => s.name.toLowerCase() === name.toLowerCase()))
    return show("Ardaygan hore ayuu ugu jiraa liiska ❗", "orange");

  const grade =
    marks >= 90 ? "A+" :
    marks >= 80 ? "A" :
    marks >= 70 ? "B" :
    marks >= 60 ? "C" :
    marks >= 50 ? "D" : "F";

  students.push({ name, marks, grade });
  students.sort((a, b) => b.marks - a.marks);

  localStorage.setItem("history", JSON.stringify(students));

  const rank = students.findIndex(s => s.name === name) + 1;

  show(`${name} | Marks: ${marks} | Grade: ${grade} | Rank: ${rank}`, "#00ffcc");

  $("studentName").value = "";
  $("marks").value = "";

  displayStudents();
}

/* DISPLAY STUDENTS IN LIST */
function displayStudents() {
  const history = $("history");
  if (!history) return;

  if (students.length === 0) {
    history.innerHTML = "<li style='opacity:0.7'>Empty Student</li>";
    return;
  }

  history.innerHTML = students
    .map((s, i) =>
      `<li>
        <span>${i + 1}. ${s.name} — ${s.marks} (${s.grade})</span>
        <button class="delete-btn" onclick="deleteStudent(${i})">🗑</button>
      </li>`
    )
    .join("");
}

/* DELETE SINGLE STUDENT */
function deleteStudent(index) {
  if (!confirm(`Ma hubtaa inaad tirtirayso ${students[index].name}?`)) return;

  students.splice(index, 1);
  localStorage.setItem("history", JSON.stringify(students));
  displayStudents();
}

/* CLEAR ALL HISTORY */
function clearHistory() {
  if (!confirm("Ma hubtaa inaad tirtirayso dhamaan ardayda?")) return;

  localStorage.clear();
  students = [];
  displayStudents();
  show("History waa la tiray ✔", "#00ffcc");
}

function show(msg, color) {
  const r = $("result");
  if (!r) return;
  r.style.color = color;
  r.innerHTML = msg;
}