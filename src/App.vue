<script setup>
  import { defineAsyncComponent, ref } from 'vue';
  import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
  } from 'chart.js';
  import { Line } from 'vue-chartjs';
  import { RouterView } from 'vue-router';
  import { state } from '@/scripts/store';

  console.log('setup...');  //  Added because sometimes console.log wouldnt work.

  //  Register required Chart.js components
  ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

  //  Placeholder data for graphs
  const createGraphData = (label) => ({
    labels: ['01/01/25 12:00:00', '01/01/25 12:05:00', '01/01/25 12:10:00', '01/01/25 12:15:00'],
    datasets: [
      {
        label: label,
        data: [0, 0, 0, 0],
        borderColor: '#007bff',
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  });

  const oxygenData = createGraphData('Oxygen');
  const phData = createGraphData('pH');
  const turbidityData = createGraphData('Turbidity');
  const ecData = createGraphData('EC');
  const temperatureData = createGraphData('Temperature');

  const chartOptions = (yLabel) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: yLabel,
        },
      },
    },
  });

  const today = new Date().toISOString().split('T')[0]; //  Get the current date for the datepicker
  const currentDate = ref(today);

  //  Save the selected boei ID in scripts/store.js for usage in router sections
  const selectedBoei = ref('');
  const saveSelection = () => {
    state.selectedBoei = selectedBoei.value;
    updateGraphs();
  };
  
  fetch('http://141.144.198.96:1880/getList?type=alleboeien')
  .then(response => {
      if (!response.ok) {
          throw new Error('Netwerk reaction was NOT okay');
      }
      return response.json();
  })
  .then(data => {
      data.forEach(boei => {
          document.getElementById('selected-boei').innerHTML += `<option value="${boei.ID_NAME}">${boei.NAAM} (${boei.ID_NAME})</option>`;
      });
  })
  .catch(error => {
      console.error('There is a problem with receiving the boeienlijst:', error);
  });
  
  //  Update the graphs with the selected boei
  const updateGraphs = () => {
    console.log('Start updateGraphs');

    // Het GET-request for EC readings of selected boei
    fetch('http://141.144.198.96:1880/getlist?type=egvvanboeiperdag&boeien_id_name=' + state.selectedBoei + '&datum=' + currentDate.value)
    .then(response => {
      if (!response.ok) {
          throw new Error('Netwerk reaction was NOT okay');
      }
      return response.json();
    })
    .then(data => {
      // Clear the existing data in the EC chart
      ecData.labels = [];
      ecData.datasets[0].data = [];
      
      // Add new data to the EC chart

      const newLabels = [];
      const newData = [];

      data.forEach((reading) => {
        const timestamp = new Date(reading.DATUM_TIJD).toLocaleString();  // Convert the timestamp
        //ecData.labels.push(timestamp);  // Add timestamp to the labels
        //ecData.datasets[i].data.push(parseFloat(reading.EGV));  // Add the value to the dataset
        //i++;

        newLabels.push(timestamp);
        newData.push(parseFloat(reading.EGV));

        console.log('Added data:', timestamp, reading.EGV);
      });

      // Trigger chart update
      ecData.labels = newLabels;
      ecData.datasets[0].data = newData;

      console.log(newData);
    })
    .catch(error => {
      console.error('There is a problem with receiving the boeienlijst:', error);
    });
  }
</script>

