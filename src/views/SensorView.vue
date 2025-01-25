<template>
    <div class="create-sensor-container">
      <!-- Title Bar -->
      <div class="title-bar">
        <h1>Create Sensor</h1>
      </div>
  
      <!-- Input Fields -->
      <div class="form-group">
        <label for="sensor-id">Sensor ID</label>
        <input id="sensor-id" v-model="sensorId" type="text" placeholder="Enter Sensor ID" />
      </div>
  
      <div class="form-group">
        <label for="sensor-name">Sensor Name</label>
        <input id="sensor-name" v-model="sensorName" type="text" placeholder="Enter Sensor Name" />
      </div>
  
      <!-- Sensor Type Dropdown -->
      <div class="form-group">
        <label for="sensor-type">Sensor Type</label>
        <select id="sensor-type" v-model="sensorType">
          <option disabled value="">Select Sensor Type</option>
          <option>Oxygen</option>
          <option>pH</option>
          <option>Turbidity</option>
          <option>Electrical Conductivity (EC)</option>
          <option>Temperature</option>
        </select>
      </div>
  
      <!-- Create Sensor Button -->
      <button class="create-button" @click="createSensor">Create Sensor</button>
    </div>
  </template>
  
  <script setup>
    import { ref } from 'vue';
    
    // Input field values
    const sensorId = ref('');
    const sensorName = ref('');
    const sensorType = ref('');
    const sensorUnit = ref(''); // Added sensor unit which is linked to type
    
    //  Function for when button is pressed
    const createSensor = () => {
      if (!sensorId.value || !sensorName.value || !sensorType.value) {
        alert('Please fill out all fields before creating the sensor.');
        return;
      }
    
      // Set sensor unit based on sensor type
      switch(sensorType.value) {
        case 'Oxygen':
          sensorUnit.value = 'mg/L';
          break;
        case 'pH':
          sensorUnit.value = 'pH';
          break;
        case 'Turbidity':
          sensorUnit.value = 'NTU';
          break;
        case 'Electrical Conductivity (EC)':
          sensorUnit.value = 'µS/cm';
          break;
        case 'Temperature':
          sensorUnit.value = '°C';
          break;
      }
    
      //  POST
      const postData = {
        query: `INSERT INTO Sensors (SERIENUMMER, SENSOR_NAAM, TYPE, EENHEID)
        VALUES ('${sensorId.value}', '${sensorName.value}', '${sensorType.value}', '${sensorUnit.value}')`
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
  .create-sensor-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
    width: 100%;
    padding: 20px;
    background-color: #f9f9f9;
    box-sizing: border-box;
  }
  
  /* Title Bar styles */
  .title-bar {
    margin-bottom: 20px;
    text-align: center;
    width: 100%;
  }
  
  .title-bar h1 {
    font-size: 1.8rem;
    color: #333;
  }
  
  /* Form styles */
  .form-group {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 700px;
    margin-bottom: 15px;
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
    width: 100%;
    box-sizing: border-box;
    outline: none;
  }
  
  .form-group input:focus,
  .form-group select:focus {
    border-color: #007bff;
  }
  
  /* Create Sensor Button styles */
  .create-button {
    padding: 10px 24px;
    font-size: 1rem;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    max-width: 700px;
  }
  
  .create-button:hover {
    background-color: #0056b3;
  }
  </style>
  