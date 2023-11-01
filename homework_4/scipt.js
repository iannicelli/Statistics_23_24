let selectedColumns = []; // Array per memorizzare le colonne selezionate

function handleFile(input) {
  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const data = e.target.result;
    const workbook = XLSX.read(data, { type: 'binary' });

    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];

      // Estrai i dati sotto forma di oggetto JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const container = document.getElementById('output');
      container.innerHTML = ''; // Pulizia del contenuto precedente

      // Estrai l'array di intestazioni (nomi delle colonne) dalla prima riga
      const columnNames = jsonData[0];

      // Itera sulle colonne
      for (let colIndex = 0; colIndex < columnNames.length; colIndex++) {
        const columnName = columnNames[colIndex];
        
        // Crea un bottone per ogni colonna
        const button = document.createElement('button');
        button.textContent = `${columnName}`;
        
        // Aggiungi un gestore per il clic del bottone
        button.addEventListener('click', function() {
          // Estrai i dati per la colonna specifica
          const columnData = jsonData.slice(1).map(row => row[colIndex]);

          // Memorizza il nome della colonna selezionata
          selectedColumns.push(columnName);
          
          // Aggiorna l'elemento HTML per visualizzare le colonne selezionate
          const selectedColumnsDiv = document.getElementById('selectedColumns');
          selectedColumnsDiv.innerHTML = `Choosen variables: ${selectedColumns.join(', ')}`;

/*           // Crea una tabella per visualizzare i dati della colonna
          const table = document.createElement('table');

          // Itera sui dati della colonna e crea le righe della tabella
          for (let i = 0; i < columnData.length; i++) {
            const row = table.insertRow();
            const cell1 = row.insertCell(0); // Cella per i numeri consecutivi
            const cell2 = row.insertCell(1); // Cella per il valore della colonna

            cell1.textContent = i; // Numero consecutivo
            cell2.textContent = columnData[i]; // Valore contenuto nello sheet
          }

          // Aggiungi la tabella al contenitore
          container.appendChild(table); */
        });
        
        // Aggiungi il bottone al contenitore
        container.appendChild(button);
      }

      
      
    });
  };

  reader.readAsBinaryString(file);
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
    let result;
    if (selectedData.length === 1) {
      // Se è stata selezionata solo una colonna, calcola la distribuzione singola
      result = calculateSingleDistribution(selectedData[0]);
    } else {
      // Altrimenti, calcola la distribuzione congiunta
      result = calculateJointDistribution(selectedData);
    }
  
    // Visualizza il risultato
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = result;
  }
  
  function calculateSingleDistribution(data) {
    const resultTable = document.createElement('table');
    resultTable.classList.add('result-table');
  
    const thead = resultTable.createTHead();
    const headerRow = thead.insertRow();
    const headerCell1 = document.createElement('th');
    const headerCell2 = document.createElement('th');
    headerCell1.textContent = 'Value';
    headerCell2.textContent = 'Frequancy';
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
    for (let i = 0; i < data.length; i++) {
      const headerCell = document.createElement('th');
      headerCell.textContent = `Column ${i + 1}`;
      headerRow.appendChild(headerCell);
    }
  
    const headerCell = document.createElement('th');
    headerCell.textContent = 'Frequency';
    headerRow.appendChild(headerCell);
  
    const tbody = resultTable.createTBody();
  
    // Trova tutte le combinazioni di valori
    const combinations = getCombinations(data);
  
    // Conta le combinazioni di valori
    const distribution = {};
  
    combinations.forEach(combination => {
      const key = combination.join(', ');
  
      if (distribution[key]) {
        distribution[key]++;
      } else {
        distribution[key] = 1;
      }
    });
  
    for (const key in distribution) {
      const row = tbody.insertRow();
      const valueCell = row.insertCell();
      valueCell.textContent = key;
      const countCell = row.insertCell();
      countCell.textContent = distribution[key];
    }
  
    return resultTable;
  }
  