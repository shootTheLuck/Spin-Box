## What is this?
A ModalWindow class made using the Custom Elements API and vanilla javascript..

[Live Demo Here](https://shootTheLuck.github.io/Modal-Window)

## How do I use it?
You'll want to reference modalWindow.css then: 
```javascript
// import
import ModalWindow from "./ModalWindow.js";

// create instance
var modal = new ModalWindow({title: "Modal Window"});

// add elements
modal.addElement("<HTML Element>");

// or markup
modal.addMarkup("<HTML markup>");

// append to your page
document.body.appendChild(modal);

// open
modal.open();
```
