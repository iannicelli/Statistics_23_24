function loadExcelFile() {
    var input = document.getElementById('excel-file-input'); // Input file
    var file = input.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, { type: 'array' });

            // Prima tabella: Background (degree)
            var sheetName1 = 'Sheet1';
            var worksheet1 = workbook.Sheets[sheetName1];
            var columnData1 = XLSX.utils.sheet_to_json(worksheet1, { header: 1, raw: false });
            var columnValues1 = columnData1.map(function (row) {
                return row[1]; // 2 rappresenta la colonna 'Background (degree)' (modifica in base alla tua struttura)
            });

            // Calcola il conteggio delle istanze diverse per la prima tabella
            var backgroundCounts = {};
            for (var i = 1; i < columnValues1.length; i++) {
                var background = columnValues1[i];
                if (background) {
                    backgroundCounts[background] = (backgroundCounts[background] || 0) + 1;
                }
            }

            // Seconda tabella: Età
            var sheetName2 = 'Sheet1';
            var worksheet2 = workbook.Sheets[sheetName2];
            var columnData2 = XLSX.utils.sheet_to_json(worksheet2, { header: 1, raw: false });
            var columnValues2 = columnData2.map(function (row) {
                return row[16]; // 16 rappresenta la colonna 'Età' 
            });

            // Calcola il conteggio delle istanze diverse per la seconda tabella
            var ageCounts = {};
            for (var i = 1; i < columnValues2.length; i++) {
                var age = columnValues2[i];
                if (age) {
                    ageCounts[age] = (ageCounts[age] || 0) + 1;
                }
            }

            // Aggiorna le due tabelle con i dati elaborati
            var resultsTable1 = document.getElementById('results1').getElementsByTagName('tbody')[0];
            resultsTable1.innerHTML = ''; // Cancella il contenuto precedente

            // Aggiungi la prima riga con la classe CSS inline per la prima tabella
            var firstRow1 = resultsTable1.insertRow(0);
            firstRow1.style.backgroundColor = 'rgb(130, 23, 41)';
            firstRow1.style.color = '#fff';

            // Aggiungi celle alla prima riga per la prima tabella
            var headerCell11 = firstRow1.insertCell(0);
            var headerCell12 = firstRow1.insertCell(1);
            var headerCell13 = firstRow1.insertCell(2);
            var headerCell14 = firstRow1.insertCell(3);
            headerCell11.innerHTML = 'Background';
            headerCell12.innerHTML = 'Count';
            headerCell13.innerHTML = 'Relative Frequency';
            headerCell14.innerHTML = 'Percentage';

            var totalRecords1 = columnValues1.length - 1;

            for (var background in backgroundCounts) {
                var newRow1 = resultsTable1.insertRow(resultsTable1.rows.length);
                var cell11 = newRow1.insertCell(0);
                var cell12 = newRow1.insertCell(1);
                var cell13 = newRow1.insertCell(2);
                var cell14 = newRow1.insertCell(3);
                cell11.innerHTML = background;
                cell12.innerHTML = backgroundCounts[background];
                cell13.innerHTML = (backgroundCounts[background] / totalRecords1).toFixed(4); // Calcola la frequenza relativa
                cell14.innerHTML = ((backgroundCounts[background] / totalRecords1) * 100).toFixed(2) + '%'; // Calcola la frequenza percentuale
            }

            var resultsTable2 = document.getElementById('results2').getElementsByTagName('tbody')[0];
            resultsTable2.innerHTML = ''; // Cancella il contenuto precedente

            // Aggiungi la prima riga con la classe CSS inline per la seconda tabella
            var firstRow2 = resultsTable2.insertRow(0);
            firstRow2.style.backgroundColor = 'rgb(130, 23, 41)';
            firstRow2.style.color = '#fff';

            // Aggiungi celle alla prima riga per la seconda tabella
            var headerCell21 = firstRow2.insertCell(0);
            var headerCell22 = firstRow2.insertCell(1);
            var headerCell23 = firstRow2.insertCell(2);
            var headerCell24 = firstRow2.insertCell(3);
            headerCell21.innerHTML = 'Age';
            headerCell22.innerHTML = 'Count';
            headerCell23.innerHTML = 'Relative Frequency';
            headerCell24.innerHTML = 'Percentage';

            var totalRecords2 = columnValues2.length - 1;

            for (var age in ageCounts) {
                var newRow2 = resultsTable2.insertRow(resultsTable2.rows.length);
                var cell21 = newRow2.insertCell(0);
                var cell22 = newRow2.insertCell(1);
                var cell23 = newRow2.insertCell(2);
                var cell24 = newRow2.insertCell(3);
                cell21.innerHTML = age;
                cell22.innerHTML = ageCounts[age];
                cell23.innerHTML = (ageCounts[age] / totalRecords2).toFixed(4); // Calcola la frequenza relativa
                cell24.innerHTML = ((ageCounts[age] / totalRecords2) * 100).toFixed(2) + '%'; // Calcola la frequenza percentuale
            }

           // Salva i dati in localStorage
           var dataToStore = {
            tableHTML1: resultsTable1.innerHTML,
            tableHTML2: resultsTable2.innerHTML,
            variables: backgroundCounts,
            ages: ageCounts,
        };
        localStorage.setItem('storedData', JSON.stringify(dataToStore));
    };

    reader.readAsArrayBuffer(file);

    } else {
        // Prova a caricare i dati salvati in localStorage quando la pagina si carica
        var storedData = localStorage.getItem('storedData');
        if (storedData) {
            var dataToStore = JSON.parse(storedData);

            // Ripristina i dati delle due tabelle e le prime righe
            var resultsTable1 = document.getElementById('results1').getElementsByTagName('tbody')[0];
            resultsTable1.innerHTML = dataToStore.tableHTML1;

            var resultsTable2 = document.getElementById('results2').getElementsByTagName('tbody')[0];
            resultsTable2.innerHTML = dataToStore.tableHTML2
            ;

            // Ripristina i dati delle variabili della prima tabella e della seconda tabella
            var backgroundCounts = dataToStore.variables;
            var ageCounts = dataToStore.ages;

            // Mostra i dati della prima tabella
            for (var background in backgroundCounts) {
                var newRow1 = resultsTable1.insertRow(resultsTable1.rows.length);
                var cell11 = newRow1.insertCell(0);
                var cell12 = newRow1.insertCell(1);
                var cell13 = newRow1.insertCell(2);
                var cell14 = newRow1.insertCell(3);
                cell11.innerHTML = background;
                cell12.innerHTML = backgroundCounts[background];
                cell13.innerHTML = (backgroundCounts[background] / totalRecords1).toFixed(4);
                cell14.innerHTML = ((backgroundCounts[background] / totalRecords1) * 100).toFixed(2) + '%';
            }

            // Mostra i dati della seconda tabella
            for (var age in ageCounts) {
                var newRow2 = resultsTable2.insertRow(resultsTable2.rows.length);
                var cell21 = newRow2.insertCell(0);
                var cell22 = newRow2.insertCell(1);
                var cell23 = newRow2.insertCell(2);
                var cell24 = newRow2.insertCell(3);
                cell21.innerHTML = age;
                cell22.innerHTML = ageCounts[age];
                cell23.innerHTML = (ageCounts[age] / totalRecords2).toFixed(4);
                cell24.innerHTML = ((ageCounts[age] / totalRecords2) * 100).toFixed(2) + '%';
            }
        }
    }
}

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
            var dataToStore2 = {
                tableHTML3: resultsTable3.innerHTML,
            };
            localStorage.setItem('storedData2', JSON.stringify(dataToStore2));
        };

        reader.readAsArrayBuffer(file);
    } else {
        // Prova a caricare i dati salvati in localStorage quando la pagina si carica
        var storedData2 = localStorage.getItem('storedData2');
        if (storedData2) {
            var dataToStore2 = JSON.parse(storedData2);
            var resultsTable3 = document.getElementById('result3').getElementsByTagName('tbody')[0];
            resultsTable3.innerHTML = dataToStore2.tableHTML3;
        }
    }
}

// Chiama la funzione per caricare i dati quando la pagina si carica
window.onload = function () {

    loadExcelFile2();
    loadExcelFile(); // Chiamare loadExcelFile dopo aver ripristinato i dati dal localStorage
};

