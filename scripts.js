let tests = []; // Ensure this variable is declared at the top scope

async function fetchTestData() {
  try {
    const response = await fetch('https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?export=download&id=1u05D1YCJw1zVuUfWuHk_oC7yS7nlZaX5');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return [];
  }
}

window.onload = function() {
  fetchTestData().then(fetchedTests => {
    tests = fetchedTests;
    populateDropdown();
    loadSelectedTest();
  }).catch(error => {
    console.error("Error fetching tests:", error);
  });
}


function populateDropdown() {
  const dropdown = document.getElementById('testDropdown');
  for (let i = 0; i < tests.length; i++) { // Use tests.length instead of hardcoding 100
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `Test ${i}`;
    dropdown.appendChild(option);
  }
}

function loadSelectedTest() {
  const selectedTestId = parseInt(document.getElementById('testDropdown').value); // Ensure it's an integer
  
  // Clear previous questions
  while (questionsContainer.firstChild) {
    questionsContainer.removeChild(questionsContainer.firstChild);
  }
  
  // Check if the selected test exists before rendering it
  if (tests[selectedTestId]) {
    renderQuestions(selectedTestId); // Pass the selected test ID
  }
}


const questionsContainer = document.getElementById("questionsContainer");

function renderQuestions(testID) {
  tests[testID].data.forEach((q, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");

    // Handling the picture property
    // Handling the picture property
    if (q.picture && q.picture.trim() !== "") {
      const img = document.createElement("img");
      img.src = q.picture;
      img.alt = `Image for question ${index + 1}`;
      img.style.maxWidth = "300px"; // Setting max-width to limit its size
      img.style.borderRadius = "5px";
      img.style.marginBottom = "10px";
      img.style.display = "block"; // To center the image
      img.style.marginLeft = "auto";
      img.style.marginRight = "auto";
      questionDiv.appendChild(img);
    }

    const questionTitle = document.createElement("h3");
    questionTitle.innerText = q.question;
    questionDiv.appendChild(questionTitle);

    q.answer.forEach((option, optionIndex) => {
      const optionDiv = document.createElement('div');
      optionDiv.classList.add('option');

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "question_" + index;
      input.value = optionIndex;

      if (optionIndex === q.correctAnswer) {
        optionDiv.setAttribute('data-correct', 'true');
      }

      const label = document.createElement("label");
      label.appendChild(input);
      label.innerHTML += option;

      optionDiv.appendChild(label);
      questionDiv.appendChild(optionDiv);
    });

    questionsContainer.appendChild(questionDiv);
  });
}

function showCorrectAnswers() {
  const correctOptions = document.querySelectorAll('div[data-correct="true"]');
  correctOptions.forEach(option => {
    option.style.backgroundColor = "green";
  });
}

function submitTest() {
  // Logic to check the answers and give results
  // This is a basic example
  let score = 0;
  tests[0].data.forEach((q, index) => {
    const selected = document.querySelector(
      `input[name="question_${index}"]:checked`
    );
    if (selected && Number(selected.value) === q.correctAnswer) {
      score++;
    }
  });
  alert(`Your score is ${score} out of ${tests[0].data.length}`);
}

renderQuestions();
