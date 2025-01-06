// Toggle theme
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("change", function () {
  document.body.classList.toggle("dark-mode", themeToggle.checked);
});

// Save to local storage
function saveToLocalStorage(numbers) {
  localStorage.setItem('generatedNumbers', numbers);
}

// Generate random numbers
document.getElementById("generate-btn").addEventListener("click", function () {
  const min = parseInt(document.getElementById("min").value, 10);
  const max = parseInt(document.getElementById("max").value, 10);
  const limit = parseInt(document.getElementById("limit").value, 10);
  const digitCount = parseInt(document.getElementById("digit-count").value, 10);
  const resultDiv = document.getElementById("result");
  const copyBtn = document.getElementById("copy-btn");
  const imagesDiv = document.getElementById("images");

  // Clear previous results and images
  imagesDiv.innerHTML = "";
  copyBtn.style.display = "none";

  // Validate input
  if (isNaN(min) || isNaN(max) || isNaN(limit) || limit <= 0 || isNaN(digitCount) || digitCount <= 0) {
    resultDiv.textContent = "Please enter valid numbers.";
    return;
  }
  if (min >= max) {
    resultDiv.textContent = "Minimum value must be less than maximum value.";
    return;
  }
  if (limit > max - min + 1) {
    resultDiv.textContent = `Cannot generate ${limit} unique numbers in the given range.`;
    return;
  }

  const numbers = new Set();
  while (numbers.size < limit) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    if (randomNum.toString().length === digitCount) {
      numbers.add(randomNum);
    }
  }

  const resultText = [...numbers].join(", ");
  resultDiv.textContent = `Unique Random Numbers: ${resultText}`;
  copyBtn.style.display = "block";

  // Store the result for copying
  copyBtn.dataset.numbers = resultText;

  // Save result to local storage
  saveToLocalStorage(resultText);

  // Display uploaded logo and image
  const logoFile = document.getElementById("logo-upload").files[0];
  const imageFile = document.getElementById("image-upload").files[0];

  if (logoFile) {
    const logoImg = document.createElement("img");
    logoImg.src = URL.createObjectURL(logoFile);
    imagesDiv.appendChild(logoImg);
  }

  if (imageFile) {
    const imageImg = document.createElement("img");
    imageImg.src = URL.createObjectURL(imageFile);
    imagesDiv.appendChild(imageImg);
  }
});

// Copy numbers to clipboard
document.getElementById("copy-btn").addEventListener("click", function () {
  const numbers = this.dataset.numbers;

  if (numbers) {
    navigator.clipboard.writeText(numbers).then(() => {
      alert("Numbers copied to clipboard!");
    }).catch(err => {
      console.error("Could not copy text: ", err);
    });
  }
});

// Save result as text file
document.getElementById("save-btn").addEventListener("click", function () {
  const numbers = document.getElementById("copy-btn").dataset.numbers;
  if (numbers) {
    const blob = new Blob([numbers], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "random_numbers.txt";
    link.click();
  } else {
    alert("Please generate numbers first.");
  }
});

// Share result (basic share functionality for mobile browsers)
document.getElementById("share-btn").addEventListener("click", function () {
  const numbers = document.getElementById("copy-btn").dataset.numbers;
  if (numbers) {
    if (navigator.share) {
      navigator.share({
        title: 'Random Numbers',
        text: `Here are your random numbers: ${numbers}`,
        url: window.location.href
      }).catch(console.error);
    } else {
      alert("Your browser doesn't support sharing.");
    }
  } else {
    alert("Please generate numbers first.");
  }
});

// Display the uploaded logo preview
document.getElementById("logo-upload").addEventListener("change", function () {
  const logoFile = this.files[0];
  const logoPreview = document.getElementById("logo-preview");
  if (logoFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      logoPreview.src = e.target.result;
      logoPreview.style.display = "block";
    };
    reader.readAsDataURL(logoFile);
  } else {
    logoPreview.style.display = "none";
  }
});

// Display the uploaded image preview
document.getElementById("image-upload").addEventListener("change", function () {
  const imageFile = this.files[0];
  const imagePreview = document.getElementById("image-preview");
  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(imageFile);
  } else {
    imagePreview.style.display = "none";
  }
});
