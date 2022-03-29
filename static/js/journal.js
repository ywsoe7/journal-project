'use strict';

function show_entry() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
      });

    fetch(`/journal/${params.date}`)
      .then(response => response.text())
      .then(entry => document.getElementById('journal-text').value = entry);
}

window.onload = show_entry()
