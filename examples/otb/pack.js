const otb2json = require("../otb2json");
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'items.json');

fs.readFile(filePath, {encoding: 'utf8'}, function (err, data) {
    if (!err) {
        const newItemsData = JSON.parse(data);
        otb2json.write("newItems.otb", newItemsData);
    } else {
        console.log(err);
    }
});
