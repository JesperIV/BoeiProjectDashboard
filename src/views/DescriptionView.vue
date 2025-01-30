<template>
  <div class="set-sensor-description-container">
    <!-- Title Bar -->
    <div class="title-bar">
      <h1>Set Sensor Description</h1>
    </div>

    <!-- Dropdown to Select a Sensor -->
    <div class="form-group">
      <label for="select-sensor">Select Sensor</label>
      <select id="select-sensor" v-model="selectedSensor" @change="resetDescription">
        <option disabled value="">Select a sensor</option>
      </select>
    </div>

    <!-- Dropdown to Select a Status -->
    <div class="form-group">
      <label for="select-status">Select Status</label>
      <select id="select-status" v-model="selectedStatus">
        <option disabled value="">Select a status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Maintenance">Maintenance</option>
      </select>
    </div>

    <!-- Text Field for Description -->
    <div class="form-group">
      <label for="sensor-description">Description</label>
      <textarea
        id="sensor-description"
        v-model="description"
        rows="4"
        placeholder="Enter a description for the selected status"
      ></textarea>
    </div>

    <!-- Set Status Button -->
    <div class="form-group">
      <button class="set-button" @click="setSensorDescription">Set Status</button>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  // Het fetch-request for sensor data
  fetch('https://ricky-boeien.ddns.net:1880/getList?type=allesensors')
  .then(response => {
      if (!response.ok) {
          throw new Error('Netwerk reaction was NOT okay');
      }
      return response.json();
  })
  .then(data => {
      data.forEach(sensor => {
        document.getElementById('select-sensor').innerHTML += `<option value="${sensor.SERIENUMMER}">${sensor.SENSOR_NAAM}</option>`;
      });
  })
  .catch(error => {
      console.error('There is a problem with receiving the boeienlijst:', error);
  });

  // State for selected sensor, status, and description
  const selectedSensor = ref('');
  const selectedStatus = ref('');
  const description = ref('');
  let dateNow = new Date(); // for getting the current date and time when setting the sensor status
  let dateNowFormatted = '';

  // Reset description when sensor is changed
  const resetDescription = () => {
    description.value = ''; // Clear the description when a new sensor is selected
  };

  // Function to set the sensor status and description
  const setSensorDescription = () => {
    if (selectedSensor.value && selectedStatus.value && description.value) {
      handleSQL();
    } else {
      alert('Please select a sensor, a status, and enter a description before setting.');
    }
  };

  const handleSQL = () => {
    dateNow = Date.now();

    const postData = {
        query: `INSERT INTO SENSORHISTORIES (DATUM_EN_TIJD, BESCHRIJVING, STATUS, SENSORS_SERIENUMMER)
        VALUES (SYSTIMESTAMP AT TIME ZONE 'Europe/Amsterdam', '${description.value}', '${selectedStatus.value}', '${selectedSensor.value}')`
      };

      fetch('https://ricky-boeien.ddns.net:1880/sqlquery', {
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

      alert('Sensor status and description have been set successfully.');
  }
</script>

<style scoped>
  /* Container styles */
  .set-sensor-description-container {
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
    max-width: 600px;
    margin-bottom: 15px;
  }

  .form-group label {
    margin-bottom: 2px;
    font-weight: bold;
    font-size: 0.9rem;
    color: #555;
  }

  .form-group select,
  .form-group textarea {
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    cursor: pointer;
  }

  .form-group textarea {
    resize: none;
  }

  /* Set Button styles */
  .set-button {
    padding: 10px 20px;
    font-size: 1rem;
    color: #fff;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  .set-button:hover {
    background-color: #0056b3;
  }
</style>
