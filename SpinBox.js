/*
* Spinbox custom element.
* Adapted from Kate Morley's
*   "A spin box widget" http://code.iamkate.com/javascript/spin-box-widget/ CC0 1.0
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
* Depends spinbox.css
*/

/// first a helper class for the buttons:

var SpinBoxButton = (function() {

    var listener = null;
    var timer = 10;
    var timerAmount = 10;
    var switchToFastModeTimer = 0;
    var switchToFastModeAfter = 5;

    function stop() {
        cancelAnimationFrame(listener);
        timer = 10;
        timerAmount = 10;
        switchToFastModeTimer = 0;
    }

    function reactToButton(action) {
        timer += 1;
        listener = requestAnimationFrame(() => reactToButton(action));
        if (timer > timerAmount) {
            timer = 0;
            timerAmount -= 1;
            switchToFastModeTimer += 1;
            if (switchToFastModeTimer > switchToFastModeAfter) {
                timerAmount = 1;
            }
            action();
        }
    }

    class CoolButton extends HTMLElement {

        constructor(action) {
            super();
            if (!action) {
                console.error("CoolButton needs to be created with an action callback as first(only) parameter");
            }
            this.addEventListener("mousedown", () => {
                listener = requestAnimationFrame(() => reactToButton(action));
            });
            this.addEventListener("mouseleave", stop);
            this.addEventListener("mouseup", stop);
        }

    }

    customElements.define("cool-button", CoolButton);

    return CoolButton;

})();


class SpinBox extends HTMLElement {

    constructor(opts = {}) {
        super();
        this.className = opts.className || "spinBox";
        this.step = opts.step || parseFloat(this.getAttribute("step")) || 1;
        this.decimals = opts.decimals || parseFloat(this.getAttribute("decimals")) || 0;
        this.width = opts.width || parseFloat(this.getAttribute("width")) || 14;
        var labelText = opts.label || this.getAttribute("label") || "Spin Box";

        /// assign min if specified in opts or markup html
        /// default = -Infinity
        if (opts.min !== undefined) {
            this.min = opts.min;
        } else {
            let htmlMin = parseFloat(this.getAttribute("min"));
            if (!isNaN(htmlMin)) {
                this.min = htmlMin;
            } else {
                this.min = -Infinity;
            }
        }

        /// assign max if specified in opts or markup html
        /// default = Infinity
        if (opts.max !== undefined) {
            this.max = opts.max;
        } else {
            let htmlMax = parseFloat(this.getAttribute("max"));
            if (!isNaN(htmlMax)) {
                this.max = htmlMax;
            } else {
                this.max = Infinity;
            }
        }

        this.label = document.createElement("label");

        this.label.textContent = labelText;
        this.appendChild(this.label);

        this.input = document.createElement("input");
        this.appendChild(this.input);

        var upButton = new SpinBoxButton(this.start.bind(this, true));
        this.appendChild(upButton);
        var upArrow = document.createElement("i");
        upButton.appendChild(upArrow);

        var downButton = new SpinBoxButton(this.start.bind(this, false));
        this.appendChild(downButton);
        var downArrow = document.createElement("i");
        downButton.appendChild(downArrow);

        this.label.className = this.className + "Label";
        upButton.className = this.className + "Up";
        upArrow.className = this.className + "UpArrow";
        downButton.className = this.className + "Down";
        downArrow.className = this.className + "DownArrow";
        this.style.width = this.width + "em";
        this.label.style.width = 200 + "em";

        // add listeners
        this.input.addEventListener("wheel", this.handleMouseWheel.bind(this));
        this.input.addEventListener("keydown", this.handleKeyDown.bind(this));
        this.input.addEventListener("focus", this.input.select);

        this.changeEvent = new CustomEvent("spinBoxChange", {detail: {delta: 0, value: 0}});

        if (opts.value !== undefined) {
            this.setValue(opts.value);
        } else {
            let htmlValue = this.getAttribute("value");
            if (htmlValue) {
                this.setValue(htmlValue);
            } else {
                this.setValue(0);
            }
        }

        this.oldValue = this.input.value;
        this.focused = false;
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
        this.changeEvent.detail.delta = currentValue - this.oldValue;
        this.changeEvent.detail.value = currentValue;
        this.dispatchEvent(this.changeEvent);

        this.oldValue = currentValue;
    }
}

customElements.define("spin-box", SpinBox);

export {SpinBox};
