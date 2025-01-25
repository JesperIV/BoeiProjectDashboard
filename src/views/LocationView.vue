<template>
    <div class="location-history-container">
      <!-- Title Bar -->
      <div class="title-bar">
        <h1>Location History</h1>
      </div>
  
      <!-- Dropdown to Select a Boei -->
      <div class="form-group">
        <label for="select-boei">Select Boei</label>
        <select id="select-boei" v-model="selectedBoei" @change="updateLocationHistory">
          <option disabled value="">Select a Boei</option>
          <option></option>
          <option
            v-for="boei in boeiList"
            :key="boei.id"
            :value="boei.id"
          >
            {{ boei.name }}
          </option>
        </select>
      </div>
  
      <!-- Location History Display -->
      <!-- Thank you Gijs for helping with this -->
      <div v-if="locationHistory.length" class="location-history">
        <div v-for="(historyItem, index) in locationHistory" :key="index" class="history-item">
          <span class="history-time">{{ historyItem.time }}</span>
          <span class="history-coordinate">{{ historyItem.latitude }}, {{ historyItem.longitude }}</span>
        </div>
      </div>
      <div v-else class="no-history">No location history available for the selected Boei.</div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // Het GET-request for boei data
  fetch('http://141.144.198.96:1880/getList?type=alleboeien')
  .then(response => {
      if (!response.ok) {
          throw new Error('Netwerk reaction was NOT okay');
      }
      return response.json();
  })
  .then(data => {
      data.forEach(boei => {
        document.getElementById('select-boei').innerHTML += `<option value="${boei.ID_NAME}">${boei.NAAM}</option>`;
      });
  })
  .catch(error => {
      console.error('There is a problem with receiving the boeienlijst:', error);
  });

  //  Get locations and time
  let tempIsoDate = new Date(); //  Make an empty date to format the date received from the fetch request which is in ISO 8601 (apparently)
  const getLocations = () => {
    console.log('Starting fetch request.');
    fetch('http://141.144.198.96:1880/getlist?type=geschiedenisboei&boeien_id_name=' + selectedBoei.value)
    .then(response => {
        if (!response.ok) {
            throw new Error('Netwerk reaction was NOT okay');
        }
        return response.json();
    })
    .then(data => {
        data.forEach(location => {
          console.log(location);
          tempIsoDate = new Date(location.START_DATUM_HISTORIE); //  Format the date

          locationHistory.value.push({
            time: tempIsoDate.toLocaleString(), //  Format the date
            latitude: location.BREEDTEGRAAD,
            longitude: location.LENGTEGRAAD,
          });
        });
    })
    .catch(error => {
        console.error('There is a problem with receiving the boeienlijst:', error);
    });
  }

  // Boei list
  const boeiList = ref([]);
  
  // State for the selected Boei
  const selectedBoei = ref('');
  
  // data for location history
  const locationHistory = ref([]);
  
  // Update location history when a new Boei is selected
  const updateLocationHistory = () => {
    console.log('Requesting location history for Boei:', selectedBoei.value);
    locationHistory.value = [];
    getLocations();
  };
  </script>
  
  <style scoped>
  /* Container styles */
  .location-history-container {
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
  
  /* Location History Display styles */
  .location-history {
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
  }
  
  .history-time {
    font-weight: bold;
    color: #333;
  }
  
  .history-coordinate {
    color: #555;
  }
  
  .no-history {
    text-align: center;
    color: #888;
    font-style: italic;
  }
  </style>
  