const display = document.getElementById("display");
const expression = document.getElementById("expression");

let currentNumber = "0";
let firstNumber = null;
let operator = null;
let resultShown = false;
let error = false;

function updateDisplay() {
    display.textContent = currentNumber;
    display.classList.toggle("error", error);

    if (operator && !error) {
        expression.textContent = firstNumber + " " + operator;
    }
    else if (!resultShown) {
        expression.textContent = "";
    }
}

function resetCalculator() {
    currentNumber = "0";
    firstNumber = null;
    operator = null;
    resultShown = false;
    error = false;
    expression.textContent = "";
}

function addNumber(value) {

    if (error) {
        resetCalculator();
    }

    if (resultShown) {
        currentNumber = "0";
        firstNumber = null;
        operator = null;
        resultShown = false;
        expression.textContent = "";
    }

    if (value === ".") {
        if (currentNumber.includes(".")) return;

        currentNumber += ".";
        updateDisplay();
        return;
    }

    if (currentNumber === "0") {
        currentNumber = value;
    }
    else {
        currentNumber += value;
    }

    updateDisplay();
}

function removeLast() {

    if (error) {
        resetCalculator();
        updateDisplay();
        return;
    }

    if (resultShown) return;

    if (currentNumber.length === 1) {
        currentNumber = "0";
    }
    else {
        currentNumber = currentNumber.slice(0, -1);
    }

    updateDisplay();
}

function clearCalculator() {
    resetCalculator();
    updateDisplay();
}

function calculate(num1, op, num2) {

    switch (op) {

        case "+":
            return num1 + num2;

        case "−":
            return num1 - num2;

        case "×":
            return num1 * num2;

        case "÷":

            if (num2 === 0) {
                return null;
            }

            return num1 / num2;

        default:
            return num2;
    }
}

function formatNumber(number) {

    let answer = String(Math.round(number * 10000000000) / 10000000000);

    if (answer.length > 14) {
        answer = number.toExponential(6);
    }

    return answer;
}

function selectOperator(op) {

    if (error) {
        resetCalculator();
    }

    if (operator && firstNumber !== null && !resultShown) {

        const answer = calculate(
            parseFloat(firstNumber),
            operator,
            parseFloat(currentNumber)
        );

        if (answer === null) {
            showError();
            return;
        }

        firstNumber = formatNumber(answer);
        currentNumber = firstNumber;
    }
    else {
        firstNumber = currentNumber;
    }

    operator = op;
    resultShown = false;
    currentNumber = "0";

    display.textContent = firstNumber;
    expression.textContent = firstNumber + " " + operator;
}

function showResult() {

    if (operator === null || firstNumber === null) return;

    const answer = calculate(
        parseFloat(firstNumber),
        operator,
        parseFloat(currentNumber)
    );

    const exp = firstNumber + " " + operator + " " + currentNumber + " =";

    if (answer === null) {
        showError();
        return;
    }

    currentNumber = formatNumber(answer);

    firstNumber = null;
    operator = null;
    resultShown = true;

    expression.textContent = exp;
    display.textContent = currentNumber;
    display.classList.remove("error");
}

function showError() {

    error = true;
    currentNumber = "Cannot ÷ by 0";

    firstNumber = null;
    operator = null;
    resultShown = false;

    expression.textContent = "";

    updateDisplay();
}

document.querySelectorAll("[data-num]").forEach(button => {

    button.addEventListener("click", () => {
        addNumber(button.dataset.num);
    });

});

document.querySelectorAll("[data-op]").forEach(button => {

    button.addEventListener("click", () => {
        selectOperator(button.dataset.op);
    });

});

document
    .querySelector('[data-action="equals"]')
    .addEventListener("click", showResult);

document
    .querySelector('[data-action="clear"]')
    .addEventListener("click", clearCalculator);

document
    .querySelector('[data-action="backspace"]')
    .addEventListener("click", removeLast);

window.addEventListener("keydown", function (e) {

    if (e.key >= "0" && e.key <= "9") {
        addNumber(e.key);
    }

    else if (e.key === ".") {
        addNumber(".");
    }

    else if (e.key === "+") {
        selectOperator("+");
    }

    else if (e.key === "-") {
        selectOperator("−");
    }

    else if (e.key === "*") {
        selectOperator("×");
    }

    else if (e.key === "/") {
        e.preventDefault();
        selectOperator("÷");
    }

    else if (e.key === "Enter" || e.key === "=") {
        showResult();
    }

    else if (e.key === "Backspace") {
        removeLast();
    }

    else if (e.key === "Escape") {
        clearCalculator();
    }

});

updateDisplay();