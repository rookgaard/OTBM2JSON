const otb2json = require("../../otb2json");
const fs = require('fs');

const itemsData = otb2json.read("items.otb");
const itemsJson = JSON.stringify(itemsData, null, "\t");

fs.writeFileSync('items.json', itemsJson);
