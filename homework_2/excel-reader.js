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
        var sheetName = 'Professional Life'; // Nome del foglio di lavoro
  
        // Leggi i dati dalla colonna 'Background (degree)'
        var worksheet = workbook.Sheets[sheetName];
        var columnData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });
        var columnValues = columnData.map(function (row) {
          return row[1]; // 1 rappresenta la colonna 'Background (degree)' (modifica in base alla tua struttura)
        });
  
        // Calcola il conteggio delle istanze diverse
        var uniqueBackgrounds = {};
        columnValues.forEach(function (background) {
          if (background && background !== 'Background (degree)') {
            uniqueBackgrounds[background] = (uniqueBackgrounds[background] || 0) + 1;
          }
        });
  
        // Stampa i risultati
        for (var background in uniqueBackgrounds) {
          console.log(background + ': ' + uniqueBackgrounds[background]);
        }
      };
  
      reader.readAsArrayBuffer(file);
    }
  }
  