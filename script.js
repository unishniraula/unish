// Base global script functionality
document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearElem = document.getElementById('year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
});
