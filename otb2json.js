const fs = require("fs");
const HEADERS = require("./lib/headers");

const NODE_ESC = 0xFD;
const NODE_INIT = 0xFE;
const NODE_TERM = 0xFF;

__VERSION__ = "1.0.0";

/* FUNCTION writeOTB
 * Writes OTB from intermediary JSON structure
 */
function writeOTB(__OUTFILE__, data) {

	/* FUNCTION writeNode
	 * Recursively writes all JSON nodes to OTB node structure
	 */
	function writeNode(node) {
		// Concatenate own data with children (recursively)
		// and pad the node with start & end identifier
		return Buffer.concat([
			Buffer.from([NODE_INIT]),
			writeElement(node),
			Buffer.concat(getChildNode(node).map(writeNode)),
			Buffer.from([NODE_TERM])
		]);
	}

	/* FUNCTION getChildNode
	 * Returns child node or dummy array if child does not exist
	 */
	function getChildNode(node) {
		return getChildNodeReal(node) || new Array();
	}

	/* FUNCTION getChildNodeReal
	 * Give children of a node a particular identifier
	 */
	function getChildNodeReal(node) {
		return node.nodes;
	}

	/* FUNCTION Node.setChildren
	 * Give children of a node a particular identifier
	 */
	function writeElement(node) {
		var buffer;
		var attrBuffer;

		// Write each node type
		buffer = Buffer.alloc(5);
		buffer.writeUInt8(node.type, 0);
		buffer.writeUInt32LE(writeFlags(node.flags), 1);

		if ("dwMajorVersion" in node) {
			attrBuffer = Buffer.alloc(3 + 140);
			attrBuffer.writeUInt8(HEADERS.ROOT_ATTR_VERSION, 0);
			attrBuffer.writeUInt16LE(140, 1);
			attrBuffer.writeUInt32LE(node.dwMajorVersion, 3);
			attrBuffer.writeUInt32LE(node.dwMinorVersion, 7);
			attrBuffer.writeUInt32LE(node.dwBuildNumber, 11);
			attrBuffer.write(node.CSDVersion, 15, 128, 'ascii');
			buffer = Buffer.concat([buffer, attrBuffer]);
		}

		if ("id" in node) {
			attrBuffer = Buffer.alloc(3 + 2);
			attrBuffer.writeUInt8(HEADERS.ITEM_ATTR_SERVERID, 0);
			attrBuffer.writeUInt16LE(2, 1);
			attrBuffer.writeUInt16LE(node.id, 3);
			buffer = Buffer.concat([buffer, attrBuffer]);
		}

		if ("clientId" in node) {
			attrBuffer = Buffer.alloc(3 + 2);
			attrBuffer.writeUInt8(HEADERS.ITEM_ATTR_CLIENTID, 0);
			attrBuffer.writeUInt16LE(2, 1);
			attrBuffer.writeUInt16LE(node.clientId, 3);
			buffer = Buffer.concat([buffer, attrBuffer]);
		}

		if ("spriteHash" in node) {
//			attrBuffer = Buffer.alloc(3 + 2);
//			attrBuffer.writeUInt8(HEADERS.ITEM_ATTR_SPRITEHASH, 0);
//			attrBuffer.writeUInt16LE(2, 1);
//			attrBuffer.writeUInt16LE(node.spriteHash, 3);
//			buffer = Buffer.concat([buffer, attrBuffer]);
			attrBuffer = Buffer.alloc(node.spriteHash.length / 2);
			attrBuffer.write(node.spriteHash, 0, node.spriteHash.length / 2, 'hex');
			buffer = Buffer.concat([buffer, attrBuffer]);
		}

		if ("lightLevel" in node) {
			attrBuffer = Buffer.alloc(3 + 4);
			attrBuffer.writeUInt8(HEADERS.ITEM_ATTR_LIGHT2, 0);
			attrBuffer.writeUInt16LE(4, 1);
			attrBuffer.writeUInt16LE(node.lightLevel, 3);
			attrBuffer.writeUInt16LE(node.lightColor, 5);
			buffer = Buffer.concat([buffer, attrBuffer]);
		}

		if ("name" in node) {
//			attrBuffer = Buffer.alloc(3 + 2);
//			attrBuffer.writeUInt8(HEADERS.ITEM_ATTR_NAME, 0);
//			attrBuffer.writeUInt16LE(node.name.length, 1);
//			attrBuffer.write(node.name, 3, node.name.length);
//			buffer = Buffer.concat([buffer, attrBuffer]);
			attrBuffer = Buffer.alloc(node.name.length / 2);
			attrBuffer.write(node.name, 0, node.name.length / 2, 'hex');
			buffer = Buffer.concat([buffer, attrBuffer]);
		}

		if ("minimapColor" in node) {
			attrBuffer = Buffer.alloc(3 + 2);
			attrBuffer.writeUInt8(HEADERS.ITEM_ATTR_MINIMAPCOLOR, 0);
			attrBuffer.writeUInt16LE(2, 1);
			attrBuffer.writeUInt16LE(node.minimapColor, 3);
			buffer = Buffer.concat([buffer, attrBuffer]);
		}

		if ("speed" in node) {
			attrBuffer = Buffer.alloc(3 + 2);
			attrBuffer.writeUInt8(HEADERS.ITEM_ATTR_SPEED, 0);
			attrBuffer.writeUInt16LE(2, 1);
			attrBuffer.writeUInt16LE(node.speed, 3);
			buffer = Buffer.concat([buffer, attrBuffer]);
		}

		if ("attr07" in node) {
			attrBuffer = Buffer.alloc(3 + 2);
			attrBuffer.writeUInt8(HEADERS.ITEM_ATTR_07, 0);
			attrBuffer.writeUInt16LE(2, 1);
			attrBuffer.writeUInt16LE(node.attr07, 3);
			buffer = Buffer.concat([buffer, attrBuffer]);
		}

		if ("attr08" in node) {
			attrBuffer = Buffer.alloc(3 + 2);
			attrBuffer.writeUInt8(HEADERS.ITEM_ATTR_08, 0);
			attrBuffer.writeUInt16LE(2, 1);
			attrBuffer.writeUInt16LE(node.attr08, 3);
			buffer = Buffer.concat([buffer, attrBuffer]);
		}

		if ("alwaysOnTopOrder" in node) {
			attrBuffer = Buffer.alloc(3 + 1);
			attrBuffer.writeUInt8(HEADERS.ITEM_ATTR_TOPORDER, 0);
			attrBuffer.writeUInt16LE(1, 1);
			attrBuffer.writeUInt8(node.alwaysOnTopOrder, 3);
			buffer = Buffer.concat([buffer, attrBuffer]);
		}

		if ("wareId" in node) {
			attrBuffer = Buffer.alloc(3 + 2);
			attrBuffer.writeUInt8(HEADERS.ITEM_ATTR_WAREID, 0);
			attrBuffer.writeUInt16LE(2, 1);
			attrBuffer.writeUInt16LE(node.wareId, 3);
			buffer = Buffer.concat([buffer, attrBuffer]);
		}

		if ("unknown" in node) {
			attrBuffer = Buffer.alloc(node.unknown.length / 2);
			attrBuffer.write(node.unknown, 0, node.unknown.length / 2, 'hex');
			buffer = Buffer.concat([buffer, attrBuffer]);
		}

		return escapeCharacters(buffer);
	}

	/* FUNCTION escapeCharacters
	 * Escapes special 0xFD, 0xFE, 0xFF characters in buffer
	 */
	function escapeCharacters(buffer) {
		for (var i = 0; i < buffer.length; i++) {
			if (buffer.readUInt8(i) === NODE_TERM || buffer.readUInt8(i) === NODE_INIT || buffer.readUInt8(i) === NODE_ESC) {
				buffer = Buffer.concat([buffer.slice(0, i), Buffer.from([NODE_ESC]), buffer.slice(i)]);
				i++;
			}
		}

		return buffer;
	}

	/* FUNCTION writeFlags
	 * Writes OTB tile bit-flags to integer
	 */
	function writeFlags(nodeFlags) {
		var flags = HEADERS.TILESTATE_NONE;

		flags |= nodeFlags.bS && HEADERS.FLAG_BLOCK_SOLID;
		flags |= nodeFlags.bPr && HEADERS.FLAG_BLOCK_PROJECTILE;
		flags |= nodeFlags.bPa && HEADERS.FLAG_BLOCK_PATHFIND;
		flags |= nodeFlags.hH && HEADERS.FLAG_HAS_HEIGHT;
		flags |= nodeFlags.u && HEADERS.FLAG_USEABLE;
		flags |= nodeFlags.p && HEADERS.FLAG_PICKUPABLE;
		flags |= nodeFlags.m && HEADERS.FLAG_MOVEABLE;
		flags |= nodeFlags.s && HEADERS.FLAG_STACKABLE;

		flags |= nodeFlags.aOT && HEADERS.FLAG_ALWAYSONTOP;
		flags |= nodeFlags.iV && HEADERS.FLAG_VERTICAL;
		flags |= nodeFlags.iHo && HEADERS.FLAG_HORIZONTAL;
		flags |= nodeFlags.iHa && HEADERS.FLAG_HANGABLE;
		flags |= nodeFlags.aDR && HEADERS.FLAG_ALLOWDISTREAD;
		flags |= nodeFlags.r && HEADERS.FLAG_ROTABLE;
		flags |= nodeFlags.cRT && HEADERS.FLAG_READABLE;
		flags |= nodeFlags.lT && HEADERS.FLAG_LOOKTHROUGH;
		flags |= nodeFlags.iA && HEADERS.FLAG_ISANIMATION;
		flags |= nodeFlags.fG && HEADERS.FLAG_FULLGROUND;
		flags |= nodeFlags.fU && HEADERS.FLAG_FORCEUSE;

		return flags;
	}

	// OTB Header
	const VERSION = Buffer.alloc(4).fill(0x00);

	// Write all nodes
	fs.writeFileSync(__OUTFILE__, Buffer.concat([VERSION, writeNode(data.data)]));
}

