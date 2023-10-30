let selectedColumns = [];
let jsonData;
let columnNames;
let intervals = {
  weight: [],
  height: [],
  remuneration: []
};

function handleFile(input) {
  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const data = e.target.result;
    const workbook = XLSX.read(data, { type: 'binary' });
    const container = document.getElementById('output');
    container.innerHTML = '';

    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      columnNames = jsonData[0];

      // Itera sulle colonne
      for (let colIndex = 0; colIndex < columnNames.length; colIndex++) {
        const columnName = columnNames[colIndex];

        // Crea un bottone per mostrare la colonna
        const button = document.createElement('button');
        button.textContent = `Mostra Colonna ${columnName}`;

        // Aggiungi un gestore per il clic del bottone
        button.addEventListener('click', function() {
          // Estrai i dati per la colonna specifica
          const columnData = jsonData.slice(1).map(row => row[colIndex]);

          // Memorizza il nome della colonna selezionata
          selectedColumns.push(columnName);

          // Aggiorna l'elemento HTML per visualizzare le colonne selezionate
          const selectedColumnsDiv = document.getElementById('selectedColumns');
          selectedColumnsDiv.innerHTML = `Hai scelto queste variabili: ${selectedColumns.join(', ')}`;

          // Crea una tabella per visualizzare i dati della colonna
          const table = createDataTable(columnData, columnName);

          // Aggiungi il tasto "Rimuovi" per questa colonna
          const removeButton = document.createElement('button');
          removeButton.textContent = `Rimuovi Colonna ${columnName}`;
          removeButton.addEventListener('click', function() {
            removeColumn(columnName);
          });

          // Aggiungi la tabella e il tasto "Rimuovi" al contenitore
          //container.appendChild(table);
          container.appendChild(removeButton);
        });

        // Aggiungi il bottone al contenitore
        container.appendChild(button);
      }
    });
  };

  reader.readAsBinaryString(file);
}

function addInterval(type) {
  const minInput = document.getElementById(`${type}Min`);
  const maxInput = document.getElementById(`${type}Max`);

  const min = minInput.value;
  const max = maxInput.value;

  if (min !== '' && max !== '') {
    intervals[type].push({ min: parseFloat(min), max: parseFloat(max) });
    minInput.value = '';
    maxInput.value = '';
    displayIntervals();
  }
}

function addWeightInterval() {
  addInterval('weight');
}

function addHeightInterval() {
  addInterval('height');
}

function addRemunerationInterval() {
  addInterval('remuneration');
}

function displayIntervals() {
  const intervalsDiv = document.getElementById('intervals');
  intervalsDiv.innerHTML = '';

  for (const type in intervals) {
    intervalsDiv.innerHTML += `<h3>${type} Intervals:</h3>`;
    intervals[type].forEach((interval, index) => {
      intervalsDiv.innerHTML += `<p>Interval ${index + 1}: Min: ${interval.min}, Max: ${interval.max}</p>`;
    });
  }
}

function createDataTable(data, columnName) {
    const table = document.createElement('table');
    table.classList.add('data-table'); // Aggiungi classe CSS alla tabella
  
    // Itera sui dati della colonna e crea le righe della tabella
    for (let i = 0; i < data.length; i++) {
      const row = table.insertRow();
      const cell1 = row.insertCell(0); // Cella per i numeri consecutivi
      const cell2 = row.insertCell(1); // Cella per il valore della colonna
  
      cell1.textContent = i; // Numero consecutivo
      cell2.textContent = data[i]; // Valore contenuto nello sheet
    }
  
    return table;
  }
  
  function removeColumn(columnName) {
      // Rimuovi la colonna selezionata dall'array delle colonne selezionate
      selectedColumns = selectedColumns.filter(col => col !== columnName);
    
      // Aggiorna l'elemento HTML per visualizzare le colonne selezionate
      const selectedColumnsDiv = document.getElementById('selectedColumns');
      selectedColumnsDiv.innerHTML = `Hai scelto queste variabili: ${selectedColumns.join(', ')}`;
    
      // Rimuovi il tasto "Rimuovi" dalla visualizzazione
      const removeButton = document.querySelector(`button:contains('Rimuovi Colonna ${columnName}')`);
      if (removeButton) {
        removeButton.remove();
      }
    }
   

