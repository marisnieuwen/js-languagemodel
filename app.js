// Taalmodel

// Functie neemt n (de grootte van n-grams) en tekst als invoer, geeft een lijst van n-grams gevonden in de tekst
function createNGrams(n, text) {
  // Tekst naar kleine letters, verwijder niet-alfabetische tekens en splits het in woorden
  const wordList = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(/\s+/);
  const ngramsList = [];

  // Gaat door wordList en maakt n-grams en voegt ze toe aan ngramsList
  for (let i = 0; i < wordList.length - n + 1; i++) {
    const ngram = wordList.slice(i, i + n).join(" ");
    ngramsList.push(ngram);
  }

  return ngramsList;
}

// Neemt een lijst van n-grams als invoer en geeft een object met het aantal van elk n-gram terug
function countNGrams(ngramsList) {
  const counts = {};

  // Gaat door de n-grams en telt hoe vaak ze voor komen
  for (const ngram of ngramsList) {
    counts[ngram] = (counts[ngram] || 0) + 1;
  }

  return counts;
}

// Functie neemt een n-gram en het 'counts'-object als invoer en geeft het meest waarschijnlijke volgende woord na het n-gram terug
function suggestNextWord(ngram, counts) {
  const candidates = Object.entries(counts).filter(([key]) =>
    key.startsWith(`${ngram} `)
  );

  if (candidates.length === 0) {
    return null;
  }

  let total = 0;
  for (const [, weight] of candidates) {
    // Bereken het totale weight
    total += weight;
  }

  // Kies een willekeurige waarde op basis van de weigths
  let random = Math.random() * total;
  for (const [value, weight] of candidates) {
    random -= weight;
    if (random < 0) {
      const words = value.split(" ");
      return words[words.length - 1];
    }
  }
}

// Neemt n-gram, het 'counts'-object en het gewenste aantal woorden als invoer en maakt een zin met behulp van de n-grams en hun tellingen
function constructSentence(ngram, counts, wordCount) {
  let output = ngram;
  const n = ngram.split(" ").length;

  // Genereer woorden tot het gewenste aantal woorden is bereikt
  for (let i = 0; i < wordCount - n; i++) {
    const ngramWords = extractWordsByNgram(output, n);
    const followingWord = suggestNextWord(ngramWords, counts);
    if (followingWord) {
      output += ` ${followingWord}`;
    } else {
      break;
    }
  }

  return output;
}

// Neemt een zin en n als input en geeft de laatste n woorden van de zin terug
function extractWordsByNgram(sentence, n) {
  const words = sentence.split(" ");
  const recentWords = words.slice(-n);
  const result = recentWords.join(" ");
  return result;
}

// Haal tekstbestand op en genereer een zin op basis van de input
fetch("2001_A_Space_Odyssey_-_Arthur_C_Clarke.txt")
  .then((response) => response.text())
  .then((text) => {
    let input = "in space";
    let n = input.split(" ").length + 1;
    let ngramsList = createNGrams(n, text);
    let counts = countNGrams(ngramsList);
    let outputSentence = constructSentence(input, counts, 26);

    // console.log(counts);
    console.log(outputSentence);
  })
  .catch((error) => {
    console.error(`Error fetching file: ${error.message}`);
  });

// Testfunctie om verschillende n-grams te demonstreren voor assesment
function testNGrams() {
  fetch("2001_A_Space_Odyssey_-_Arthur_C_Clarke.txt")
    .then((response) => response.text())
    .then((text) => {
      // Input en aantal woorden in output vaststellen
      const input = "space";
      const outputWords = 25;

      // 2-gram voorbeeld
      let n = 2;
      let ngramsList = createNGrams(n, text);
      let counts = countNGrams(ngramsList);
      let outputSentence = constructSentence(input, counts, outputWords);
      console.log(`2-gram: ${outputSentence}`);

      // 3-gram voorbeeld
      n = 3;
      ngramsList = createNGrams(n, text);
      counts = countNGrams(ngramsList);
      outputSentence = constructSentence(input, counts, outputWords);
      console.log(`3-gram: ${outputSentence}`);

      // 4-gram voorbeeld
      n = 4;
      ngramsList = createNGrams(n, text);
      counts = countNGrams(ngramsList);
      outputSentence = constructSentence(input, counts, outputWords);
      console.log(`4-gram: ${outputSentence}`);
    })
    .catch((error) => {
      console.error(`Error fetching file: ${error.message}`);
    });
}

// Roept de testfunctie aan
testNGrams();

// Extra om extra te doen

// Print bericht naar het chatvenster
function printMessage(message) {
  const chatWindow = document.getElementById("chat-window");
  const paragraph = document.createElement("p");
  paragraph.textContent = message;
  chatWindow.appendChild(paragraph);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Eventlistener reageert op input van user met een reactie van het taalmodel
document.getElementById("input-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const inputField = document.getElementById("input-field");
  const input = inputField.value.trim();

  if (input) {
    printMessage(`You: ${input}`);
    inputField.value = "";

    fetch("2001_A_Space_Odyssey_-_Arthur_C_Clarke.txt")
      .then((response) => response.text())
      .then((text) => {
        const n = input.split(" ").length + 1;
        const ngramsList = createNGrams(n, text);
        const counts = countNGrams(ngramsList);
        const outputSentence = constructSentence(input, counts, 26);
        printMessage(`Bot: ${outputSentence}`);
      })
      .catch((error) => {
        console.error(`Error fetching file: ${error.message}`);
      });
  }
});
