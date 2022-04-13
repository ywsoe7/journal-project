'use strict';

function show_entry() {
  const date = window.location.href.split("=")[1]
    
    fetch(`/journal/${date}`)
      .then(response => response.text())
      .then(entry => document.getElementById('journal-text').value = entry);
}

window.onload = show_entry()
