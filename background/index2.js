'use strict';
const { ipcRenderer } = require('electron');
const task = require('../shared/task');
const fs = require("fs");
const ncp = require('ncp').ncp;
const mkdirp = require('mkdirp');
const modulepath = require('path');
const mv = require('mv');
const dialog = require('electron').remote.dialog ;

window.onload = function () {
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

ipcRenderer.on('background-start', (mystr) => {
  ipcRenderer.send('background-response', {result: progress(0,100), progresstype: "dir"});
  ipcRenderer.send('background-response', {result: progress(0,100), progresstype: "file"});
  openDirFile();
});



let localid = 0;
let outputdirfile = "";
let timestamp = "";
let list = [];
let svglist = [];
let treefolder = []
let total = 0;
let current = 0;
let filetotal = 0;
let filecurrent = 0;
let percent = 0;
let oldpercent = 0;
let nbsent = 0;

let delay = 0;
let sleepTime = 100;
let removeTransition = true;

let sFullPathOrigin = "";
let sFullPath = "";

let intervalfreedom;
  function freeui() {
    setTimeout(function () {
      console.log("free =)");
  }, 0);
}
// intervalfreedom = setInterval(freeui, 0);

// removeload();

// Synchronous read
function readfile(path) {
	let data = fs.readFileSync(path);
	return data.toString();
}

function writefile(path, content) {
	fs.writeFile(path, content, function(err) {
	    if(err) {
	        return console.log(err);
	    }
	}); 
  return;
}

function movefile(inputpath, outputpath)
// deplace a file and if the directory does not exist, create it.
{
  mv(inputpath, outputpath, {mkdirp: true}, function(err) {
    // done. it first created all the necessary directories, and then
    // tried fs.rename, then falls back to using ncp to copy the dir
    // to dest and then rimraf to remove the source dir
  });
  return;
}

let walk = function(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file){
      	let content = results.join("\n");
      	return done("temp", content);
      } 
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
  return;
};


function parsehtmlfile(path, outputpath){
  let defer = $.Deferred();
	let el = document.createElement( 'html' );
  let content = readfile(sFullPathOrigin);
  outputdirfile = sFullPath;
  content = content.replace(/^\s+|\s+$/g, '');
  content = "<conll>" + content;
  content = content.replaceAll("\n\n", "</conll>\n<conll>");
  content = content.replace(new RegExp("<conll>" + '$'), '');
  content = content + "</conll>";
  el.innerHTML = "<!DOCTYPE html><html><head><title>Page Title</title></head><body>" + content + "</body></html>";
  let listconll = el.getElementsByTagName( 'conll' ); // Live NodeList of your anchor elements
  let treeview = document.getElementById('treeview');
  // let treeview = document.createElement('div').setAttribute("id", "treeview");
  // treeview.setAttribute("id", "treeview");
  treeview.innerHTML = content;

  list = document.getElementsByTagName("conll");
  defer.resolve();
  return defer;
}

function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    let evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
  return;
}

String.prototype.replaceAll = function(search, replacement) {
    let target = this;
    return target.split(search).join(replacement);
};

function getSVG (svg, name) {
  // first create a clone of our svg node so we don't mess the original one
  let clone = svg.cloneNode(true);
  // parse the styles
  parseStyles(clone);

  // create a doctype
  let svgDocType = document.implementation.createDocumentType('svg', "-//W3C//DTD SVG 1.1//EN", "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd");
  // a fresh svg document
  let svgDoc = document.implementation.createDocument('http://www.w3.org/2000/svg', 'svg', svgDocType);
  // replace the documentElement with our clone 
  svgDoc.replaceChild(clone, svgDoc.documentElement);
  // get the data
  let svgData = (new XMLSerializer()).serializeToString(svgDoc);

  // now you've got your svg data, the following will depend on how you want to download it
  // e.g yo could make a Blob of it for FileSaver.js
  
  let blob = new Blob([svgData.replace(/></g, '>\n\r<')]);
  // saveAs(blob, name+ '.svg');
  return svgData.replace(/></g, '>\n\r<');
}

function getsvglist(){
  svglist = document.getElementsByTagName("svg");
  return;
}

function export2svg (i) {
  let defer = $.Deferred();
  let sentenceName = $('#sentence'+(i+1)).text();
  sentenceName = sentenceName.substring(0, 150);
  let svg = getSVG(svglist[i], sentenceName);
  let filename = i + sentenceName + "_" + localid + ".svg";
  console.log(filename);
  writefile( filename, svg);
  movefile( filename, outputdirfile + "/"+ filename );
  localid++;

  defer.resolve();
  return defer;
}

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

let dir2svg = function(dir, done) {
  let results = [];
  let newDir = dir + "_SVG";
  mkdir(newDir);
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file){
      	let content = results.join("\n");
        // setTimeout(function(){ document.getElementById("loadinggif").innerHTML = "<div id='load'></div>"; }, 500);
      	return done(results, dir);
      } 
      file = dir + '/' + file;
      console.log( file );
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
  return;
};

