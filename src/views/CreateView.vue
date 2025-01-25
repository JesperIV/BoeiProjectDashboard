<template>
    <div class="create-boei-container">
      <!-- Title Bar -->
      <div class="title-bar">
        <h1>Create Boei</h1>
      </div>
  
      <!-- Form -->
      <div class="form-container">
        <!-- Boei ID Input -->
        <div class="form-group">
          <label for="boei-id">Boei ID</label>
          <input
            id="boei-id"
            type="text"
            v-model="boeiId"
            placeholder="Enter Boei ID"
          />
        </div>
  
        <!-- Boei Name Input -->
        <div class="form-group">
          <label for="boei-name">Boei Name</label>
          <input
            id="boei-name"
            type="text"
            v-model="boeiName"
            placeholder="Enter Boei Name"
          />
        </div>
  
        <!-- Dropdown -->
        <div class="form-group">
          <label for="boei-status">Select Boei Status</label>
          <select id="boei-status" v-model="selectedState">
            <option disabled value="">Select an option</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
  
        <!-- Create Boei Button -->
        <button class="create-button" @click="handleCreate">
          Create Boei
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
    import { ref } from 'vue';

    // Reactive state for input fields and dropdown
    const boeiId = ref('');
    const boeiName = ref('');
    const selectedState = ref('');

    // Function to handle the Create Boei button click
    const handleCreate = () => {
      // Check if any of the fields are empty
      if (!boeiId.value || !boeiName.value || !selectedState.value) {
        alert('Please fill out all fields before creating the boei.');
        return;
      }
    
      //  POST
      const postData = {
        query: `INSERT INTO Boeien (ID_NAME, NAAM, STATUS)
        VALUES ('${boeiId.value}', '${boeiName.value}', '${selectedState.value}')`
      };

      fetch('http://141.144.198.96:1880/sqlquery', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
      })
      .then(response => response.json())
      .catch(error => {
          console.error('Fout bij het versturen van POST-verzoek:', error);
      });
    };
  </script>
  
  <style scoped>
  /* Container styles */
  .create-boei-container {
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 8px;
    max-width: 400px;
    margin: 0 auto;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    height: 100%;
    width: 100%;
  }
  
  /* Title Bar styles */
  .title-bar {
    margin-bottom: 20px;
    text-align: center;
  }
  
  .title-bar h1 {
    font-size: 1.8rem;
    color: #333;
  }
  
  /* Form styles */
  .form-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  .form-group label {
    margin-bottom: 5px;
    font-weight: bold;
    font-size: 0.9rem;
    color: #555;
  }
  
  .form-group input,
  .form-group select {
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .form-group select {
    cursor: pointer;
  }
  
  /* Button styles */
  .create-button {
    padding: 10px;
    font-size: 1.1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
  }
  
  .create-button:hover {
    background-color: #0056b3;
  }
  </style>
  