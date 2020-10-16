## What is this?
A spin box class made using vanilla Javascript and the Custom Elements API. It's adapted from Kate Morley's Spin Box Widget here: http://code.iamkate.com/javascript/spin-box-widget/ CC0 1.0

[Live Demo Here](https://shootTheLuck.github.io/Spin-Box)

## Why would I want to use this?
I didn't like the look of the stock html input element type=number and found it to be unstylable. I also wanted a different dynamic for the button behavior.

## How do I use it?
You'll want to reference spinBox.css then:
```javascript
// import
import {SpinBox} from "./SpinBox.js";

// create instance
var spinBox = new SpinBox({label: "spin box", min: 0});

// append to your page
document.body.appendChild(spinBox);

// Set value with .setValue method
// Get value with .getValue method
// Listen for changes by adding event listener:

spinBox.addEventListener("spinBoxChange", function(evt) {
  console.log("spinBox changed by", evt.detail.delta);
  console.log("spinBox value now", evt.detail.value);
}, false);
```
