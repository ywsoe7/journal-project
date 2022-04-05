const Habit = (props) => {
  // const [completedDays, setCompletedDays] = React.useState([]);

  function addNewHabit() {
    fetch('/habits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, skill }),
    }).then((response) => {
      response.json().then((jsonResponse) => {
        const { cardAdded } = jsonResponse; // same as cardAdded = jsonResponse.cardAdded
        const { cardId, name: cardName, skill: cardSkill } = cardAdded;
        props.addCard(cardId, cardName, cardSkill);
      });
    });
  }

  return(
    <div className="main">
      <h1>My Habits</h1>
      <h2>Add Habits</h2>
      <label htmlFor="habitInput" id="habtitInput">
        New Habit 
        <br />
        <input type="text" name="habit" placeholder="Enter a new habit"></input>
        <input type="text" name="frequency" placeholder="# of times per week" style={{ marginLeft: '10px' }}></input>
      </label>
      <button type="button" style={{ marginLeft: '10px' }} onclick={addNewHabit}>Add</button>
    </div>
  )
};


const HabitsContainer = (props) => {
  return(
    <div>
      <Habit text="Lose Weight" frequency="1" />
    </div>
  )
};

ReactDOM.render(<HabitsContainer />, document.getElementById('container'));