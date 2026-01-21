// Elements
const inputBox = document.getElementById("inputBox");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const deadlineInput = document.getElementById("deadlineInput");
const priorityInput = document.getElementById("priorityInput");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const dateTime = document.getElementById("dateTime");
const filterButtons = document.querySelectorAll(".filter");

/* ---------------- Date & Time (WITH SECONDS) ---------------- */
function updateDateTime() {
  const now = new Date();
  dateTime.innerText = now.toLocaleString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    
  });
}
updateDateTime();
setInterval(updateDateTime);

/* ---------------- Progress ---------------- */
function updateProgress() {
  const total = todoList.children.length;
  const completed = todoList.querySelectorAll(".done").length;

  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  progressBar.style.width = percent + "%";
  progressText.innerText = percent + "%";
}

/* ---------------- Create Todo ---------------- */
function createTodo(text, deadline, priority) {
  const li = document.createElement("li");
  li.classList.add(`priority-${priority}`);

  li.innerHTML = `
    <div class="todo-top">
      <p>${text}</p>
      <div class="actions">
        <button class="btn completeBtn">Done</button>
        <button class="btn deleteBtn">Delete</button>
      </div>
    </div>
    <div class="meta">
      ${deadline ? "⏰ " + new Date(deadline).toLocaleString() : "No deadline"}
      • Priority: ${priority.toUpperCase()}
    </div>
  `;

  todoList.appendChild(li);
}

/* ---------------- Add Todo ---------------- */
function addTodo() {
  const text = inputBox.value.trim();
  const deadline = deadlineInput.value;
  const priority = priorityInput.value || "medium";

  if (!text) {
    alert("Task cannot be empty");
    return;
  }

  createTodo(text, deadline, priority);

  inputBox.value = "";
  deadlineInput.value = "";
  priorityInput.value = "";

  updateProgress();
}

/* ---------------- Todo Actions ---------------- */
todoList.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;

  // MARK COMPLETE (ONE TIME ONLY)
  if (e.target.classList.contains("completeBtn")) {
    if (li.classList.contains("done")) return;

    alert("The Task is marked as complete");

    li.classList.add("done");

    // Disable task
    e.target.disabled = true;
    e.target.innerText = "Completed";
    e.target.style.opacity = "0.6";
    e.target.style.cursor = "not-allowed";

    updateProgress();
    applyCurrentFilter();
  }

  // DELETE
  if (e.target.classList.contains("deleteBtn")) {
    li.remove();
    updateProgress();
  }
});

/* ---------------- Filters ---------------- */
function applyCurrentFilter() {
  const activeBtn = document.querySelector(".filter.active");
  const filter = activeBtn ? activeBtn.dataset.filter : "all";

  const todos = todoList.querySelectorAll("li");

  todos.forEach(todo => {
    if (filter === "all") {
      todo.style.display = "block";
    } else if (filter === "active") {
      todo.style.display = todo.classList.contains("done") ? "none" : "block";
    } else if (filter === "completed") {
      todo.style.display = todo.classList.contains("done") ? "block" : "none";
    }
  });
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    applyCurrentFilter();
  });
});

/* ---------------- Events ---------------- */
addBtn.addEventListener("click", addTodo);
inputBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTodo();
});
