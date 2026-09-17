const projects = document.querySelectorAll(".project");

let currentProject = 0;
let clickHint = null;

function createClickHint() {
  clickHint = document.createElement("div");

  clickHint.className = "project-click-hint";
  clickHint.textContent = "​🖱️​";

  clickHint.style.position = "fixed";
  clickHint.style.zIndex = "9999";
  clickHint.style.pointerEvents = "none";
  clickHint.style.fontSize = "42px";
  clickHint.style.transform = "translate(-50%, -50%)";
  clickHint.style.transition = "left 0.4s ease, top 0.4s ease, opacity 0.3s ease";
  clickHint.style.opacity = "0";

  document.body.appendChild(clickHint);
}

function moveClickHint() {
  if (!clickHint || currentProject >= projects.length) {
    return;
  }

  const currentCard = projects[currentProject];
  const rect = currentCard.getBoundingClientRect();

  clickHint.style.left = `${rect.left + rect.width / 2}px`;
  clickHint.style.top = `${rect.top + rect.height / 2}px`;
  clickHint.style.opacity = "1";
}

function showNextProject() {
  if (currentProject >= projects.length) {
    return;
  }

  const currentCard = projects[currentProject];

  currentCard.classList.add("is-visible");

  setTimeout(() => {
    moveClickHint();
  }, 100);
}

function handleProjectClick(event) {
  const clickedProject = event.currentTarget;

  if (!clickedProject.classList.contains("is-visible")) {
    return;
  }

  if (projects[currentProject] !== clickedProject) {
    return;
  }

  currentProject++;

  clickHint.style.opacity = "0";

  if (currentProject < projects.length) {
    setTimeout(() => {
      showNextProject();
    }, 400);
  } else {
    setTimeout(() => {
      clickHint.remove();
      clickHint = null;
    }, 400);
  }
}

projects.forEach((project) => {
  project.addEventListener("click", handleProjectClick);
});

createClickHint();
showNextProject();