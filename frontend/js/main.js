// frontend/js/main.js

// API URL - point to your backend server
const API_URL = 'http://localhost:5000/api';

// DOM Elements
const loginBtn = document.querySelector('.login-btn');
const signupBtn = document.querySelector('.signup-btn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.querySelector('.close-modal');
const loginForm = document.getElementById('loginForm');
const alumniGrid = document.getElementById('alumniProfiles');
const alumniSearch = document.getElementById('alumniSearch');
const industryFilter = document.getElementById('industryFilter');
const yearFilter = document.getElementById('yearFilter');

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
        // Update UI for logged in user
        document.querySelector('.auth-buttons').innerHTML = `
            <button class="profile-btn">My Profile</button>
            <button class="logout-btn">Logout</button>
        `;

        // Add event listeners for new buttons
        document.querySelector('.profile-btn').addEventListener('click', () => {
            alert('Profile feature coming soon!');
        });

        document.querySelector('.logout-btn').addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.reload();
        });
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();

    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            // Save token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Close modal and update UI
            loginModal.style.display = 'none';
            checkAuth();

            // Show success message
            alert('Login successful!');
        } else {
            alert(data.message || 'Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred. Please try again later.');
    }
}

// Load alumni profiles from API
async function loadAlumniProfilesFromAPI() {
  if (!alumniGrid) return;

  try {
      const response = await fetch(`${API_URL}/alumni`);
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      // Check if the response is valid
      if (!data || !data.success) {
          console.error('Invalid API response:', data);
          loadSampleAlumniProfiles();  // Load sample data if API fails
          return;
      }

      // Clear previous profiles
      alumniGrid.innerHTML = '';

      // Check if the response contains alumni data
      if (data.message === 'Alumni routes are working') {
          console.log('API is working, but no alumni data found.');
          loadSampleAlumniProfiles();  // Load sample data if no alumni data is returned
          return;
      }

      // If alumni data is present, render it
      if (Array.isArray(data.data)) {
          data.data.forEach(alumni => {
              const user = alumni.user || {};
              const alumniCard = document.createElement('div');
              alumniCard.className = 'alumni-card';
              alumniCard.innerHTML = `
                  <div class="alumni-image">
                      <img src="${user.profileImage || 'images/default-profile.jpg'}" alt="${user.firstName || 'Unknown'} ${user.lastName || ''}">
                  </div>
                  <div class="alumni-info">
                      <h3>${user.firstName || 'Unknown'} ${user.lastName || ''}</h3>
                      <p class="alumni-role">${alumni.role || 'N/A'} at ${alumni.company || 'N/A'}</p>
                      <p class="alumni-meta"><i class="fas fa-industry"></i> ${alumni.industry || 'N/A'}</p>
                      <p class="alumni-meta"><i class="fas fa-map-marker-alt"></i> ${alumni.location || 'N/A'}</p>
                      <p class="alumni-meta"><i class="fas fa-graduation-cap"></i> Class of ${user.graduationYear || 'N/A'}</p>
                      <div class="alumni-actions">
                          <button class="connect-btn" data-id="${alumni._id}">Connect</button>
                          <button class="message-btn" data-id="${alumni._id}">Message</button>
                      </div>
                  </div>
              `;
              alumniGrid.appendChild(alumniCard);
          });
      } else {
          console.error('Invalid alumni data format:', data);
          loadSampleAlumniProfiles();  // Load sample data if alumni data is invalid
      }
  } catch (error) {
      console.error('Error loading alumni profiles:', error);
      loadSampleAlumniProfiles();  // Load fallback data if an error occurs
  }
}

// Fallback sample alumni profiles function
function loadSampleAlumniProfiles() {
    console.log("Loading sample alumni profiles...");
    alumniGrid.innerHTML = `
        <p class="error-message">Failed to load alumni profiles. Please try again later.</p>
    `;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status
    checkAuth();

    // Try to load alumni profiles from API, fallback to sample data
    loadAlumniProfilesFromAPI();

    // Modal functionality
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            loginModal.style.display = 'flex';
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            loginModal.style.display = 'none';
        });
    }

    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Alumni search and filter functionality
    [alumniSearch, industryFilter, yearFilter].forEach(element => {
        if (element) {
            element.addEventListener('change', function() {
                loadAlumniProfilesFromAPI();
            });
        }
    });

    if (alumniSearch) {
        alumniSearch.addEventListener('keyup', function() {
            loadAlumniProfilesFromAPI();
        });
    }
});