const otb2json = require("../../otb2json");
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'items.json');

var itemsData = otb2json.read("items.otb");
var itemsJson = JSON.stringify(itemsData, null, "\t");

fs.writeFileSync('items.json', itemsJson);

fs.readFile(filePath, {encoding: 'utf8'}, function (err, data) {
    if (!err) {
        const newItemsData = JSON.parse(data);
        otb2json.write("newItems.otb", newItemsData);

        itemsData = otb2json.read("newItems.otb");
        itemsJson = JSON.stringify(itemsData, null, "\t");

        fs.writeFileSync('newItems.json', itemsJson);
    } else {
        console.log(err);
    }
});
