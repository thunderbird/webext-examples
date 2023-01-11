const OPERATIONS = [
  {
    operator: "+",
    callback(a, b) { return a + b; },
  },
  {
    operator: "-",
    callback(a, b) { return a - b; },
    orderOperands: true,
  },
  {
    operator: "×",
    callback(a, b) { return a * b; },
  },
];

let operand1 = Math.floor(Math.random() * 10) + 1;
let operand2 = Math.floor(Math.random() * 10) + 1;
let operation = OPERATIONS[Math.floor(Math.random() * OPERATIONS.length)];
if (operation.orderOperands && operand2 > operand1) {
  [operand1, operand2] = [operand2, operand1];
}

let answers = new Set();
let rightAnswer = operation.callback(operand1, operand2);
answers.add(rightAnswer);
answers.add(operation.callback(operand1 - 1, operand2));
answers.add(operation.callback(operand1 + 1, operand2));
answers.add(operation.callback(operand1, operand2 - 1));
answers.add(operation.callback(operand1, operand2 + 1));
answers.delete(rightAnswer);
let wrongAnswers = shuffle([...answers.values()]);

let choices = wrongAnswers.slice(0, 2);
choices.push(rightAnswer);
choices = shuffle(choices);

document.getElementById("operand1").textContent = operand1;
document.getElementById("operand2").textContent = operand2;
document.getElementById("operation").textContent = operation.operator;
document.getElementById("rightAnswer").textContent = rightAnswer;

document.getElementById("choice1").value = choices[0];
document.getElementById("choice2").value = choices[1];
document.getElementById("choice3").value = choices[2];

addEventListener("click", async (event) => {
  if (event.target.id.startsWith("choice")) {
    checkAnswer(event.target);
  }
});

function shuffle(array) {
  let arrayWithRandoms = array.map(value => [value, Math.random()]);
  arrayWithRandoms.sort((a, b) => a[1] - b[1]);
  return arrayWithRandoms.map(value => value[0]);
}

async function checkAnswer(button) {
  let tabs = await browser.tabs.query({ active: true, currentWindow: true });
  let tabId = tabs[0].id;
  let didAnswerRight = button.value == rightAnswer;

  document.body.classList.add(didAnswerRight ? "right" : "wrong");
  browser.runtime.sendMessage({ tabId, didAnswerRight });

  setTimeout(() => {
    window.close();
  }, 1500);
}
