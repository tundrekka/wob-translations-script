/* eslint-disable @typescript-eslint/no-var-requires */
// Requerir las librerías necesarias
const XLSX = require('xlsx');
const fs = require('fs');

// ! no esta siendo usado, solo se deja para referencia, es una prueba

// Función para leer el archivo Excel y crear los archivos JSON
function excelToJson(filename) {
  // Leer el archivo
  const workbook = XLSX.readFile(filename);
  // Suponer que los datos están en la primera hoja
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  // Convertir la hoja a JSON
  const data = XLSX.utils.sheet_to_json(sheet, {header: 1});

  // La primera fila tiene los headers, que son los idiomas
  const headers = data[0];

  // Preparar un objeto para cada idioma, excluyendo el primer header que es "keys"
  const languages = headers.slice(1).map(header => ({
    name: header,
    translations: {}
  }));

  // Llenar los objetos de idiomas con las traducciones
  data.slice(1).forEach(row => {
    languages.forEach((language, index) => {
      // Usar la primera columna como clave y la columna correspondiente para el valor
      const key = row[0];
      const value = row[index + 1]; // +1 para saltar la columna de claves
      if (key && value !== undefined) {
        language.translations[key] = value;
      }
    });
  });

  // Crear un archivo JSON para cada idioma
  languages.forEach(language => {
    fs.writeFileSync(`./output/withkeycolumn/${language.name}.json`, JSON.stringify(language.translations, null, 2));
  });

  console.log('Archivos JSON creados exitosamente.');
}

// Tomar el nombre del archivo desde los argumentos de la línea de comandos
const filename = "./resources/test-with-column-keys.xlsx";

if (!filename) {
  console.log("Por favor, proporciona el nombre del archivo Excel como argumento.");
} else {
  // Ejecutar la función con el nombre de tu archivo Excel
  excelToJson(filename);
}
