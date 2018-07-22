# OTBM2JSON
NodeJS library for programmatically modifying Open Tibia Binary Mapping files. This framework reads .otbm files and parses them to an intermediary JSON format. This JSON structure can be changed programatically to make generic modifications. Once a change has been committed to the structure, it can be encoded back to an .otbm file.

## JSON Structure
The structure of the intermediary JSON format read from and to `.otbm` can be seen in the example `OTBM.json`.

## Usage
Import the library in your script:

    const otbm2json = require("./otbm2json.js");

The library provides two functions for reading and writing OTBM:

    data = otbm2json.read(filename);
    
    ** Modify the data object here **
    
    otbm2json.write(filename, data);

For an example see below.

## Example
An example script `examples/example.js` is provided. This script uses the `examples/void.otbm` (8x8 void area) in this repository and replaces all void tiles with chessboard tiles and writes the result to  `examples/chess.otbm`.

<p align="center">
  <img src="images/void.png">
  <img src="images/convert.png">
  <img src="images/chess.png">
</p>

## Version
Current version 0.2.0. This is a work in progress.

# OTB2JSON
Based on OTBM2JSON library which reads .otb files and parses them into JSON format. As in original library, file can be later parsed again into .otb file to use it in RME, otitemeditor or OTServer.

## Usage

Import the library in your script:

    const otbm2json = require("./otb2json.js");

The library provides two functions for reading and writing OTB:

    data = otb2json.read(filename);
    
    ** Modify the data object here **
    
    otb2json.write(filename, data);

## Example

Inside `examples/otb` directory there are 3 files:
* `unpack.js` which converts included `items.otb` file from RME for 8.60 version into `items.json`
* `pack.js` which can convert generated `items.json` into `newItems.otb`
* `test.js` which:
  1. creates `items.json` from `items.otb`
  2. creates `newItems.otb` from `items.json`
  3. creates `newItems.json` from `newItems.otb`

and you can see no difference in both JSON files which means scripts work correctly.   