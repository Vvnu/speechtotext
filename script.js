// Get DOM elements
const transcriptionContainer = document.getElementById("transcription-container");
const startButton = document.getElementById("start-btn");
const speakBackButton = document.getElementById("speak-back-btn");

// Initialize Speech Recognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-GB";
recognition.continuous = true;

// Start recognition when button is clicked
startButton.onclick = () => {
    recognition.start();
    startButton.innerText = "Listening...";
    startButton.disabled = true; // Disable button while listening
};

// Handle speech recognition results
recognition.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
            const p = document.createElement("p");
            p.textContent = result[0].transcript; // Append text to the container
            transcriptionContainer.prepend(p);
        }
    }
};

// Restart recognition automatically if it stops
recognition.onend = () => {
    recognition.start();
};

// Handle errors gracefully
recognition.onerror = (event) => {
    const p = document.createElement("p");
    p.textContent = `Error: ${event.error}`;
    p.style.color = "red";
    transcriptionContainer.prepend(p);
};

// Enable button again if recognition stops
recognition.onspeechend = () => {
    startButton.innerText = "Start Listening";
    startButton.disabled = false;
};

// Speak back all transcriptions when the "Speak Back" button is clicked
speakBackButton.onclick = () => {
    const allTexts = Array.from(transcriptionContainer.querySelectorAll("p"))
        .map((p) => p.textContent)
        .reverse()
        .join(". "); // Combine all transcriptions into a single string

    const speech = new SpeechSynthesisUtterance(allTexts);
    speech.lang = "en-GB";
    speech.rate = 1; // Set the speaking rate
    speech.pitch = 1; // Set the speaking pitch

    window.speechSynthesis.speak(speech);
};
