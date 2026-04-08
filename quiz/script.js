const questions = document.querySelectorAll(".question");
const options = document.querySelectorAll(".option");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const restartBtn = document.getElementById("restartBtn");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const routineTitle = document.getElementById("routineTitle");
const routineDescription = document.getElementById("routineDescription");
const routineSteps = document.getElementById("routineSteps");

let currentQuestion = 0;
const totalQuestions = 5;

const answers = {
  q1: null,
  q2: null,
  q3: null,
  q4: null,
  q5: null
};

// Product recommendations
const productCatalog = {
  cleanser: {
    dry: "CeraVe Hydrating Facial Cleanser",
    oily: "La Roche-Posay Toleriane Purifying Foaming Cleanser",
    combination: "La Roche-Posay Toleriane Purifying Foaming Cleanser",
    sensitive: "CeraVe Hydrating Facial Cleanser"
  },
  moisturizer: {
    dry: "CeraVe Moisturizing Cream",
    oily: "La Roche-Posay Toleriane Double Repair Matte Moisturizer",
    combination: "La Roche-Posay Toleriane Double Repair Face Moisturizer",
    sensitive: "La Roche-Posay Toleriane Double Repair Face Moisturizer"
  },
  spf: "EltaMD UV Clear Broad-Spectrum SPF 46",
  vitaminC: "CeraVe Skin Renewing Vitamin C Serum",
  eyeCream: "CeraVe Eye Repair Cream"
};

// Select answer
options.forEach((option) => {
  option.addEventListener("click", () => {
    const questionKey = option.dataset.question;
    const selectedValue = option.dataset.value;

    document
      .querySelectorAll(`.option[data-question="${questionKey}"]`)
      .forEach((btn) => btn.classList.remove("selected"));

    option.classList.add("selected");
    answers[questionKey] = selectedValue;
  });
});

function showQuestion(index) {
  questions.forEach((question) => question.classList.remove("active"));
  questions[index].classList.add("active");

  if (questions[index].id === "result") {
    nextBtn.style.display = "none";
    prevBtn.style.display = "none";
    progressFill.style.width = "100%";
    progressText.textContent = "Quiz Complete";
  } else {
    nextBtn.style.display = "inline-block";
    prevBtn.style.display = "inline-block";

    const progressPercent = ((index + 1) / totalQuestions) * 100;
    progressFill.style.width = `${progressPercent}%`;
    progressText.textContent = `Question ${index + 1} of ${totalQuestions}`;
  }

  prevBtn.style.visibility = index === 0 ? "hidden" : "visible";
}

function calculateResult() {
  const skinType = answers.q1;
  const concern = answers.q2;
  const time = answers.q3;
  const ingredientStyle = answers.q4;
  const missing = answers.q5;

  let title = "Your Personalized Routine";
  let description = "Here is a skincare routine based on your answers.";
  let routine = [];

  // Base products by skin type
  let cleanser = productCatalog.cleanser[skinType];
  let moisturizer = productCatalog.moisturizer[skinType];
  let serum = null;
  let addOn = null;
  let sunscreen = productCatalog.spf;

  // Main concern logic
  if (concern === "acne") {
    title = "Clear Skin Routine";
    description =
      "You seem to want a routine that helps balance oil, support clearer-looking skin, and still keep your skin comfortable.";
    serum = "Niacinamide or blemish-support serum";
  } else if (concern === "redness") {
    title = "Calm & Soothe Routine";
    description =
      "Your results suggest a gentler routine focused on calming your skin barrier and avoiding overload.";
    serum = "Soothing barrier-support serum";
  } else if (concern === "darkspots") {
    title = "Brightening Routine";
    description =
      "Your routine is focused on helping with dullness and uneven tone while keeping your skin hydrated and supported.";
    serum = productCatalog.vitaminC;
  } else if (concern === "dryness") {
    title = "Hydration Boost Routine";
    description =
      "Your results point toward a moisture-focused routine that helps your skin feel softer, smoother, and less dull.";
    serum = "Hydrating serum";
  }

  // Ingredient preference logic
  if (ingredientStyle === "natural") {
    description +=
      " You also prefer a more natural-feeling skincare style, so your routine leans simple and gentle.";
  } else if (ingredientStyle === "sciencebacked") {
    description +=
      " You also prefer science-backed ingredients, so your routine includes products known for barrier support, hydration, and brightening.";
  } else if (ingredientStyle === "mix") {
    description +=
      " You like a balance of gentle and effective ingredients, so this routine mixes comfort with results.";
  } else if (ingredientStyle === "anything") {
    description +=
      " Since you are open to whatever works, your routine is based mostly on function and skin needs.";
  }

  // Missing-step logic
  if (missing === "spf") {
    addOn = productCatalog.spf;
  } else if (missing === "vitaminc") {
    addOn = productCatalog.vitaminC;
  } else if (missing === "moisturizer") {
    addOn = moisturizer;
  } else if (missing === "eyecream") {
    addOn = productCatalog.eyeCream;
  }

  // Time logic
  if (time === "twomin") {
    routine = [
      `Cleanser: ${cleanser}`,
      `Moisturizer: ${moisturizer}`,
      `SPF: ${sunscreen}`
    ];
  } else if (time === "fivetenmin") {
    routine = [
      `Cleanser: ${cleanser}`,
      serum ? `Treatment: ${serum}` : `Treatment: ${productCatalog.vitaminC}`,
      `Moisturizer: ${moisturizer}`,
      `SPF: ${sunscreen}`
    ];
  } else if (time === "fifteentwentymin") {
    routine = [
      `AM Cleanser: ${cleanser}`,
      serum ? `AM Serum: ${serum}` : `AM Serum: ${productCatalog.vitaminC}`,
      `Moisturizer: ${moisturizer}`,
      `SPF: ${sunscreen}`,
      addOn ? `Extra Step: ${addOn}` : `Extra Step: ${productCatalog.eyeCream}`
    ];
  } else if (time === "fullroutine") {
    routine = [
      `Cleanser: ${cleanser}`,
      serum ? `Treatment Serum: ${serum}` : `Treatment Serum: ${productCatalog.vitaminC}`,
      `Moisturizer: ${moisturizer}`,
      `Daily SPF: ${sunscreen}`,
      `Extra Product: ${addOn ? addOn : productCatalog.eyeCream}`
    ];
  }

  // Make sure missing product is included if it is not already
  if (addOn && !routine.some((step) => step.includes(addOn))) {
    routine.push(`Bonus Pick: ${addOn}`);
  }

  // Show result
  routineTitle.textContent = title;
  routineDescription.textContent = description;

  routineSteps.innerHTML = "";
  routine.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    routineSteps.appendChild(li);
  });
}

nextBtn.addEventListener("click", () => {
  const currentId = `q${currentQuestion + 1}`;

  if (!answers[currentId]) {
    alert("Please select an answer before continuing.");
    return;
  }

  currentQuestion++;

  if (currentQuestion < totalQuestions) {
    showQuestion(currentQuestion);
  } else {
    calculateResult();
    showQuestion(totalQuestions); // result screen
  }
});

prevBtn.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion(currentQuestion);
  }
});

restartBtn.addEventListener("click", () => {
  currentQuestion = 0;

  for (let key in answers) {
    answers[key] = null;
  }

  options.forEach((option) => option.classList.remove("selected"));

  showQuestion(currentQuestion);
});

showQuestion(currentQuestion);