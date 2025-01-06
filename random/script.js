// Toggle theme
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("change", function () {
  document.body.classList.toggle("dark-mode", themeToggle.checked);
});

// Save to local storage
function saveToLocalStorage(numbers) {
  localStorage.setItem('generatedNumbers', numbers);
}

// Common function to display alerts
function showAlert(message) {
  alert(message);
}

// Generate random numbers
document.getElementById("generate-btn").addEventListener("click", function () {
  const min = parseInt(document.getElementById("min").value, 10);
  const max = parseInt(document.getElementById("max").value, 10);
  const limit = parseInt(document.getElementById("limit").value, 10);
  const digitCount = parseInt(document.getElementById("digit-count").value, 10);
  const resultDiv = document.getElementById("result");
  const copyBtn = document.getElementById("copy-btn");

  if (isNaN(min) || isNaN(max) || isNaN(limit) || limit <= 0 || isNaN(digitCount) || digitCount <= 0) {
    return showAlert("Please enter valid numbers.");
  }
  if (min >= max) return showAlert("Minimum value must be less than maximum value.");
  if (limit > max - min + 1) return showAlert(`Cannot generate ${limit} unique numbers in the given range.`);

  const numbers = [];
  while (numbers.length < limit) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    if (randomNum.toString().length === digitCount && !numbers.includes(randomNum)) {
      numbers.push(randomNum);
    }
  }

  const resultText = numbers.join(", ");
  resultDiv.textContent = `Unique Random Numbers: ${resultText}`;
  copyBtn.style.display = "inline";
  copyBtn.dataset.numbers = resultText;
  saveToLocalStorage(resultText);

  // সাউন্ড প্লে
  const utterance = new SpeechSynthesisUtterance(`The generated numbers are ${resultText}`);
  utterance.lang = "en-US";
  utterance.pitch = 1;
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
});

// Copy numbers
document.getElementById("copy-btn").addEventListener("click", function () {
  const numbers = this.dataset.numbers;
  navigator.clipboard.writeText(numbers)
    .then(() => showAlert("Numbers copied to clipboard!"))
    .catch(err => console.error("Could not copy text: ", err));
});

// Save as file
document.getElementById("save-btn").addEventListener("click", function () {
  const numbers = document.getElementById("copy-btn").dataset.numbers;
  if (!numbers) return showAlert("Please generate numbers first.");

  const blob = new Blob([numbers], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "random_numbers.txt";
  link.click();
});

// Share numbers
document.getElementById("share-btn").addEventListener("click", function () {
  const numbers = document.getElementById("copy-btn").dataset.numbers;
  if (!numbers) return showAlert("Please generate numbers first.");

  if (navigator.share) {
    navigator.share({
      title: "Random Numbers",
      text: `Here are your random numbers: ${numbers}`,
    }).catch(console.error);
  } else {
    showAlert("Your browser doesn't support sharing.");
  }
});
