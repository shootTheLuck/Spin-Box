
import {SpinBox} from "./SpinBox.js";

var spinBox = new SpinBox({label: "scaleSpinner", decimals: 2, min: -1, value: -1});
document.body.appendChild(spinBox);


spinBox.addEventListener("change", function(evt) {
  console.log("spinBox changed by", evt.detail.delta);
  console.log("spinBox value now", evt.detail.value);
}, false);

