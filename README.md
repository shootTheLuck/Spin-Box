## What is this?
A SpinBox class made using the Custom Elements API and vanilla javascript.  Adapted from Kate Morley "A spin box widget" http://code.iamkate.com/javascript/spin-box-widget/ CC0 1.0

[Live Demo Here](https://shootTheLuck.github.io/Spin-Box)

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
