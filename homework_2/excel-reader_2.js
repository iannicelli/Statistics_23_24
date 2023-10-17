// Funzione per caricare il file Excel
function loadExcelFile2() {
    var input = document.getElementById('excel-file-input'); // Input file
    var file = input.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, { type: 'array' });

            // Tabella di riferimento: Altezze
            var sheetName = 'Sheet1';
            var worksheet = workbook.Sheets[sheetName];
            var columnData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
            var columnValues = columnData.map(function (row) {
                return row[18]; // Colonna contenente le altezze
            });

            // Definisci gli intervalli
            var intervals = ["1.50-1.59", "1.60-1.69", "1.70-1.79", "1.80-1.89", "1.90-1.99"];

            // Inizializza un oggetto per conteggiare le occorrenze negli intervalli
            var intervalCounts = {};
            var totalRecords = columnValues.length - 1;

            // Itera attraverso i dati e conteggia gli intervalli
            columnValues.forEach(function (value, idx) {
                if (idx > 0) {
                    for (var i = 0; i < intervals.length; i++) {
                        var range = intervals[i].split('-');
                        var min = parseFloat(range[0]);
                        var max = parseFloat(range[1]);

                        if (value >= min && value <= max) {
                            intervalCounts[intervals[i]] = (intervalCounts[intervals[i]] || 0) + 1;
                            break; // Esci dal ciclo una volta trovato l'intervallo corretto
                        }
                    }
                }
            });

            // Aggiorna la tabella 'result3' con i dati elaborati
            var resultsTable3 = document.getElementById('result3').getElementsByTagName('tbody')[0];
            resultsTable3.innerHTML = ''; // Cancella il contenuto precedente

            // Aggiungi la prima riga con la classe CSS inline
            var firstRow3 = resultsTable3.insertRow(0);
            firstRow3.style.backgroundColor = 'rgb(130, 23, 41)';
            firstRow3.style.color = '#fff';

            // Aggiungi celle alla prima riga
            var headerCell1 = firstRow3.insertCell(0);
            var headerCell2 = firstRow3.insertCell(1);
            var headerCell3 = firstRow3.insertCell(2);
            var headerCell4 = firstRow3.insertCell(3);
            headerCell1.innerHTML = 'Interval';
            headerCell2.innerHTML = 'Count';
            headerCell3.innerHTML = 'Frequency';
            headerCell4.innerHTML = 'Percentage';

            // Popola la tabella con i dati degli intervalli
            for (var interval in intervalCounts) {
                var newRow3 = resultsTable3.insertRow(resultsTable3.rows.length);
                var cell1 = newRow3.insertCell(0);
                var cell2 = newRow3.insertCell(1);
                var cell3 = newRow3.insertCell(2);
                var cell4 = newRow3.insertCell(3);
                cell1.innerHTML = interval;
                cell2.innerHTML = intervalCounts[interval];
                cell3.innerHTML = (intervalCounts[interval] / totalRecords).toFixed(4);
                cell4.innerHTML = ((intervalCounts[interval] / totalRecords) * 100).toFixed(2) + '%';
            }

            // Salva i dati in localStorage
            var dataToStore = {
                tableHTML3: resultsTable3.innerHTML,
            };
            localStorage.setItem('storedData', JSON.stringify(dataToStore));
        };

        reader.readAsArrayBuffer(file);
    } else {
        // Prova a caricare i dati salvati in localStorage quando la pagina si carica
        var storedData = localStorage.getItem('storedData');
        if (storedData) {
            var dataToStore = JSON.parse(storedData);
            var resultsTable3 = document.getElementById('result3').getElementsByTagName('tbody')[0];
            resultsTable3.innerHTML = dataToStore.tableHTML3;
        }
    }
}

// Chiama la funzione per caricare i dati quando la pagina si carica
window.onload = function () {
    loadExcelFile2();
    loadExcelFile();
};