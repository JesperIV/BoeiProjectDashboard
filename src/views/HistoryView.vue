<template>
  <div class="sensor-history-container">
    <!-- Title Bar -->
    <div class="title-bar">
      <h1>Sensor History</h1>
    </div>

    <!-- Dropdown to Select a Sensor -->
    <div class="form-group">
      <label for="select-sensor">Select Sensor</label>
      <select id="select-sensor" v-model="selectedSensor" @change="updateSensorHistory">
        <option disabled value="">Select a sensor</option>
        <option></option> <!-- Another empty option because otherwise some browsers may automatically pick a real option, which causes the data never be shown -->
      </select>
    </div>

    <h4 style="color: #888;">For more info please click list item</h4>
    <!-- Sensor History Display -->
    <div v-if="sensorHistory.length" class="sensor-history">
      <div
        v-for="(historyItem, index) in sensorHistory"
        :key="index"
        class="history-item"
        @click="showStatusDescription(historyItem)"
      >
        <span class="history-time">{{ historyItem.time }}</span>
        <span class="history-status">{{ historyItem.status }}</span>
      </div>
    </div>
    <div v-else class="no-history">No status history available for the selected sensor.</div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  
  // State for the selected sensor
  const selectedSensor = ref('');
  
  // Placeholder data for sensor status history
  const sensorHistory = ref([]);
  
  // Update sensor status history when a new sensor is selected
  const updateSensorHistory = () => {
    if (selectedSensor.value) {
      fetchSensorHistory();
    } else {
      sensorHistory.value = [];
    }
  };
  
  // Het GET-request for sensor data
  fetch('http://141.144.198.96:1880/getList?type=allesensors')
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

  let tempIsoDate = new Date(); //  Make an empty date to format the date received from the fetch request which is in ISO 8601 (apparently)
  const fetchSensorHistory = () => {
    sensorHistory.value = [];

    fetch('http://141.144.198.96:1880/getlist?type=geschiedenisspecifiekesensor&sensor_serienummer=' + selectedSensor.value)
    .then(response => {
        if (!response.ok) {
            throw new Error('Netwerk reaction was NOT okay');
        }
        return response.json();
    })
    .then(data => {
        data.forEach(state => {  //  Sometimes adds one Boei twice??
          tempIsoDate = new Date(state.DATUM_EN_TIJD); //  Format the date

          sensorHistory.value.push({ 
            time: tempIsoDate.toLocaleString(),
            status: state.STATUS, 
            description: state.BESCHRIJVING });
        });
    })
    .catch(error => {
        console.error('There is a problem with receiving the boeienlijst:', error);
    });
  }

  // Show an alert with the status description when a history item is clicked
  const showStatusDescription = (historyItem) => {
    alert(`Status: ${historyItem.status}\nDescription: ${historyItem.description}`);
  };
</script>

<style scoped>
  /* Container styles */
  .sensor-history-container {
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
    margin-bottom: 5px;
    font-weight: bold;
    font-size: 0.9rem;
    color: #555;
  }

  .form-group select {
    padding: 10px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    cursor: pointer;
  }

  /* Sensor History Display styles */
  .sensor-history {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 600px;
    margin-top: 15px;
  }

  .history-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }

  .history-item:hover {
    background-color: #f1f1f1;
  }

  .history-time {
    font-weight: bold;
    color: #333;
  }

  .history-status {
    color: #555;
  }

  .no-history {
    text-align: center;
    color: #888;
    font-style: italic;
  }
</style>
