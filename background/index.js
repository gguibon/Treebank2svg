'use strict';
const { ipcRenderer } = require('electron');
const task = require('../shared/task');

// window.onload = function () {
// 	ipcRenderer.on('background-start', (startTime, timeMax) => {
// 		ipcRenderer.send('background-response', {
// 			result: task(timeMax),
// 			startTime: startTime,
// 			timeMax: timeMax
// 		});
// 	});
// };

window.onload = function () {
	ipcRenderer.on('background-start', (mystr) => {
		ipcRenderer.send('background-response', {
			// result: task(mystr)
			result: stringmodifier("boulbi")
		});
	});

	function stringmodifier(mystr){
		let res = 0;
		forloop();
		let youp = youpi(mystr, res);
		return youp;
	}

	function youpi(mystr,res) {
		return mystr + "youpi" + res;
	}

	function forloop() {
		let res = 0;
		for (let i = 0 ; i < 100000000 ; i++){
			res += i;
		}
		console.log("for loop end 1");
		for (let i = 0 ; i < 100000000 ; i++){
			res += i;
		}
		console.log("forloop end");
		return "yopla";
	}
};