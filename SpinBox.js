/*
* Spinbox custom element.
* Adapted from Kate Morley "A spin box widget" http://code.iamkate.com/javascript/spin-box-widget/ CC0 1.0
*
* Set value with .setValue method
* Get value with .getValue method
* Listen for changes by adding event listener:
*
*  spinBox.addEventListener("spinboxChange", function(evt) {
*      console.log("spinBox changed by", evt.detail.delta);
*      console.log("spinBox value now", evt.detail.value);
*  }, false);
*
* Depends CoolButton.js, spinbox.css
*/

import CoolButton from "./CoolButton.js";

class SpinBox extends HTMLElement {

    constructor(opts = {}) {
        super();
        this.className = opts.className || "spinBox";
        this.step = opts.step || parseFloat(this.getAttribute("step")) || 1;
        this.decimals = opts.decimals || parseFloat(this.getAttribute("decimals")) || 0;

        var labelText = opts.label || this.getAttribute("label") || "Spin Box";

        /// assign min if specified in opts or the dom
        /// default = -Infinity
        if (opts.min !== undefined) {
            this.min = opts.min;
        } else {
            let domAttributeMin = parseFloat(this.getAttribute("min"));
            if (!isNaN(domAttributeMin)) {
                this.min = domAttributeMin;
            } else {
                this.min = -Infinity;
            }
        }

        /// assign max if specified in opts or the dom
        /// default = Infinity
        if (opts.max !== undefined) {
            this.max = opts.max;
        } else {
            let domAttributeMax = parseFloat(this.getAttribute("max"));
            if (!isNaN(domAttributeMax)) {
                this.max = domAttributeMax;
            } else {
                this.max = Infinity;
            }
        }

        this.label = document.createElement("label");

        this.label.textContent = labelText;
        this.appendChild(this.label);

        var div = document.createElement("div");
        this.appendChild(div);

        this.input = document.createElement("input");
        div.appendChild(this.input);

        var upButton = new CoolButton(this.start.bind(this, true));
        div.appendChild(upButton);
        var upArrow = document.createElement("i");
        upButton.appendChild(upArrow);

        var downButton = new CoolButton(this.start.bind(this, false));
        div.appendChild(downButton);
        var downArrow = document.createElement("i");
        downButton.appendChild(downArrow);

        // apply classes
        div.className = this.className + "Div";
        this.label.className = this.className + "Label";
        upButton.className = this.className + "Up";
        upArrow.className = this.className + "UpArrow";
        downButton.className = this.className + "Down";
        downArrow.className = this.className + "DownArrow";

        // add listeners
        this.input.addEventListener("wheel", this.handleMouseWheel.bind(this));
        this.input.addEventListener("keydown", this.handleKeyDown.bind(this));
        this.input.addEventListener("change", this.handleInputChange.bind(this));

        this.event = new CustomEvent("spinboxChange", {detail: {delta: 0, value: 0}});

        if (opts.value !== undefined) {
            this.setValue(opts.value);
        } else {
            let attValue = this.getAttribute("value");
            if (attValue) {
                this.setValue(attValue);
            } else {
                this.setValue(0);
            }
        }

        this.oldValue = this.input.value;
    }

    setEnabled(bool) {
        this.input.disabled = !bool;
    }

    getValue() {
        return parseFloat(this.input.value);
    }

    setValue(value) {
        value = Math.max(this.min, value);
        value = Math.min(this.max, value);
        this.input.value = value.toFixed(this.decimals);
    }

    handleInputChange(e) {
        var value = parseFloat(this.input.value);
        if (isNaN(value)) value = 0;
        this.displayValue(value);
    }

    handleMouseWheel(e) {
        if (document.activeElement == this.input) {
            let direction = (e.deltaY < 0)? true : false;
            this.start(direction);
        }
    }

    handleKeyDown(e) {
        if (e.key == "ArrowUp") this.start(true);
        if (e.key == "ArrowDown") this.start(false);
        if (e.key == "Enter") this.handleInputChange(e, false);
    }

    start(up) {
        if (this.input.disabled) return;

        this.updateStep = (up ? this.step : -this.step);
        let value = parseFloat(this.input.value) + this.updateStep;
        this.displayValue(value);
    }

    displayValue(value) {
        this.oldValue = this.getValue();
        this.setValue(value);
        this.input.select();

        var currentValue = this.getValue();
        this.event.detail.delta = currentValue - this.oldValue;
        this.event.detail.value = currentValue;
        this.dispatchEvent(this.event);

        this.oldValue = currentValue;
    }
}

customElements.define("spin-box", SpinBox);

export default SpinBox;
