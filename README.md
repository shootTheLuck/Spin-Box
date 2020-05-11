## What is this?
A spin box class made using vanilla Javascript and the Custom Elements API.  It's adapted from Kate Morley's "A spin box widget in Javascript" http://code.iamkate.com/javascript/spin-box-widget/ CC0 1.0

[Live Demo Here](https://shootTheLuck.github.io/Spin-Box)

## Why would I want to use this?
You might not!  I did because I didn't like the look of Firefox's input type=number and I wanted a different dynamic for the button behavior.

## How do I use it?
You'll want to reference spinBox.css then: 
```javascript
// import
import SpinBox from "./SpinBox.js";

// create instance
var spinBox = new SpinBox({label: "spin box", min: 0});

// append to your page
document.body.appendChild(spinBox);

// Set value with .setValue method
// Get value with .getValue method
// Listen for changes by adding event listener:

spinBox.addEventListener("spinboxChange", function(evt) {
  console.log("spinBox changed by", evt.detail.delta);
  console.log("spinBox value now", evt.detail.value);
}, false);

// Depends CoolButton.js, spinBox.css
```
