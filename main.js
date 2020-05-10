
import ModalWindow from "./ModalWindow.js";
import SpinBox from "./SpinBox.js";
import ColorPicker from "./ColorPicker.js";

var frame = document.getElementById("frame");

var test = new ModalWindow({title: "Test Modal"});
document.body.appendChild(test);

var showModalButton = document.createElement("button");
showModalButton.id = showModalButton;
showModalButton.innerHTML = "&times;";
showModalButton.style.fontSize = 33 + "px";
document.body.appendChild(showModalButton);

showModalButton.onclick = function() {test.open();};

const markup = `
<label for="object-name-input">Object</label>
<input id="object-name-input" type="text">
<div id="transform-area" class="transform-area">
    <div id="gridSize"> </div>
    <div id="position-vector" class="vector-area">
        <label class="vector-area-label">Position</label>
        <spin-box id="positionXSpinner" label="positionSpinner" decimals="2" value="13"></spin-box>
    </div>
    <div id="rotation-vector" class="vector-area">
        <label class="vector-area-label">Rotation</label>
    </div>
    <div id="scale-vector" class="vector-area">
        <label class="vector-area-label">Scale</label>
    </div>
</div>
`;
test.addMarkup(markup);
var scaleArea = document.getElementById("scale-vector");
var scaleSpinner = new SpinBox({label: "scaleSpinner", decimals: 2, min: -1, max: 4, value: -1});
scaleArea.appendChild(scaleSpinner);

var positionXSpinner = document.getElementById("positionXSpinner");
// positionXSpinner.decimals = 3;
// positionXSpinner.min = 0;

// test.open();

// const template = document.getElementById("transform-editor");
// var heading = document.getElementById("heading");

var test2 = new ModalWindow();
test2.addShadow(heading, true);
document.body.appendChild(test2);
test2.open();

var spinBox = new SpinBox({decimals: 2, min: 0});
test2.addElement(spinBox);

var spinBox2 = new SpinBox({label: "label", decimals: 2, min: 0});
spinBox2.setValue(5);
test2.addElement(spinBox2);


spinBox.addEventListener('spinboxChange', function(evt) {
    console.log("spinBox changed by", evt.detail.delta +
            ". current value now", evt.detail.value);
}, false);


var colorPicker = new ColorPicker();

colorPicker.addEventListener('colorPickerChange', function(evt) {
    console.log("colorpicker change", evt.detail.value);
}, false);
colorPicker.setColor(0xFF0000);

test2.addElement(colorPicker);

