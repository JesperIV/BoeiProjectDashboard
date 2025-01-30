<template>
    <div class="change-sensors-container">
      <!-- Title Bar -->
      <div class="title-bar">
        <h1>Change sensors for Boei with ID: {{ state.selectedBoei }}</h1>
      </div>

      <div class="form-group">
        <label for="oxygenOption">Oxygen Sensor</label>
        <select id="oxygenOption">
          <option disabled value="">Select a sensor</option>
        </select>

        <label for="phOption">pH Sensor</label>
        <select id="phOption">
          <option disabled value="">Select a sensor</option>
        </select>

        <label for="turbOption">Turbidity Sensor</label>
        <select id="turbOption">
          <option disabled value="">Select a sensor</option>
        </select>

        <label for="ecOption">Electrical Conductivity (EC) Sensor</label>
        <select id="ecOption">
          <option disabled value="">Select a sensor</option>
        </select>

        <label for="tempOption">Temperature Sensor</label>
        <select id="tempOption">
          <option disabled value="">Select a sensor</option>
        </select>
      </div>
  
      <!-- Set Sensors Button -->
      <button class="set-button" @click="setSensors">Set Sensors</button>
    </div>
  </template>
  
  <script setup>
    import { state } from '@/scripts/store';

    let oldSensors = {  //  Object to store old sensors
      oxygen: '',
      ph: '',
      turbidity: '',
      ec: '',
      temperature: '',
    };

    //  Get options for each sensor
    fetch('https://ricky-boeien.ddns.net:1880/getList?type=allesensors')
    .then(response => {
        if (!response.ok) {
            throw new Error('Netwerk reaction was NOT okay');
        }
        return response.json();
    })
    .then(data => {
        data.forEach(sensor => {
          if(sensor.TYPE === 'Oxygen') {
            document.getElementById('oxygenOption').innerHTML += `<option value="${sensor.SERIENUMMER}">${sensor.SENSOR_NAAM}</option>`;
          } else if(sensor.TYPE === 'pH') {
            document.getElementById('phOption').innerHTML += `<option value="${sensor.SERIENUMMER}">${sensor.SENSOR_NAAM}</option>`;
          } else if(sensor.TYPE === 'Turbidity') {
            document.getElementById('turbOption').innerHTML += `<option value="${sensor.SERIENUMMER}">${sensor.SENSOR_NAAM}</option>`;
          } else if(sensor.TYPE === 'Electrical Conductivity (EC)') {
            document.getElementById('ecOption').innerHTML += `<option value="${sensor.SERIENUMMER}">${sensor.SENSOR_NAAM}</option>`;
          } else if(sensor.TYPE === 'Temperature') {
            document.getElementById('tempOption').innerHTML += `<option value="${sensor.SERIENUMMER}">${sensor.SENSOR_NAAM}</option>`;
          }
        });
    })
    .catch(error => {
        console.error('There is a problem with receiving the boeienlijst:', error);
    });

    //  Set current sensors as default option if a Boei is selected
    if (state.selectedBoei === '') {  // Check if a Boei is selected
      alert('No Boei selected!\nPlease select a Boei and reopen this section.');  // For some reason pushing a router path doesnt work, so for now I use an alert with instructions
    } else {
      fetch('https://ricky-boeien.ddns.net:1880/getList?type=sensorsperboei&boeien_id_name=' + state.selectedBoei)
      .then(response => {
          if (!response.ok) {
              throw new Error('Netwerk reaction was NOT okay');
          }
          return response.json();
      })
      .then(data => {
          data.forEach(sensor => {
            if(sensor.TYPE === 'Oxygen') {
              document.getElementById('oxygenOption').value = sensor.SERIENUMMER;
            } else if(sensor.TYPE === 'pH') {
              document.getElementById('phOption').value = sensor.SERIENUMMER;
            } else if(sensor.TYPE === 'Turbidity') {
              document.getElementById('turbOption').value = sensor.SERIENUMMER;
            } else if(sensor.TYPE === 'Electrical Conductivity (EC)') {
              document.getElementById('ecOption').value = sensor.SERIENUMMER;
            } else if(sensor.TYPE === 'Temperature') {
              document.getElementById('tempOption').value = sensor.SERIENUMMER;
            }
          });

          // Set old sensors BEFORE setting new sensors
          oldSensors = {
            oxygen: document.getElementById('oxygenOption').value,
            ph: document.getElementById('phOption').value,
            turbidity: document.getElementById('turbOption').value,
            ec: document.getElementById('ecOption').value,
            temperature: document.getElementById('tempOption').value,
          };
      })
      .catch(error => {
          console.error('There is a problem with receiving the boeienlijst:', error);
      });
    }

    //  Function for setting sensors
    const setSensors = () => {
      const newSensors = {
        oxygen: document.getElementById('oxygenOption').value,
        ph: document.getElementById('phOption').value,
        turbidity: document.getElementById('turbOption').value,
        ec: document.getElementById('ecOption').value,
        temperature: document.getElementById('tempOption').value,
      };

      let changedSensors = {
        oxygen: false,
        ph: false,
        turbidity: false,
        ec: false,
        temperature: false,
      }

      if (oldSensors.oxygen !== newSensors.oxygen) {
        changedSensors.oxygen = true;
      }
      if (oldSensors.ph !== newSensors.ph) {
        changedSensors.ph = true;
      }
      if (oldSensors.turbidity !== newSensors.turbidity) {
        changedSensors.turbidity = true;
      }
      if (oldSensors.ec !== newSensors.ec) {
        changedSensors.ec = true;
      }
      if (oldSensors.temperature !== newSensors.temperature) {
        changedSensors.temperature = true;
      }

      //  Generate JSON
      const sensorUpdate = Object.keys(oldSensors)
      .filter(key => changedSensors[key])  // Filter keys based on changedSensors
      .map(key => {
        return {
          oude_sensor: oldSensors[key],
          nieuwe_sensor: newSensors[key]
        };
      });

      const jsonPayload = { //  JSON payload
        boei_id: state.selectedBoei,
        sensor_updates: sensorUpdate
      };

      //  Send JSON
      fetch("https://ricky-boeien.ddns.net:1880/update-sensors", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonPayload)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        alert('Sensors updated successfully!');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('There was an error updating the sensors. Please try again.\nError: ' + error);
      });
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
    padding: 10px;
    background-color: #f9f9f9;
    box-sizing: border-box;
  }
  
  /* Title Bar styles */
  .title-bar {
    margin-bottom: 10px;
    text-align: center;
    width: 100%;
  }
  
  .title-bar h1 {
    font-size: 1.5rem; 
    color: #333;
  }
  
  /* Form styles */
  .form-group {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 500px; 
    margin-bottom: 10px; 
  }
  
  .form-group label {
    margin-bottom: 3px; 
    font-weight: bold;
    font-size: 0.85rem; 
    color: #555;
  }
  
  .form-group select {
    padding: 6px; 
    font-size: 0.9rem; 
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
  