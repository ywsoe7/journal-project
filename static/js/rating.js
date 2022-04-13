'use strict';

function show_rating(evt) {
    const date = document.querySelector('.today').innerHTML;
    const months = [
        "January", 
        "February", 
        "March", 
        "April", 
        "May", 
        "June", 
        "July", 
        "August", 
        "September", 
        "October", 
        "November", 
        "December"
    ];

    const year = date.split(', ')[1];
    const month = date.split(', ')[0];
    const month_num = months.indexOf(month) + 1;
    
    const rating_by_color = ["#EC8F7F", "#ECC264 ", "#F5EB7B", "#74C9F0", "#7DF494"];

    fetch(`/profile/ratings/${year}/${month_num}`)
      .then(response => response.json())
      .then(rating_by_day => {
        for (const [day, rating] of Object.entries(rating_by_day)) {
            const rating_num = Number(rating) - 1
            document.querySelector('.day' + (day - 1)).style.background = rating_by_color[rating_num];
          }
      });

    document.querySelectorAll('.cld-nav').forEach(e => e.addEventListener('click', show_rating));
}

window.onload = show_rating()