function computeDistribution() {
    if (selectedColumns.length === 0) {
      alert('Devi selezionare almeno una colonna prima di calcolare la distribuzione.');
      return;
    }
  
    const selectedData = [];
    selectedColumns.forEach(selectedColumn => {
      const columnIndex = columnNames.indexOf(selectedColumn);
      const columnData = jsonData.slice(1).map(row => row[columnIndex]);
      selectedData.push(columnData);
    });
  
    // Apply selected intervals to data and calculate distributions
    if(selectedData.length < 2){
        const result = calculateSingleDistribution(selectedData);
    }
    const result = calculateJointDistribution(selectedData);
  
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    resultDiv.appendChild(result);
  }
  
  function calculateSingleDistribution(data, intervals) {
    const distribution = {};
    // Inizializza il conteggio per ciascun intervallo
    intervals.forEach((interval, index) => {
      distribution[`Interval ${index + 1}`] = 0;
    });
  
    // Calcola la distribuzione
    data.forEach(value => {
      for (let i = 0; i < intervals.length; i++) {
        const interval = intervals[i];
        if (value >= interval.min && value < interval.max) {
          distribution[`Interval ${i + 1}`]++;
          break; // Seleziona solo il primo intervallo in cui il valore rientra
        }
      }
    });
  
    return distribution;
  }
  
  
  function calculateJointDistribution(data, intervals) {
    const jointDistribution = {};
  
    // Inizializza il conteggio per ciascuna combinazione di intervalli
    for (let i = 0; i < intervals.weight.length; i++) {
      for (let j = 0; j < intervals.height.length; j++) {
        for (let k = 0; k < intervals.remuneration.length; k++) {
          jointDistribution[`Weight Interval ${i + 1}, Height Interval ${j + 1}, Remuneration Interval ${k + 1}`] = 0;
        }
      }
    }
  
    // Calcola la distribuzione congiunta
    data[0].forEach(weightValue => {
      data[1].forEach(heightValue => {
        data[2].forEach(remunerationValue => {
          // Trova l'intervallo per ciascuna variabile
          const weightInterval = findInterval(weightValue, intervals.weight);
          const heightInterval = findInterval(heightValue, intervals.height);
          const remunerationInterval = findInterval(remunerationValue, intervals.remuneration);
  
          // Incrementa il conteggio per la combinazione di intervalli
          const key = `Weight Interval ${weightInterval + 1}, Height Interval ${heightInterval + 1}, Remuneration Interval ${remunerationInterval + 1}`;
          jointDistribution[key]++;
        });
      });
    });
  
    return jointDistribution;
  }
  
  function findInterval(value, intervals) {
    for (let i = 0; i < intervals.length; i++) {
      const interval = intervals[i];
      if (value >= interval.min && value < interval.max) {
        return i;
      }
    }
    return -1; // Intervallo non trovato
  }
  
  
  // Funzione per ottenere dati basati sugli intervalli selezionati
  function getIntervalData(data, intervals) {
    const intervalData = data.map((colData, index) => {
      const columnIntervals = intervals[selectedColumns[index]];
      if (columnIntervals.length === 0) {
        // Se non ci sono intervalli, ritorna i dati non modificati
        return colData;
      }
  
      const intervalCounts = Array(columnIntervals.length).fill(0);
  
      colData.forEach(value => {
        for (let i = 0; i < columnIntervals.length; i++) {
          if (value >= columnIntervals[i].min && value < columnIntervals[i].max) {
            intervalCounts[i]++;
            break; // Seleziona solo il primo intervallo in cui il valore rientra
          }
        }
      });
  
      return intervalCounts;
    });
  
    return intervalData;
  }
  
  // Funzione per calcolare la distribuzione basata sugli intervalli selezionati
  function calculateDistributionBasedOnIntervals(data, intervals) {
    // Inizializza un oggetto per tenere traccia delle frequenze
    const distribution = {};
  
    // Inizializza le frequenze per ciascun intervallo
    intervals.forEach((interval, index) => {
      const intervalKey = `Interval ${index + 1}`;
      distribution[intervalKey] = 0;
    });
  
    // Calcola le frequenze basate sugli intervalli
    data.forEach(value => {
      for (let i = 0; i < intervals.length; i++) {
        const interval = intervals[i];
        if (value >= interval.min && value <= interval.max) {
          // Incrementa la frequenza per l'intervallo corrispondente
          const intervalKey = `Interval ${i + 1}`;
          distribution[intervalKey]++;
          break; // Esci dal ciclo una volta trovato l'intervallo corrispondente
        }
      }
    });
  
    return distribution;
  }
  
  
  // Altri metodi per processare i dati basati sugli intervalli
  
  
