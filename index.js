
let index = 0;
let row = 0;
let word = "";
let wordOfTheDay = "";
let finish = false;
let letters = document.querySelectorAll("li");
let loader = document.querySelector("img");
let result = document.querySelector(".result");
let loser = document.querySelector(".loser");

function reset() {
    index = 0;
    row = 0;
    word = "";
    finish = false;
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

async function getWordOfTheDay() {
    let response = await fetch("https://words.dev-apis.com/word-of-the-day")
    let jsonResponse = await response.json()
    return jsonResponse["word"];
}

async function validateWord(word) {
    let response = await fetch('https://words.dev-apis.com/validate-word', {
        method: 'POST',
        body: JSON.stringify(word)
    })
    let jsonResponse = await response.json()
    return jsonResponse["validWord"];
}

function displayLoading() {
    loader.style.filter = "invert(100%)";
}

function hideLoading() {
    loader.style.filter = "invert(0%)";
}

async function listener(event) {

    if (event.key === "Backspace" && word.length > 0) {
        letters[--index].innerHTML = " ";
        word = word.slice(0, -1);
        return ;
    }

    if (isLetter(event.key) && index <= letters.length) {
        if (index < row + 5) {
            letters[index++].innerHTML = event.key.toUpperCase();
            word += event.key;
        } else {
            letters[index - 1].innerHTML = event.key.toUpperCase();
            word = word.slice(0, -1) + event.key;
        }
    }

    if (event.key === "Enter" && word.length === 5) {

        displayLoading();
        let validWord = await validateWord({word: word});
        hideLoading();

        if (!validWord) {
            for (let i = index - 5; i < index; i++) {
                letters[i].style.backgroundColor = "red";
                setTimeout(() => {
                    letters[i].style.backgroundColor = "black";
                }, 100);
            }
            return;
        }

        /*
            todo:
                - check if the word is the same as the word of the day
                - if it is, then display a message saying "You win!"
                - if it isn't, then:
                    - check if the word contains a letter from the word of the day
                    - if it does, then check if the letter is in the correct position
                        - if it is, then change the background color of the letter to green
                        - if it isn't, then change the background color of the letter to yellow
                    - if it doesn't, then change the background color of the letter to gray
        */

        if (word === wordOfTheDay) {
            for (let i = index - 5; i < index; i++) {
                letters[i].style.backgroundColor = "green";
            }
            result.innerHTML = "You win!";
            result.style.color = "green";
            result.classList.remove("hidden");
            removeEventListener("keydown", listener);
            return;
        }

        let wordArray = word.split("");
        let wordOfTheDayArray = wordOfTheDay.split("");
        for (let i = 0; i < wordArray.length; i++) {
            if (wordArray[i] === wordOfTheDayArray[i]) {
                letters[index - 5 + i].style.backgroundColor = "green";
            } else if (wordOfTheDayArray.includes(wordArray[i])) {
                letters[index - 5 + i].style.backgroundColor = "gold";
            } else {
                letters[index - 5 + i].style.backgroundColor = "gray";
            }
        }

        if (index < letters.length) {
            row += 5;
            word = "";
        } else {
            result.classList.remove("hidden");
            result.style.color = "red";
            result.innerHTML = "You lose!";
            removeEventListener("keydown", listener);
        }
    }
}

async function main() {

    // document.querySelectorAll("li").forEach((letter) => {
    //     letter.addEventListener( "mouseover", (event) => {
    //         if (event.target.style.backgroundColor === "red") {
    //             event.target.style.backgroundColor = "black";
    //         } else {
    //             event.target.style.backgroundColor = "red";
    //         }
    //     });
    // });

    wordOfTheDay = await getWordOfTheDay();

    result.addEventListener("click", () => {
        reset();
        letters.forEach((letter) => {
            letter.innerHTML = " ";
            letter.style.backgroundColor = "black";
        });
        result.classList.add("hidden");
        result.innerHTML = "";
        // addEventListener("keydown", listener);
    });

    loser.addEventListener("click", () => {
        reset();
        letters.forEach((letter) => {
            letter.innerHTML = " ";
            letter.style.backgroundColor = "black";
        });
        result.classList.remove("hidden");
        result.innerHTML = "Word of the day: " + wordOfTheDay;
        setTimeout(() => {
            result.classList.add("hidden");
            result.innerHTML = "";
        }, 2000);
        // addEventListener("keydown", listener);
    });

    addEventListener("keydown", listener);
}

main().catch(err => {console.log(err)});
