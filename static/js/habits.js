const addHabits = document.querySelector(".add-habit");
const habitsList = document.querySelector(".habits");
const habits = [];


function addHabit(evt) {
  evt.preventDefault();
  const text = this.querySelector("[name=habit]").value;
  const totalReps = +this.querySelector("[name=repetitions]").value;
  const timeframe = this.querySelector("[name=timeframe]").value;
  const habit = {
    text: text,
    reps: 0,
    totalReps: totalReps,
    timeframe: timeframe,
    completed: false,
  }

  habits.push(habit);
  listHabits(habits, habitsList);
  this.reset();
  console.log(habit);
}


function listHabits(habit=[], habitsList) { 
  // .map() runs arrow function on every element inside the array and return a new array 
  habitsList.innerHTML = habits.map((habit, i) => {
    return `
      <li>
        <input type="checkbox" data-index=${i} id="habit${i}" ${habit.completed ? "checked" :""} />
        <label for="habit${i}"><span>${habit.reps}/${habit.totalReps} ${habit.timeframe}</span> ${habit.text}</label>
        <button class="delete" data-index=${i} id="delete${i}">Delete</button>
      </li>
    `;
  }).join("");
}


function toggleCompleted(evt) {
  if (!evt.target.matches("input")) return;
  const el = evt.target;
  const index = el.dataset.index;
  habits[index].reps += 1;
  
  if (habits[index].reps === habits[index].totalCount) {
    habits[index].completed = true;
  } else if (habits[index].reps > habits[index].totalReps) {
    habits[index].reps = 0;
    habits[index].completed = false;
  }

  listHabits(habits, habitsList);
  localStorage.setItem("habits", JSON.stringify(habits))
}


function deleteHabit(evt) {
  if (!evt.target.matches("button")) return;
  const el = evt.target;
  const index = el.dataset.index;
  
  habits.splice(index, 1);

  listHabits(habits, habitsList);
  localStorage.setItem("habits", JSON.stringify(habits))
}


addHabits.addEventListener("submit", addHabit);
habitsList.addEventListener("click", toggleCompleted);
habitsList.addEventListener("click", deleteHabit);
