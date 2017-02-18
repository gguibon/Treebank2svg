'use strict';
const { ipcRenderer } = require('electron');
const task = require('../shared/task');

window.onload = function () {
	// setInterval(() => {
	// 	const progressBar = document.getElementById('progress-bar');
	// 	const maxValue = parseInt(progressBar.getAttribute('max'), 10);
	// 	let nextValue = parseInt(progressBar.getAttribute('value'), 10) + 1;

	// 	if (nextValue > maxValue) {
	// 		nextValue = 0;
	// 	}

	// 	progressBar.setAttribute('value', nextValue);
	// }, 25);

	// function startProcess() {
	// 	document.getElementById('statusdir').textContent = 'Started!';
	// }

	function finishProcess(result, timeElapsed, timeMax) {
		// document.getElementById('status').textContent =
		// 	'Finished with a result of: ' +
		// 	result +
		// 	' in ' +
		// 	(timeElapsed / 1000) +
		// 	' seconds'+
		// 	' '+ timeMax;
		document.getElementById('statusfile').textContent =
			'File progress ' + result.result ;
	}

	function finishDirProcess(result, timeElapsed, timeMax) {
		document.getElementById('statusdir').textContent =
			'Dir progress ' + result.result ;
	}

	function progress(result) {
      $('#fileprogress').text(result.result+'% File Progress');
      $('#fileprogress').width(result.result+'%');
      if(result.result == 100){
	  	$('#fileprogress').removeClass('progress-bar-info');
	  	$('#fileprogress').addClass('progress-bar-success');
	  }
	  if(result.result == 0){
	  	$('#fileprogress').removeClass('progress-bar-succes');
	  	$('#fileprogress').addClass('progress-bar-info');
	  }
	  return ;
	}


	function dirprogress(result) {
	    $('#dirprogress').text(result.result+'% Progress');
	    $('#dirprogress').width(result.result+'%');
	    if(result.result == 100){
	    	$('#dirprogress').removeClass('progress-bar-primary');
	    	$('#dirprogress').addClass('progress-bar-success');
	    }
	    if(result.result == 0){
		  	$('#dirprogress').removeClass('progress-bar-primary');
		  	$('#dirprogress').addClass('progress-bar-success');
	  	}
	    return;
	}

	// const rendererButton = document.getElementById('in-renderer');

	// rendererButton.onclick = function longRunningRendererTask() {
	// 	const startTime = new Date();

	// 	// Note that the UI won't update with this call since we're stuck in a JavaScript process and the UI is
	// 	// unresponsive until this loop finishes. The div will go straight to finished.
	// 	startProcess();

	// 	finishProcess(task(10000), new Date() - startTime, 10000);
	// };

	const backgroundButton = document.getElementById('in-background');

	// backgroundButton.onclick = function longRunningBackgroundTask() {
	// 	// We have to cast to a number because crossing the IPC boundary will convert the Date object to an empty object.
	// 	// Error, Date and native objects won't be able to be passed around via IPC.
	// 	const backgroundStartTime = +new Date();
	// 	const timeMax = 10000;
	// 	startProcess();
	// 	ipcRenderer.send('background-start', backgroundStartTime, timeMax);
	// 	console.log(timeMax);
	// }

	backgroundButton.onclick = function longRunningBackgroundTask() {
		// We have to cast to a number because crossing the IPC boundary will convert the Date object to an empty object.
		// Error, Date and native objects won't be able to be passed around via IPC.
		const myobject = {greet: "hello world"};
		// startProcess();
		dirprogress(0);
		progress(0);
		ipcRenderer.send('background-start', myobject);
		console.log(myobject);
	}

	// ipcRenderer.on('background-response', (event, payload) => {
	// 	console.log(payload.timeMax);
	// 	finishProcess(payload.result, new Date() - payload.startTime, payload.timeMax);
	// });

	ipcRenderer.on('background-response', (event, payload) => {
		if(payload.progresstype == "dir"){
			dirprogress(payload);
			// finishDirProcess(payload);
			console.log(payload);
		}
		if(payload.progresstype == "file"){
			progress(payload);
			// finishProcess(payload);
			console.log(payload);
		}
	});
};