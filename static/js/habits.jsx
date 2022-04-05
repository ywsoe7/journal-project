 const AddHabit = (props) => {
  // const [completedDays, setCompletedDays] = React.useState([]);
  const [habit, setHabit] = React.useState('');
  const [frequency, setFrequency] = React.useState('');

  function addNewHabit() {
    fetch('/habits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ habit, frequency }),
    }).then((response) => {
      response.json().then(response => {
        console.log(response);
        setHabit('');
        setFrequency('');
        props.addHabit(response.id, habit, frequency);
      });
    });
  }

  return(
    <div className="addHabit">
      <a href="/profile">Profile</a>
      <h1>My Habits</h1>
      <h2>Add Habits</h2>
      <label htmlFor="habitInput">
        New Habit 
        <br />
        <input 
          value={habit}
          onChange={(event) => setHabit(event.target.value)}
          id="habitInput"
          placeholder="Enter a new habit"
        />
        <input
          value={frequency}
          onChange={(event) => setFrequency(event.target.value)}
          placeholder="# of times per week"
        />
      </label>
      <button type="button" onClick={addNewHabit}>Add</button>
    </div>
  )
};

function HabitItem(props) {
  return (
    <div className="card">
      <p> Name: {props.habit} </p>
      <p> Frequency: {props.frequency} </p>
      <hr />
    </div>
  );
}

const HabitsContainer = (props) => {
  const [habits, setHabits] = React.useState([]);

  function addHabit(id, habit, frequency) {
    const currentHabits = [...habits];
    const newHabit = { id, habit, frequency };

    setHabits([...currentHabits, newHabit]);
  }

  React.useEffect(() => {
    fetch('/habits.json')
      .then(response => response.json())
      .then(data => setHabits(data));
  }, []);

  const currentHabits = [];

  for (const habit of habits) {
    currentHabits.push(
      <HabitItem
        key={habit.id}
        habit={habit.habit}
        frequency={habit.frequency}
      />
    );
  }

  return (
    <div className="habitsContainer">
      <AddHabit addHabit={addHabit}/>

      <div className="displayHabits">
        <h1>Current Habits</h1>
        <ul className="grid">{currentHabits}</ul>
      </div>
    </div>
  );
}

ReactDOM.render(<HabitsContainer />, document.getElementById('container'));