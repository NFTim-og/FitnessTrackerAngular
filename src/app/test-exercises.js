// Simple script to test the exercises endpoint
const token = localStorage.getItem('fitness_tracker_token');
fetch('http://localhost:3000/api/v1/exercises', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(data => {
  console.log('Exercises data:', data);
})
.catch(error => {
  console.error('Error fetching exercises:', error);
});
