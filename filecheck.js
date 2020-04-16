fs = require('fs');
const DEVPATH = "/dev/serial/by-id/";

fileListArray = fs.readdirSync(DEVPATH);
function checkUSB(fileName) {
         return fileName.includes("CP2102");
};

serialPort = DEVPATH + fileListArray.find(checkUSB);
console.log(serialPort);

/*SerialPort.list().then(
  ports => ports.forEach(console.log),
  err => console.error(err)
)*/
const SERIALPORT = require('serialport');

//SERIALPORT.prototype.BACKLIGHTSTATE = true;
Object.defineProperty(SERIALPORT, "BACKLIGHTSTATE", { value: true, writable: true });
Object.defineProperty(SERIALPORT, "SCREENWIDTH", { value: 16 });
Object.defineProperty(SERIALPORT, "SCREENHEIGHT", { value: 2 });

const PORT = new SERIALPORT(serialPort);

PORT.on('open', showPortOpen);
PORT.on('close', showPortClose);
PORT.on('error', showError);

function showPortOpen() {
   console.log('port open. Data rate: ' + PORT.baudRate);
}
function showPortClose() {
   console.log('port closed.');
}
function showError(error) {
   console.log('Serial port error: ' + error);
}

function turnOffBackLight(port){
port.write([0xFE, 0x46]);
port.BACKLIGHTSTATE = false;
}

function turnOnBackLight(port){
port.write([0xFE, 0x42, 0x00]);
port.BACKLIGHTSTATE = true;
}

function flipBackLight(port){
port.BACKLIGHTSTATE ? turnOffBackLight(port) : turnOnBackLight(port);
}

//turnOffBackLight(PORT);
//setTimeout(function(){ turnOnBackLight(PORT); }, 3000);

setInterval(function(){ flipBackLight(PORT); },1000);
//setInterval(function(){ printDate(PORT); },1000);
//setInterval(function(){ printTime(PORT); },1);

//var buff = Buffer.alloc(20,' ','ascii');


//    String.padEnd(16," ");
// PORT.write([0xFE,0x47,0x01,0x02,0x68,0x65,0x6C,0x6C,0x6F,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20,0x20])
function printDate(port){
	var data = Buffer.alloc(20,' ','ascii');
	data.hexWrite('FE470101',0);
	data.asciiWrite(Date(),4);
	port.write(data.slice(0,20));
}

function printTime(port){
	var data = Buffer.alloc(20,' ','ascii');
	data.hexWrite('FE470102',0);
	data.asciiWrite(Date.now().toString(),4);
	port.write(data.slice(0,20));
}


