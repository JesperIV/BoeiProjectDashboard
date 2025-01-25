<template>
    <div class="change-sensors-container">
      <!-- Title Bar -->
      <div class="title-bar">
        <h1>Change sensors for Boei with ID: {{ state.selectedBoei }}</h1>
      </div>
  
      <!-- Sensor Dropdowns -->
      <div class="form-group" v-for="(sensor, index) in sensors" :key="index">
        <label :for="sensor.id">{{ sensor.label }}</label>
        <select :id="sensor.id" v-model="sensor.selected">
          <option disabled value="">Select a sensor</option>
          <option v-for="option in sensor.options" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
  
      <!-- Set Sensors Button -->
      <button class="set-button" @click="setSensors">Set Sensors</button>
    </div>
  </template>
  
  <script setup>
    import { ref } from 'vue';
    import { state } from '@/scripts/store';

    // Define sensor dropdowns
    const sensors = ref([
      { id: 'oxygen', label: 'Oxygen Sensor', selected: '', options: ['Option 1', 'Option 2', 'Option 3'] },
      { id: 'ph', label: 'pH Sensor', selected: '', options: ['Option 1', 'Option 2', 'Option 3'] },
      { id: 'turbidity', label: 'Turbidity Sensor', selected: '', options: ['Option 1', 'Option 2', 'Option 3'] },
      { id: 'ec', label: 'Electrical Conductivity (EC) Sensor', selected: '', options: ['Option 1', 'Option 2', 'Option 3'] },
      { id: 'temperature', label: 'Temperature Sensor', selected: '', options: ['Option 1', 'Option 2', 'Option 3'] },
    ]);

    // Mock function for setting sensors
    const setSensors = () => {
      const selectedSensors = sensors.value.map((sensor) => ({
        label: sensor.label,
        selected: sensor.selected,
      }));
      if (selectedSensors.every((sensor) => sensor.selected)) {
        alert(`Sensors updated:\n${selectedSensors.map((s) => `${s.label}: ${s.selected}`).join('\n')}`);
      } else {
        alert('Please select options for all sensors before setting.');
      }
    };
  </script>
  
  <style scoped>
  /* Container styles */
  .change-sensors-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
    width: 100%;
    padding: 10px; /* Reduced padding */
    background-color: #f9f9f9;
    box-sizing: border-box;
  }
  
  /* Title Bar styles */
  .title-bar {
    margin-bottom: 10px; /* Reduced margin */
    text-align: center;
    width: 100%;
  }
  
  .title-bar h1 {
    font-size: 1.5rem; /* Reduced font size */
    color: #333;
  }
  
  /* Form styles */
  .form-group {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 500px; /* Reduced max width */
    margin-bottom: 10px; /* Reduced margin */
  }
  
  .form-group label {
    margin-bottom: 3px; /* Reduced margin */
    font-weight: bold;
    font-size: 0.85rem; /* Reduced font size */
    color: #555;
  }
  
  .form-group select {
    padding: 6px; /* Reduced padding */
    font-size: 0.9rem; /* Reduced font size */
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    cursor: pointer;
  }
  
  /* Set Sensors Button styles */
  .set-button {
    /* Im genuienly not sure why the button is small but ive been working for too long today so I guess it fits the reduced sizes */
    padding: 8px 16px; /* Reduced padding */
    font-size: 0.9rem; /* Reduced font size */
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 15px; /* Reduced margin */
  }
  
  .set-button:hover {
    background-color: #0056b3;
  }
  </style>
  