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
          type="number"
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
      <h2> {props.habit} </h2>
        <p style={{ marginLeft: '270px' }}> {props.frequency} days / week</p>
      <label htmlFor="check" className="checkboxes"> 
        <div>
          <div>Mon</div> 
          <input type="checkbox" id="monday" name="monday" value="Monday" /> 
        </div>
        <div>
          <div>Tue</div> 
          <input type="checkbox" id="tuesday" name="tuesday" value="Tuesday" /> 
        </div>
        <div>
          <div>Wed</div> 
          <input type="checkbox" id="wednesday" name="wednesday" value="Wednesday" /> 
        </div>
        <div>
          <div>Thu</div> 
          <input type="checkbox" id="thursday" name="thursday" value="Thursday" /> 
        </div>
        <div>
          <div>Fri</div> 
          <input type="checkbox" id="friday" name="friday" value="Friday" /> 
        </div>
        <div>
          <div>Sat</div> 
          <input type="checkbox" id="saturday" name="saturday" value="Saturday" /> 
        </div>
        <div>
          <div>Sun</div> 
          <input type="checkbox" id="sunday" name="sunday" value="Sunday" /> 
        </div>
      </label>
      <p> Progress: /{props.frequency}</p>
      <img className="edit-habit-btn" alt="edit-goal-btn" src="/static/img/edit.png" width="20" height="20"></img>
      <img className="delete-habit-btn" alt="delete-goal-btn" src="/static/img/delete.png" width="20" height="20"></img>
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