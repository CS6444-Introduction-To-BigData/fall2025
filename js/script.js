// Hamburger menu toggle
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

// Light/Dark mode toggle with persistence
const modeToggle = document.getElementById("modeToggle");

// Apply saved mode on load
document.addEventListener("DOMContentLoaded", () => {
  const savedMode = localStorage.getItem("theme");
  if (savedMode === "dark") {
    document.body.classList.add("dark");
    modeToggle.textContent = "☀️";
  } else {
    document.body.classList.remove("dark");
    modeToggle.textContent = "🌙";
  }
});

// Toggle mode + save preference
modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  modeToggle.textContent = isDark ? "☀️" : "🌙";
});