function stocktree(inputarray, dir){
	treefolder = inputarray;
  addload();
  removeload();
  let newDir = dir + "_SVG";
  console.log(inputarray);
  filetotal = inputarray.length;
 
    for(let g = 0 ; g < inputarray.length ; g++){
      console.log((g+1) +" / " + inputarray.length + " dir");
      let aPaths = inputarray;
      sFullPathOrigin = aPaths[g];
      sFullPath = aPaths[g].replace(dir, newDir);
      let aStairs = sFullPath.split("/");
      aStairs.pop();
      let sTree = aStairs.join("/");
      let sFilename = modulepath.basename(aPaths[g]);
      mkdirpath(sTree);
      parsehtmlfile(sFullPathOrigin, sFullPath).then(drawThenExport).then(dirprogress(g,inputarray.length));
      ipcRenderer.send('background-response', {result: progress(g+1,inputarray.length), progresstype: "dir"});
    }

  return ipcRenderer.send('background-response', {result: progress(100,100), progresstype: "dir"});
}

function drawThenExport(){
  console.log("drawthenexport");
  let defer = $.Deferred();
  total = list.length;
  for (let l = 0 ; l < list.length ; l++){
    progress(l+1,list.length);
      current = l;
      drawConll1(list[l],l+1).then(getsvglist).then(export2svg(l)).then(progress(l+1,list.length));
      ipcRenderer.send('background-response', {result: progress(l+1,list.length), progresstype: "file"});
  }
  return progress(100,100);
}



function similiclick (){
  let defer = $.Deferred();
  eventFire(document.getElementById('triggerddl'), 'click');
  defer.resolve();
  return defer;
}

let toType = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

function mkdir(dir)
// create a dir and check if it does exist
{
	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir);
	}
  return;
}

function mkdirpath (path) 
// create missing directories from a path
{
  mkdirp(path, function (err) {
    if (err) console.error(err)
    else console.log('dir created')
  });
  return;
}

/* upload btn */

$('.upload-btn').on('click', function (){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});

$('#upload-input').on('change', function(){

  let files = $(this).get(0).files;
  console.log(file);

  if (files.length > 0){
    // One or more files selected, process the file upload
  }

});


/////////////////////////////////////////////
function openFile () {

 dialog.showOpenDialog(function (fileNames) {

  if (fileNames === undefined) return;
  if (fileNames.length > 1) return;

  let fileName = fileNames[0];
  $('#fileprogress').text('0%');
  $('#fileprogress').width('0%');
  addload();
    setTimeout(function () {
      dir2svg(fileName, stocktree);
    }, {properties: ['openDirectory']}); 
  }, 0);
 return removeload();

}

function openDirFile(){
  // addload();
  let path = dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  // console.log(path);
  // dir2svg(path[0], stocktree);//.then(finished);

  // let path = "/home/gael/Documents/SRCMF/Rhapsodie/sylvain2";
  return dir2svg(path[0], stocktree);
  // return res;
  // .then(function(){
  //   console.log("ending");
  //   return {result: "finished"};
  // });
  // setTimeout(function(){ return "finished" }, 3000);
   // return "finidhed";
   // return ipcRenderer.send('background-response', { result: dir2svg(path, stocktree) });
}

function end(){
  console.log("ending");
    return "finished";
}

function finished() {
  //  let d = document.getElementById("fileprogress");
  // d.className += " active";
    $('#fileprogress').text('100%');
    $('#fileprogress').width('100%');
    return;
}

function progress(current, total) {
      percent = (current / total) * 100;
      // console.log("fileprogress = " + percent+"%");
      // $('#fileprogress').text(percent+'%');
      // $('#fileprogress').width(percent+'%');
  return Math.round(percent);
}


function dirprogress(current, total) {
  
    let perc = (current / total) * 100;
    console.log("dirprogress = " + perc+"%");
    $('#dirprogress').text(perc+'%');
    $('#dirprogress').width(perc+'%');
    return;

}


function sleep(sleepyTime) {
  let start = +new Date;
  while (+new Date - start < sleepyTime){}
  return;
}

function interval(func, wait, times){
    let interv = function(w, t){
        return function(){
            if(typeof t === "undefined" || t-- > 0){
                setTimeout(interv, w);
                try{
                    func.call(null);
                }
                catch(e){
                    t = 0;
                    throw e.toString();
                }
            }
        };
    }(wait, times);

    setTimeout(interv, wait);
};

function removeload (){
  // document.getElementById("loadinggif").innerHTML = "Finished!";
  $('#loadinggif').hide();
  return;
}

function addload (){
  // document.getElementById("loadinggif").innerHTML = "<div id='load'></div>";
  $('#loadinggif').show();
  return;
}

/* end upload btn */

};