<template>
  <div id="app">
    <div class="container">
      <!-- Main section with graphs -->
      <section class="main-section">
        <div class="header">
          <span class="headerText" id="username">Username</span>

          <div class="boei-selector">
            <label class="headerText" for="selected-boei">Select Boei: </label>
            <select id="selected-boei" v-model="selectedBoei">
              <option disabled value="" selected>BoeiName (BoeiID)</option> <!-- Added this because Vue Router is praying on my downfall -->
            </select>
            <label class="headerText" for="selected-date"> & Select Date: </label>
            <input type="date" id="selected-date" v-model="currentDate" />
            <button class="set-button" @click="saveSelection">Set</button>
          </div>

          <div class="date-selector">
            

          </div>

          <button class="logout-button">Logout</button>
        </div>

        <div class="graphs-container">
          <!-- Oxygen Graph -->
          <div class="graph">
            <Line
              :data="oxygenData"
              :options="chartOptions('Oxygen')"
            />
          </div>
        
          <!-- pH Graph -->
          <div class="graph">
            <Line
              :data="phData"
              :options="chartOptions('pH')"
            />
          </div>
        
          <!-- Turbidity Graph -->
          <div class="graph">
            <Line
              :data="turbidityData"
              :options="chartOptions('Turbidity')"
            />
          </div>
        
          <!-- Electrical Conductivity Graph -->
          <div class="graph">
            <Line
              :data="ecData"
              :options="chartOptions('Electrical Conductivity')"
            />
          </div>
        
          <!-- Temperature Graph -->
          <div class="graph">
            <Line
              :data="temperatureData"
              :options="chartOptions('Temperature (°C)')"
            />
          </div>
        </div>
      </section>

      <section class="right-section">
        <section class="top-section">
          <RouterView />
        </section>
        <section class="bottom-section">
          <div class="button-grid">
            <RouterLink class="routerLink" to="/">
              <button class="grid-button" id="info-button">Selected Boei Info</button>
            </RouterLink>
            <RouterLink class="routerLink" to="/create">
              <button class="grid-button" id="create-button">Create Boei</button>
            </RouterLink>
            <RouterLink class="routerLink" to="/change">
              <button class="grid-button" id="change-button">Change Boei Sensors</button>
            </RouterLink>
            <RouterLink class="routerLink" to="/sensor">
              <button class="grid-button" id="sensor-button">Create Sensor</button>
            </RouterLink>
            <RouterLink class="routerLink" to="/location">
              <button class="grid-button" id="location-button">Boei Location History</button>
            </RouterLink>
            <RouterLink class="routerLink" to="/history">
              <button class="grid-button" id="history-button">Sensor History</button>
            </RouterLink>
            <RouterLink class="routerLink" to="/description">
              <button class="grid-button" id="description-button">Set Sensor Description</button>
            </RouterLink>
            <RouterLink class="routerLink" to="">
              <button class="grid-button" id="account-button"></button> <!-- Empty button until all info on account stuff has been made clear in our group -->
            </RouterLink>
          </div>
        </section>
      </section>
    </div>
  </div>
</template>

<style scoped>
  body {
    margin: 0;
  }

  .container {
    display: flex;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  .main-section {
    flex: 4;
    background-color: lightblue;
    display: flex;
    flex-direction: column;
    padding: 0px; /* Otherwise everything shrinks :( */
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;
    background-color: #ffffff;
    border-bottom: 1px solid #ccc;
    font-size: 1.2rem;
  }

  .headerText {
    font-size: 1.4rem;
    color: grey;
  }

  .set-button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 12px;
    margin-left: 5px;
    cursor: pointer;
    font-size: 1.2rem;
  }

  .set-button:hover {
    background-color: #0056b3;
  }

  .boei-selector input,
  .boei-selector select {
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    outline: none;
  }

  .logout-button {
    background-color: #ff8888;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 1.2rem;
  }

  .logout-button:hover {
    background-color: #ff1a1a;
  }

  .graphs-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding-left: 10px;
    padding-right: 10px;
    gap: 3px;
    overflow: hidden;
  }

  .graph {
    flex: 1;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
  }

  .right-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-left: rgb(116, 113, 113) 1px solid;
  }

  .top-section {
    flex: 1;
    background-color: rgb(255, 239, 239);
  }

  .bottom-section {
    flex: 1;
    background-color: rgb(177, 144, 238);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .button-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(4, 1fr);
    width: 100%;
    height: 100%;
    gap: 0;
  }

  .grid-button {
    width: 100%;
    height: 100%;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 0;
    font-size: 1rem;
    cursor: pointer;
  }

  .grid-button:hover {
    background-color: #f0f0f0;
  }

  .routerLink {
    padding: 0;
  }
</style>
