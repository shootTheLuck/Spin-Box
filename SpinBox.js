/*
 * Spinbox custom element.
 * Adapted from Kate Morley
 * http://code.iamkate.com/javascript/spin-box-widget/ CC0 1.0
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

class SpinBoxButton extends HTMLElement {

    constructor(action) {
        super();
        if (!action) {
            console.error("SpinBoxButton needs to be created with an action callback as first(only) parameter");
        }

        this.action = action;
        this.animation = null;
        this.timer = 10;
        this.timerAmount = 10;
        this.switchToFastModeTimer = 0;
        this.switchToFastModeAfter = 5;

        this.addEventListener("mousedown", () => {
            // this.reactToButton();
            this.animation = requestAnimationFrame(() => this.reactToButton());
            this.addEventListener("mouseleave", this.stop);
            this.addEventListener("mouseup", this.stop);
        });
    }

    stop() {
        cancelAnimationFrame(this.animation);
        this.timer = 10;
        this.timerAmount = 10;
        this.switchToFastModeTimer = 0;
        this.removeEventListener("mouseleave", this.stop);
        this.removeEventListener("mouseup", this.stop);
    }

    reactToButton() {
        this.timer += 1;
        this.animation = requestAnimationFrame(() => this.reactToButton());
        if (this.timer > this.timerAmount) {
            this.timer = 0;
            this.timerAmount -= 1;
            this.switchToFastModeTimer += 1;
            if (this.switchToFastModeTimer > this.switchToFastModeAfter) {
                this.timerAmount = 1;
            }
            this.action();
        }
    }
}

customElements.define("spinbox-button", SpinBoxButton);


class SpinBox extends HTMLElement {

    constructor(opts = {}) {
        super();
        this.className = opts.className || "spinBox";
        this.step = opts.step || parseFloat(this.getAttribute("step")) || 1;
        this.decimals = opts.decimals || parseFloat(this.getAttribute("decimals")) || 0;
        this.width = opts.width || parseFloat(this.getAttribute("width")) || 14;
        this.labelText = opts.label || this.getAttribute("label") || "Spin Box";
        this.initialValue = (opts.value !== undefined) ? opts.value : this.getAttribute("value");

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

        // connectedCallback() {

        this.label = document.createElement("label");

        this.label.textContent = this.labelText;
        this.appendChild(this.label);

        this.input = document.createElement("input");
        this.appendChild(this.input);

        var upButton = new SpinBoxButton(this.startUp.bind(this));
        this.appendChild(upButton);
        var upArrow = document.createElement("i");
        upButton.appendChild(upArrow);

        var downButton = new SpinBoxButton(this.startDown.bind(this));
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

        this.changeEvent = new CustomEvent("spinBoxChange", {
            detail: {
                delta: 0,
                value: 0
            }
        });

        if (this.initialValue !== undefined) {
            this.setValue(this.initialValue);
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
        this.value = value;
    }

    handleInputChange(e) {
        var value = parseFloat(this.input.value);
        if (isNaN(value)) value = 0;
        this.displayValue(value);
    }

    handleMouseWheel(e) {
        if (document.activeElement == this.input) {
            let direction = (e.deltaY < 0) ? true : false;
            this.start(direction);
        }
    }

    handleKeyDown(e) {
        if (e.key == "ArrowUp") this.start(true);
        if (e.key == "ArrowDown") this.start(false);
        if (e.key == "Enter") this.handleInputChange(e, false);
    }

    startUp() {
        if (this.input.disabled) return;
        let value = parseFloat(this.input.value) || 0;
        // this.updateStep = this.step;
        value += this.step;
        this.displayValue(value);
    }

    startDown() {
        if (this.input.disabled) return;
        let value = parseFloat(this.input.value) || 0;
        // this.updateStep = -this.step;
        // let value = parseFloat(this.input.value) + this.updateStep;
        value -= this.step;
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