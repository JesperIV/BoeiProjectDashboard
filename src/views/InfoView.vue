<template>
  <div class="selected-boei-container">
    <!-- Title Bar -->
    <div class="title-bar">
      <h1>Selected Boei Info</h1>
    </div>

    <!-- Dropdown to Select a Boei -->
    <div class="form-group">
      <label for="select-boei">Select Boei</label>
      <select id="select-boei" v-model="selectedBoei" @change="updateBoeiInfo">
        <option disabled value="">Select a Boei</option>
        <option
          v-for="boei in boeiList"
          :key="boei.id"
          :value="boei.id"
        >
          {{ boei.name }}
        </option>
      </select>
    </div>

    <!-- Boei Info Display -->
    <div v-if="selectedBoeiInfo" class="boei-info">
      <div class="info-row" v-for="(value, key) in selectedBoeiInfo" :key="key">
        <span class="info-label">{{ formatKey(key) }}:</span>
        <span class="info-value">{{ value }}</span>
      </div>
    </div>

    <!-- Dropdown to Set Status -->
    <div class="form-group">
      <label for="set-status">Set Status</label>
      <div class="status-row">
        <select id="set-status" v-model="status">
          <option disabled value="">Select a status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="maintenance">Maintenance</option>
        </select>
        <button class="set-button" @click="setStatus">Set</button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  
  // Het GET-request for boei data
  fetch('https://ricky-boeien.ddns.net:1880/getList?type=alleboeien')
  .then(response => {
      if (!response.ok) {
          throw new Error('Netwerk reaction was NOT okay');
      }
      return response.json();
  })
  .then(data => {
      data.forEach(boei => {  //  Sometimes adds one Boei twice?? But only on this page it seems
        document.getElementById('select-boei').innerHTML += `<option value="${boei.NAAM}">${boei.NAAM}</option>`;
      });
  })
  .catch(error => {
      console.error('There is a problem with receiving the boeienlijst:', error);
  });

  //  Boei list
  const boeiList = ref(['']); // This may have to have the '' because sometimes when it doesnt the Boei data won't show :(

  // Het GET-request for geselecteerde boei data
  fetch('https://ricky-boeien.ddns.net:1880/getlist?type=locatievanboei&boeien_id_name=260BE4CC')
    .then(response => {
        if (!response.ok) {
            throw new Error('Netwerk reaction was NOT okay');
        }
        return response.json();
    })
    .then(data => {
        data.forEach(boei => {
          const newBoei = {
            id: boei.BOEIEN_ID_NAME,
            name: boei.NAAM,
            latitude: boei.BREEDTEGRAAD,
            longitude: boei.LENGTEGRAAD,
          };
          boeiList.value.push(newBoei);
        });
    })
    .catch(error => {
        console.error('There is a problem with receiving the boeienlijst:', error);
    });

  // State for the selected Boei and its details
  const selectedBoei = ref('');
  const selectedBoeiInfo = ref(null);
  // State for Boei status
  const status = ref('');
  // Update displayed Boei info when a new Boei is selected
  const updateBoeiInfo = () => {
    selectedBoeiInfo.value = boeiList.value.find((boei) => boei.id === selectedBoei.value) || null;
  };
  // Format keys for better display
  const formatKey = (key) => {
    const keyMap = {
      id: 'Boei ID',
      name: 'Boei Name',
      latitude: 'Latitude',
      longitude: 'Longitude',
    };
    return keyMap[key] || key;
  };
  // Mock function to handle setting the status
  const setStatus = () => {
    if (selectedBoeiInfo.value && status.value) {
      alert(`Status for ${selectedBoeiInfo.value.name} set to ${status.value}`);
    } else {
      alert('Please select a Boei and a status before setting.');
    }
  };
</script>

<style scoped>
  /* Container styles */
  .selected-boei-container {
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

  .status-row {
    display: flex;
    gap: 10px;
    align-items: center;
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

  /* Boei Info Display styles */
  .boei-info {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 600px;
    margin-bottom: 15px;
    padding: 15px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .info-label {
    font-weight: bold;
    color: #333;
  }

  .info-value {
    color: #555;
  }
</style>
  