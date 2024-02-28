const getQuoteData = async () => {
  let response = await fetch("https://api.quotable.io/random");
  let firstQuote = await response.json();
  if (response.ok) {
    let responseTwo = await fetch("https://api.quotable.io/random");
    let secondQuote = await responseTwo.json();
    if (response.ok) {
      //console.log(firstQuote.content, " - ", secondQuote.author);
      return [firstQuote.content, secondQuote.author];
    } else {
      console.log("API Error");
      return [];
    }
  } else {
    console.log("API Error");
    return [];
  }
};

function getRandomVoice() {
  let voices = speechSynthesis.getVoices();

  let enUSVoices = voices.filter(function (voice) {
    return voice.localService && voice.lang === "en-US";
  });

  let randomIndex = Math.floor(Math.random() * enUSVoices.length);
  return enUSVoices[randomIndex];
}

const sayMessage = async (message, generateNew) => {
  let fakeQuote;
  if (!message) {
    try {
      fakeQuote = await getQuoteData();
      //console.log("message = ", fakeQuote[0]);
      message = fakeQuote[0];
      console.log("generated message");
      // Now you can use the result variable to do further processing
    } catch (error) {
      console.error("An error occurred:", error);
    }
  } else {
    fakeQuote = message;
  }
  if (fakeQuote) {
    if (fakeQuote[1].length > 2) {
      console.log("author: ", fakeQuote[1]);
      let parentDiv = document.querySelector("#container");

      let imageDiv = document.createElement("div");
      let image = document.createElement("img");
      let timestamp = new Date().getTime(); // avoid browser caching
      image.src = `https://100k-faces.glitch.me/random-image?timestamp=${timestamp}`;
      imageDiv.appendChild(image);
      imageDiv.setAttribute("id", "portrait");
      imageDiv.classList.add(
        "pr-6",
        "opacity-0",
        "transition-all",
        "ease-in-out",
        "duration-700",
        "-translate-x-40",
        "w-60"
      );
      setTimeout(() => {
        imageDiv.classList.remove("opacity-0", "-translate-x-40");
        imageDiv.classList.add("opacity-100", "translate-x-0");
      }, 300);

      let textDiv = document.createElement("div");
      textDiv.setAttribute("id", "messages");

      let messageText = document.createElement("div");
      //messageText.id = "message";
      messageText.setAttribute("id", "message");
      messageText.textContent = fakeQuote[0];
      messageText.classList.add(
        "pb-4",
        "translate-x-40",
        "opacity-0",
        "transition-all",
        "ease-in-out",
        "duration-700",
        "w-60"
      );

      setTimeout(() => {
        messageText.classList.remove("opacity-0", "translate-x-40");
        messageText.classList.add("opacity-100", "translate-x-0");
      }, 300);

      let authorText = document.createElement("div");
      //authorText.id = "author";
      authorText.setAttribute("id", "author");
      authorText.textContent = `— ${fakeQuote[1]}`;
      authorText.classList.add(
        "opacity-0",
        "translate-x-40",
        "transition-all",
        "duration-700",
        "ease-in-out"
      );
      setTimeout(() => {
        authorText.classList.remove("opacity-0", "translate-x-40");
        authorText.classList.add("opacity-100", "translate-x-0");
      }, 300);

      parentDiv.appendChild(imageDiv);
      parentDiv.appendChild(textDiv);
      textDiv.appendChild(messageText);
      textDiv.appendChild(authorText);
    } else {
      //set fade out animations
      //set timeout
      console.log("cleanup");
      let textUI = document.getElementById("messages");
      let imageUI = document.getElementById("portrait");
      let messageUI = document.getElementById("message");
      let authorUI = document.getElementById("author");

      setTimeout(() => {
        messageUI.classList.remove("opacity-100", "translate-x-0");
        messageUI.classList.add("opacity-0", "-translate-y-56");
        authorUI.classList.remove("opacity-100", "translate-x-0");
        authorUI.classList.add("opacity-0", "translate-y-56");
        imageUI.classList.remove("opacity-100", "translate-x-0");
        imageUI.classList.add("opacity-0", "-translate-x-56");

        setTimeout(() => {
          textUI.remove();
          imageUI.remove();
        }, 800);
      }, 800);
    }
    msg = new SpeechSynthesisUtterance();
    msg.volume = 0.1;
    if (fakeQuote[1].length > 2) {
      messageVoice = getRandomVoice();
      messagePitch = Math.random(2);
    }
    msg.voice = messageVoice;
    msg.pitch = messagePitch;
    msg.text = message;
    msg.lang = "en-US";
    speechSynthesis.speak(msg);

    msg.onend = () => {
      console.log("ended");
      if (!generateNew) {
        setTimeout(() => {
          sayMessage(fakeQuote[1], true);
        }, 300);
      } else {
        setTimeout(() => {
          sayMessage(undefined, false);
        }, 900);
      }
    };
  } else {
    console.log("no quote");
  }
};

function begin() {
  if ("speechSynthesis" in window) {
    setTimeout(() => {
      sayMessage(undefined, 0, false);
      btn.remove();
    }, "1000");
  } else {
    alert("Sorry, your browser doesn't support text to speech!");
  }
}

let msg = new SpeechSynthesisUtterance();
//let voices = window.speechSynthesis.getVoices();
let messageVoice = getRandomVoice();
msg.voice = messageVoice;
messagePitch = Math.random(2);

let btn;

window.onload = function () {
  btn = document.getElementById("begin");
  btn.onclick = () => {
    begin();
    btn.classList.add(
      "transition-all",
      "ease-in-out",
      "opacity-0",
      "duration-700"
    );
  };
};
