'use strict';

// This module is instantiated twice. Once in the background process and once in the renderer process. They can't
// share data other than through IPC.

// module.exports = function task(iMax) {
// 	let result = 0;
// 	console.log(iMax)
// 	for (let i = 0; i < iMax; i++) {
// 		result += i;
// 		// console.log(result);
// 	}

// 	return result;
// };


module.exports = function task(sendobject , myobject) {
	let result = "";
	console.log(myobject);
	result = myobject['greet'];
	return result;
};