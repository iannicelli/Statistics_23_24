let selectedColumns = []; // Array per memorizzare le colonne selezionate
let jsonData; // Variabile per i dati JSON
let columnNames; // Variabile per i nomi delle colonne
let intervals = {
  weight: [],
  height: [],
  remuneration: []
};

function handleFile(input) {
  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const data = e.target.result;
    const workbook = XLSX.read(data, { type: 'binary' });
    const container = document.getElementById('output');
    container.innerHTML = ''; // Pulizia del contenuto precedente

    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];

      // Estrai i dati sotto forma di oggetto JSON
      jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Estrai l'array di intestazioni (nomi delle colonne) dalla prima riga
      columnNames = jsonData[0];

      // Itera sulle colonne
      for (let colIndex = 0; colIndex < columnNames.length; colIndex++) {
        const columnName = columnNames[colIndex];

        //button.dataset.column = columnName; // Aggiungi l'attributo data-column

        // Crea un bottone per mostrare la colonna
        const button = document.createElement('button');
        button.textContent = `${columnName}`;
        button.style.marginRight = '10px';
        button.style.marginTop = '5px';


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

            // Aggiungi una riga vuota (line break)
            const lineBreak = document.createElement('br');
            container.appendChild(lineBreak);

          // Aggiungi il tasto "Rimuovi" per questa colonna
          const removeButton = document.createElement('button');
          removeButton.textContent = `Rimuovi Colonna ${columnName}`;
          removeButton.style.backgroundColor = "rgb(0,0,0)";
          removeButton.style.marginRight = '10px';
          removeButton.style.marginTop = '5px';


          // Aggiungi il gestore per il clic
          removeButton.addEventListener('click', function() {
            removeColumn(columnName);
            removeButton.remove();
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
  // Rimuovi il tasto "Rimuovi" dalla visualizzazione e nascondilo
  const removeButton = document.querySelector(`button[data-column="${columnName}"]`);
  
  if (removeButton) {
    const salutationElement = document.getElementById('salutation');
    salutationElement.innerHTML = 'Ciao';
    removeButton.remove();
  }
  // Rimuovi la colonna selezionata dall'array delle colonne selezionate
  selectedColumns = selectedColumns.filter(col => col !== columnName);

  // Aggiorna l'elemento HTML per visualizzare le colonne selezionate
  const selectedColumnsDiv = document.getElementById('selectedColumns');
  selectedColumnsDiv.innerHTML = `Hai scelto queste variabili: ${selectedColumns.join(', ')}`;

}

  

function computeDistribution() {
  // Verifica se almeno una colonna è stata selezionata
  if (selectedColumns.length === 0) {
    alert('Devi selezionare almeno una colonna prima di calcolare la distribuzione.');
    return;
  }

  const selectedData = [];

  // Estrai i dati per le colonne selezionate
  selectedColumns.forEach(selectedColumn => {
    const columnIndex = columnNames.indexOf(selectedColumn);
    const columnData = jsonData.slice(1).map(row => row[columnIndex]);
    selectedData.push(columnData);
  });

  // Calcola la distribuzione congiunta o singola
  const result = calculateJointDistribution(selectedData);

  // Visualizza il risultato
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = ''; // Pulisci il contenuto precedente
  resultDiv.appendChild(result); // Aggiungi la tabella come figlio di resultDiv
}


function calculateSingleDistribution(data) {
    const resultTable = document.createElement('table');
    resultTable.classList.add('result-table');
  
    const thead = resultTable.createTHead();
    const headerRow = thead.insertRow();
    const headerCell1 = document.createElement('th');
    const headerCell2 = document.createElement('th');
    headerCell1.textContent = 'Valore';
    headerCell2.textContent = 'Frequenza';
    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);
  
    const tbody = resultTable.createTBody();
  
    const distribution = {}; // Un oggetto per calcolare la distribuzione
  
    data.forEach(value => {
      if (distribution[value]) {
        distribution[value]++;
      } else {
        distribution[value] = 1;
      }
    });
  
    for (const value in distribution) {
      const row = tbody.insertRow();
      const valueCell = row.insertCell();
      valueCell.textContent = value;
      const countCell = row.insertCell();
      countCell.textContent = distribution[value];
    }
  
    return resultTable;
}

function calculateJointDistribution(data) {
    const resultTable = document.createElement('table');
    resultTable.classList.add('result-table');
  
    const thead = resultTable.createTHead();
    const headerRow = thead.insertRow();
  
    // Aggiungi le intestazioni delle colonne
    const combinationsHeader = document.createElement('th');
    combinationsHeader.textContent = 'Combinazioni';
    headerRow.appendChild(combinationsHeader);
  
    const frequencyHeader = document.createElement('th');
    frequencyHeader.textContent = 'Frequenza';
    headerRow.appendChild(frequencyHeader);
  
    const tbody = resultTable.createTBody();
  
    // Genera un oggetto per tenere traccia delle combinazioni e delle frequenze
    const distribution = {};
  
    const combinations = generateCombinations(data);
  
    // Normalizza i dati e controlla le combinazioni di valori
    combinations.forEach(combination => {
      const normalizedCombination = combination.map(value => normalizeValue(value));
  
      const key = normalizedCombination.join(', ');
  
      if (distribution[key]) {
        distribution[key]++;
      } else {
        distribution[key] = 1;
      }
    });
  
    for (const key in distribution) {
      const row = tbody.insertRow();
      const combinationsCell = row.insertCell();
      combinationsCell.textContent = key;
      const frequencyCell = row.insertCell();
      frequencyCell.textContent = distribution[key];
    }
  
    return resultTable;
}

  
  // Funzione per generare tutte le combinazioni di valori
  function generateCombinations(data) {
    const combinations = [];
    const maxLength = Math.max(...data.map(arr => arr.length));
    
    for (let i = 0; i < maxLength; i++) {
      const combination = data.map(arr => arr[i] || ''); // Utilizziamo '' per le colonne mancanti
      combinations.push(combination);
    }
  
    return combinations;
  }
  
  // Funzione per normalizzare una stringa (rimuove spazi e converte in minuscole)
// Funzione per normalizzare un valore (rimuove spazi e converte in minuscole se è una stringa)
function normalizeValue(value) {
    if (typeof value === 'string') {
      return value.trim().toLowerCase();
    }
    // Se non è una stringa, presumiamo che sia un numero e lo restituiamo così com'è
    return value;
  }
  
  
  
  
  
  
// Funzione per trovare tutte le combinazioni di valori
function getCombinations(arr) {
    if (arr.length === 1) {
      return arr[0].map(item => [item]);
    }
  
    const [firstCol, ...restCols] = arr;
    const restCombinations = getCombinations(restCols);
    const result = [];
  
    for (const item of firstCol) {
      for (const combination of restCombinations) {
        result.push([item, ...combination]);
      }
    }
  
    return result;
  }
  

