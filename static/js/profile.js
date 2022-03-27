var eventClick = function(date) {
    location.href = '/journal?date=' + date;
}

let settings = {
    NavShow: true,
    NavVertical: false,
    DateTimeShow: true,
    DateTimeFormat: 'mmm, yyyy',
    EventClick: eventClick,
    EventTargetWholeDay: true,
    // DisabledDays: [0, 6]
}

let element = caleandar(document.getElementById("calendar"), [], settings);
