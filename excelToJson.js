/* eslint-disable @typescript-eslint/no-var-requires */
// Requerir las librerías necesarias
const XLSX = require("xlsx");
const fs = require("fs");

// Función para leer el archivo Excel y crear los archivos JSON
function excelToJson(filename) {
  // Leer el archivo
  const workbook = XLSX.readFile(filename);
  // Suponer que los datos están en la primera hoja
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  // Convertir la hoja a JSON
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  // La primera fila tiene los headers (idiomas)
  const headers = data[0];

  // Ignorar el primer header (descriptions)
  const languages = headers.slice(1);

  // Inicializar un objeto para mantener los datos de cada header
  const translations = languages.reduce((acc, current) => {
    acc[current] = {};
    return acc;
  }, {});

  // Iterar sobre cada fila de datos (ignorando la primera fila de headers)
  data.slice(1).forEach((row) => {
    // Usar el valor de la segunda columna (en) como clave
    const key = row[1];

    // Asignar el valor de la columna correspondiente al idioma como valor en el objeto del idioma
    languages.forEach((language, index) => {
      translations[language][key] = row[index + 1] || ""; // Asigna valor vacío si no hay traducción
    });
  });

  // Crear un archivo JSON para cada header
  // crear archivos en carpeta output json

  const outputFolderLocal = "./output/json/";
  const reactOutputFolder = "../../wobjay-react-app/public/languages/json/refactor-script/";
  Object.keys(translations).forEach((header) => {
    fs.writeFileSync(
      `${outputFolderLocal}${header}.json`,
      JSON.stringify(translations[header], null, 2)
    );
    fs.writeFileSync(
      `${reactOutputFolder}${header}.json`,
      JSON.stringify(translations[header], null, 2)
    );
  });

    // to create a type definition for the translations
    let typeDefinition = "export type TranslationsOptions = ";
    // rellenar la definición del tipo
    Object.keys(translations['en']).forEach((key, index, array) => {
      typeDefinition += `"${key}"${index < array.length - 1 ? ' | ' : ''}`;
    });

  // Escribir la definición del tipo en un archivo .ts
  // escribir de manera local en este proyecto
  fs.writeFileSync("translationsOptions.ts", typeDefinition);
  // escribir en el proyecto de react, afuera
  fs.writeFileSync("../../wobjay-react-app/src/Types/translationsOptions.ts", typeDefinition);

  console.log("Archivos JSON creados exitosamente.");
}

const WOBJAY_TRANSLATIONS_EXCEL = "./resources/wobjay-translations.xlsx";

// Ejecutar la función con el nombre de tu archivo Excel
excelToJson(WOBJAY_TRANSLATIONS_EXCEL);
