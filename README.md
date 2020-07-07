# State of the Map 2020 Trivia Quiz

This is a simple static single-player trivia quiz game, made for a nice look and easy question replacement.
Thanks to Vue.js authors which made making this game very quick, and to State of the Map 2020 organizers
that made me do a quiz and then asked for it to be re-playable.

## How to steal the code

You can reuse the code and the template to do your own quiz! The license permits anything, so go ahead.
This is what you need to do:

1. Clone the repo, or better download `index.html` and `quiz.js`.
2. If needed, translate text in `index.html` into your language.
3. Prepare the questions file (see below) and replace `sotm2020.js` in `index.html` with its name.
4. To add images, create `images` directory and put all jpeg and pngs there.
5. Upload all these files into a new github repo (or commit your changes to a fork).
6. Go to repo settings, enable github pages on the master branch, share the URL with your players.

## Questions file format

A questions file is a JavaScript file that has a single JSON object inside, in form `quiz = {...}`.
This object has two mandatory fields: "title" and "questions". Here is what fields mean:

* __title__: title for the quiz, will be displayed as headers on the first and last card.
* __picture__: title image for the quiz.
* __intro__: introductionary text for the quiz. Few markdown features supported: paragraphs, links, images, bold and italic text, inline code.
* __afterword__: markdown text to be printed after the quiz is complete.
* __ranks__: list of titles for a person who completed the quiz, depending on number of correct answers. Ordered from least to greatest. E.g. ["beginner", "student", "professor"].
* __questions__: list of questions, see below.

Each question is an object with three mandatory fields (text, answers, correct) and some optional fields:

* __text__: question, markdown supported.
* __picture__: optional image for the question.
* __answers__: list of answer, each a short string.
* __correct__: list of 1-based indices of correct answers. E.g. [1] means the first answer only is correct.
* __stats__: list of number of people who chose the relevant answer. E.g. [3, 1, 8] means that 3 players chose the first answer, 1 player chose the second one.
* __explanation__: markdown-supported explanation for the answers that appears after a player chooses an answer.

See the `sotm2020.js` file for an example.

## Importing quiz from MyQuiz

This script was primarily written to make a stand-alone single-player version of a [MyQuiz](myquiz.org) quiz.
To import yours, do this:

1. Open the "Archive" tab and find your quiz. If it isn't there, make you you've played through it at least once.
2. Click on the "Settings" button near the proper game and choose "Quiz Report → Export to csv".
3. Run the script `tools/myquiz_to_json.py QuizReport.csv questions.js` (adjust the file names as needed).
4. If you don't need answer statistics, edit the resulting js file and replace `"stats"` to e.g. `"stat"`.
4. Make sure the js file name in `index.html` is correct.

## Author and License

All of this was published by Ilya Zverev under MIT License.
