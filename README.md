## What is this?
A SpinBox class made using vanilla Javascript and the Custom Elements API.  Adapted from Kate Morley "A spin box widget" http://code.iamkate.com/javascript/spin-box-widget/ CC0 1.0

[Live Demo Here](https://shootTheLuck.github.io/Spin-Box)

## Why would I want to use this?
You might not!  But I did because I didn't like the look of Firefox's input type=number and I wanted a different dynamic for the incrementing buttons.

## How do I use it?
You'll want to reference spinBox.css then: 
```javascript
// import
import SpinBox from "./SpinBox.js";

// create instance
var spinBox = new SpinBox({label: "spin box", min: 0});

// append to your page
document.body.appendChild(spinBox);
```
