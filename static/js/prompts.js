'use strict';

function addPrompt(evt) {
  fetch(`/journal/prompts`)
    .then(response => response.text())
    .then(random_prompt => document.getElementById('journal-text').value += '\n\n' + random_prompt);
  }

document.querySelector('#get-prompt-button').addEventListener('click', addPrompt);
