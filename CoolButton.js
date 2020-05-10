
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

export default CoolButton;
