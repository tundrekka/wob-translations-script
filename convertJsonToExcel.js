/* eslint-disable @typescript-eslint/no-var-requires */
// Importar la librería xlsx
// eslint-disable-next-line @typescript-eslint/no-var-requires
const XLSX = require('xlsx');
const JSON = require('./src/defaultJSON.json');


// este solo se utiliza una vez, no es comun usarlo, es solo para crear la primera estructura de excel
function jsonToExcel(headerName, jsonData) {
  const workbook = XLSX.utils.book_new();
  const dataForExcel = Object.keys(jsonData).map(key => {
    return { [headerName]: key };
  });
  const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, './output/output.xlsx');
}

// Datos de ejemplo
const headerName = 'Key';
const jsonData = {
  "name": "John Doe",
  "age": 30,
  "city": "New York"
};

// Llamar a la función
jsonToExcel("english key", JSON);
