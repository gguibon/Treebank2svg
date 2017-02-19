# treebank2svg

Independant tool to extract all trees from a treebank into collections of svg files.

Using this tool a directory like this:
mytreebank
 ˪ file1.conll
 ˪ subdir
    ˪ file2.conll

Will generate a copy of this directory containing SVG collections:
mytreebank_SVG
 ˪ file1.conll
 	˪ tree1.svg
 	˪ tree2.svg
 ˪ subdir
    ˪ file2.conll
    	˪ tree.svg
    	˪ tree.svg


![homescreen](https://github.com/gguibon/Treebank2svg/blob/master/img/homescreen.PNG "treebank2svg")

---

# Install 

## Installers

[treebank2svg.deb](https://github.com/gguibon/Treebank2svg/releases/download/0.1.2/treebank2svg.deb)

Installers for MacOs and Windows coming soon. The app is still available through npm for these platform (see next section).

## *Multi platform* using npm and git

Import the code:
```
git clone https://github.com/gguibon/Treebank2svg.git treebank2svg
```

Install dependencies:
```
cd treebank2svg
```
```
bash install.sh
```

Start the app:
```
npm start
```

## For dev through npm

To install it:
```
npm install treebank2svg --save
```
To start treebank2svg:
```
npm start
```
---

# Source Code
The source code is available on [github](https://github.com/gguibon/Treebank2svg)

---

# Licence
This application is under the AGPL-3.0 licence.