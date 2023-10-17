function loadExcelFile_2() {
    var input = document.getElementById('excel-file-input'); // Input file
    var file = input.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, { type: 'array' });

            var resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = ''; // Cancella il contenuto precedente

            workbook.SheetNames.forEach(function (sheetName) {
                var worksheet = workbook.Sheets[sheetName];
                var html = XLSX.utils.sheet_to_html(worksheet);
                resultsDiv.innerHTML += "<h2>" + sheetName + "</h2>" + html;
            });


        };

        reader.readAsArrayBuffer(file);
    }
}

// Funzione per caricare il file Excel
function loadExcelFile() {
    var input = document.getElementById('excel-file-input'); // Input file
    var file = input.files[0];

    if (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, { type: 'array' });

            // Sostituisci 'Background (degree)' con l'intestazione della tua colonna
            var sheetName = 'Sheet1';

            // Leggi i dati dalla colonna 'Background (degree)'
            var worksheet = workbook.Sheets[sheetName];
            var columnData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
            var columnValues = columnData.map(function (row) {
                return row[1]; 
            });

            // Calcola il conteggio delle istanze diverse
            var backgroundCounts = {};
            for (var i = 1; i < columnValues.length; i++) {
                var background = columnValues[i];
                if (background) {
                    backgroundCounts[background] = (backgroundCounts[background] || 0) + 1;
                }
            }

            // Aggiorna il div dei risultati con i dati elaborati
            var resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = ''; // Cancella il contenuto precedente
            for (var background in backgroundCounts) {
                resultsDiv.innerHTML += background + ': ' + backgroundCounts[background] + '<br>';
            }
        };

        reader.readAsArrayBuffer(file);
    }
}
