// Check if we are running locally on our computer
export const URL = window.location.href.includes('localhost')
  ? 'http://localhost:5000/api'  // Local Backend
  : 'https://se-project-gkzu.onrender.com/api'; // <--- YOUR NEW RENDER BACKEND