/* FUNCTION readOTB
 * Reads OTB file to intermediary JSON structure
 */
function readOTB(__INFILE__) {

	/* CLASS Node
	 * Holds a particular OTB node of type (see below)
	 */
	var Node = function (data, children) {
		var index = 0;

		// Remove the escape character from the node data string
		data = this.removeEscapeCharacters(data);

		var iType = data.readUInt8(index);
		index += 1;

		this.type = iType;

		//read 4 byte flags
		var flags = data.readUInt32LE(index);
		index += 4;

		this.flags = {};
		this.flags.bS = hasBitSet(HEADERS.FLAG_BLOCK_SOLID, flags);
		this.flags.bPr = hasBitSet(HEADERS.FLAG_BLOCK_PROJECTILE, flags);
		this.flags.bPa = hasBitSet(HEADERS.FLAG_BLOCK_PATHFIND, flags);
		this.flags.hH = hasBitSet(HEADERS.FLAG_HAS_HEIGHT, flags);
		this.flags.u = hasBitSet(HEADERS.FLAG_USEABLE, flags);
		this.flags.p = hasBitSet(HEADERS.FLAG_PICKUPABLE, flags);
		this.flags.m = hasBitSet(HEADERS.FLAG_MOVEABLE, flags);
		this.flags.s = hasBitSet(HEADERS.FLAG_STACKABLE, flags);

		this.flags.aOT = hasBitSet(HEADERS.FLAG_ALWAYSONTOP, flags);
		this.flags.iV = hasBitSet(HEADERS.FLAG_VERTICAL, flags);
		this.flags.iHo = hasBitSet(HEADERS.FLAG_HORIZONTAL, flags);
		this.flags.iHa = hasBitSet(HEADERS.FLAG_HANGABLE, flags);
		this.flags.aDR = hasBitSet(HEADERS.FLAG_ALLOWDISTREAD, flags);
		this.flags.r = hasBitSet(HEADERS.FLAG_ROTABLE, flags);
		this.flags.cRT = hasBitSet(HEADERS.FLAG_READABLE, flags);
		this.flags.lT = hasBitSet(HEADERS.FLAG_LOOKTHROUGH, flags);
		this.flags.iA = hasBitSet(HEADERS.FLAG_ISANIMATION, flags);
		this.flags.fG = hasBitSet(HEADERS.FLAG_FULLGROUND, flags);
		this.flags.fU = hasBitSet(HEADERS.FLAG_FORCEUSE, flags);

		while (index < data.length) {
			var attribute = data.readUInt8(index);
			index += 1;

			var length = data.readUInt16LE(index);
			index += 2;

			switch (attribute) {
				case HEADERS.ROOT_ATTR_VERSION:
				{
					var dwMajorVersion = data.readUInt32LE(index);
					index += 4;

					var dwMinorVersion = data.readUInt32LE(index);
					index += 4;

					var dwBuildNumber = data.readUInt32LE(index);
					index += 4;

					var CSDVersion = data.toString('ascii', index, 128);
					index += 128;

					this.dwMajorVersion = dwMajorVersion;
					this.dwMinorVersion = dwMinorVersion;
					this.dwBuildNumber = dwBuildNumber;
					this.CSDVersion = CSDVersion;
					break;
				}
				case HEADERS.ITEM_ATTR_SERVERID:
				{
					var serverId = data.readUInt16LE(index);
					index += 2;

					this.id = serverId;
					break;
				}
				case HEADERS.ITEM_ATTR_CLIENTID:
				{
					var clientId = data.readUInt16LE(index);
					index += 2;

					this.clientId = clientId;
					break;
				}
				case HEADERS.ITEM_ATTR_NAME:
				{
					var start = index - 3;
					var end = start + length + 3;
					var name = data.slice(start, end).toString('hex');
//					var name = data.slice(index, index + length).toString();
					index += length;

					this.name = name;
					break;
				}
				case HEADERS.ITEM_ATTR_SPEED:
				{
					var speed = data.readUInt16LE(index);
					index += 2;

					this.speed = speed;
					break;
				}
				case HEADERS.ITEM_ATTR_SPRITEHASH:
				{
					var start = index - 3;
					var end = start + length + 3;
					var spriteHash = data.slice(start, end).toString('hex');
//					var spriteHash = data.readUInt16LE(index);
					index += length;

					this.spriteHash = spriteHash;
					break;
				}
				case HEADERS.ITEM_ATTR_MINIMAPCOLOR:
				{
					var minimapColor = data.readUInt16LE(index);
					index += length;

					this.minimapColor = minimapColor;
					break;
				}
				case HEADERS.ITEM_ATTR_07:
				{
					var attr07 = data.readUInt16LE(index);
					index += length;

					this.attr07 = attr07;
					break;
				}
				case HEADERS.ITEM_ATTR_08:
				{
					var attr08 = data.readUInt16LE(index);
					index += length;

					this.attr08 = attr08;
					break;
				}
				case HEADERS.ITEM_ATTR_LIGHT2:
				{
					var lightLevel = data.readUInt16LE(index);
					index += 2;

					var lightColor = data.readUInt16LE(index);
					index += 2;

					this.lightLevel = lightLevel;
					this.lightColor = lightColor;
					break;
				}
				case HEADERS.ITEM_ATTR_TOPORDER:
				{
					var topOrder = data.readUInt8(index);
					index += 1;

					this.alwaysOnTopOrder = topOrder;
					break;
				}
				case HEADERS.ITEM_ATTR_WAREID:
				{
					var wareId = data.readUInt16LE(index);
					index += 2;

					this.wareId = wareId;
					break;
				}
				default:
				{
//					console.log(attribute);
//					console.log(length);
					//skip unknown attributes, but save its key, length and data
					var start = index - 3;
					var end = start + length + 3;
					var unknown = data.slice(start, end).toString('hex');
					index += length;

					this.unknown = unknown;
					break;
				}
			}
		}

		// Set node children
		if (children.length) {
			this.setChildren(children);
		}
	};

	/* FUNCTION removeEscapeCharacter
	 * Removes 0xFD escape character from the byte string
	 */
	Node.prototype.removeEscapeCharacters = function (nodeData) {
		var iEsc = 0;
		var index;

		while (true) {
			// Find the next escape character
			index = nodeData.slice(++iEsc).indexOf(NODE_ESC);

			// No more: stop iteration
			if (index === -1) {
				return nodeData;
			}

			iEsc = iEsc + index;

			// Remove the character from the buffer
			nodeData = Buffer.concat([
				nodeData.slice(0, iEsc),
				nodeData.slice(iEsc + 1)
			]);
		}
	};

	/* FUNCTION Node.setChildren
	 * Give children of a node a particular identifier
	 */
	Node.prototype.setChildren = function (children) {
		this.nodes = children;
	};

	function hasBitSet(flag, flags) {
		return ((flags & flag) === flag);
	}

	/* FUNCTION readNode
	 * Recursively parses OTB nodal tree structure
	 */
	function readNode(data) {
		// Cut off the initializing 0xFE identifier
		data = data.slice(1);

		var i = 0;
		var children = new Array();
		var nodeData = null;
		var child;

		// Start reading the array
		while (i < data.length) {

			var cByte = data.readUInt8(i);

			// Data belonging to the parent node, between 0xFE and (OxFE || 0xFF)
			if (nodeData === null && (cByte === NODE_INIT || cByte === NODE_TERM)) {
				nodeData = data.slice(0, i);
			}

			// Escape character: skip reading this and following byte
			if (cByte === NODE_ESC) {
				i = i + 2;
				continue;
			}

			// A new node is started within another node: recursion
			if (cByte === NODE_INIT) {
				child = readNode(data.slice(i));
				children.push(child.node);

				// Skip index over full child length
				i = i + 2 + child.i;
				continue;
			}

			// Node termination
			if (cByte === NODE_TERM) {
				return {
					"node": new Node(nodeData, children),
					"i": i
				};
			}

			i++;
		}
	}

	const data = fs.readFileSync(__INFILE__);

	// First four magic bytes are the format identifier
	const FORMAT_IDENTIFIER = data.readUInt32LE(0);

	// Confirm OTB format by reading magic bytes (NULL)
	if (FORMAT_IDENTIFIER !== 0x00000000) {
		throw("Unknown OTB format: unexpected magic bytes.");
	}

	// Create an object to hold the data
	var otbData = {
		"version": __VERSION__,
		"identifier": FORMAT_IDENTIFIER,
		"data": readNode(data.slice(4)).node
	};

	return otbData;
}

module.exports.read = readOTB;
module.exports.write = writeOTB;
module.exports.HEADERS = HEADERS;
module.exports.__VERSION__ = __VERSION__;
