
let state = {
  assignmentName: "",
  requirements: []
};


const form = document.getElementById("assignment-form");
const titleInput = document.getElementById("assignment-title");
const reqInput = document.getElementById("requirement-input");
const listContainer = document.getElementById("requirements-list");
const displayTitle = document.getElementById("display-title");
const percentText = document.getElementById("percent-text");
const progressBar = document.getElementById("progress-bar");
const statsText = document.getElementById("stats-text");
const resetBtn = document.getElementById("reset-btn");

function render() {
 
  displayTitle.textContent = state.assignmentName ? state.assignmentName : "No Assignment Set";

 
  const total = state.requirements.length;
  const completedCount = state.requirements.filter(req => req.completed).length;
  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  percentText.textContent = `${percentage}% Done`;
  progressBar.style.width = `${percentage}%`;
  statsText.textContent = `${completedCount} of ${total} requirements completed`;

  listContainer.innerHTML = "";
  state.requirements.forEach(req => {
    const li = document.createElement("li");
    li.className = `task-item ${req.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <label>
        <input type="checkbox" ${req.completed ? 'checked' : ''} data-id="${req.id}">
        <span>${req.text}</span>
      </label>
      <button class="delete-btn" data-id="${req.id}">✕</button>
    `;
    listContainer.appendChild(li);
  });
}

// --- STATE EDITING FUNCTIONS ---
function addRequirement(text, assignmentTitle) {
  // Application Rules / Form Validation
  if (!text.trim()) {
    alert("Please enter a requirement description.");
    return;
  }

  // Set title if it is provided and not already configured
  if (assignmentTitle.trim() && !state.assignmentName) {
    state.assignmentName = assignmentTitle;
  } else if (!state.assignmentName) {
    state.assignmentName = "My Assignment";
  }

  // Push mutating change to state arrays
  const newRequirement = {
    id: Date.now(),
    text: text,
    completed: false
  };

  state.requirements.push(newRequirement);
  render(); // Change data -> render page
}

function toggleRequirement(id) {
  state.requirements = state.requirements.map(req => {
    if (req.id === parseInt(id)) {
      return { ...req, completed: !req.completed };
    }
    return req;
  });
  render();
}

function deleteRequirement(id) {
  state.requirements = state.requirements.filter(req => req.id !== parseInt(id));
  render();
}

function resetDashboard() {
  state.assignmentName = "";
  state.requirements = [];
  titleInput.value = "";
  render();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addRequirement(reqInput.value, titleInput.value);
  reqInput.value = ""; 
});

listContainer.addEventListener("change", (e) => {
  if (e.target.matches("input[type='checkbox']")) {
    toggleRequirement(e.target.dataset.id);
  }
});

listContainer.addEventListener("click", (e) => {
  if (e.target.matches(".delete-btn")) {
    deleteRequirement(e.target.dataset.id);
  }
});

resetBtn.addEventListener("click", resetDashboard);

render();
