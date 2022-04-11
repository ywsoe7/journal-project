function Modal(props) {
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <a href= "#" onClick={handleShow}>
        <img
          className="habit-btn"
          src={props.src}
          width="15"
          height="15"
        />
      </a>

      <ReactBootstrap.Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <ReactBootstrap.Modal.Header closeButton>
          <ReactBootstrap.Modal.Title>{props.confirmText}</ReactBootstrap.Modal.Title>
        </ReactBootstrap.Modal.Header>
        <ReactBootstrap.Modal.Body>
        <ReactBootstrap.Form>
            <ReactBootstrap.Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <ReactBootstrap.Form.Label>Habit Name</ReactBootstrap.Form.Label>
              <ReactBootstrap.Form.Control
                value={props.habit}
                onChange={(event) => props.setHabit(event.target.value)}
                id="habitInput"
                type="text"
                placeholder="Enter a new habit"
                autoFocus
              />
            </ReactBootstrap.Form.Group>
            <ReactBootstrap.Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <ReactBootstrap.Form.Label>Frequency</ReactBootstrap.Form.Label>
              <ReactBootstrap.Form.Control 
                value={props.frequency}
                onChange={(event) => props.setFrequency(event.target.value)}
                type="number"
                placeholder="# of times per week"
                autoFocus
              />
            </ReactBootstrap.Form.Group>
          </ReactBootstrap.Form>
        </ReactBootstrap.Modal.Body>
        <ReactBootstrap.Modal.Footer>
          <ReactBootstrap.Button variant="secondary" onClick={handleClose}>
            Close
          </ReactBootstrap.Button>
          <ReactBootstrap.Button variant="primary" onClick={() => {
            props.confirm();
            handleClose();
          }}>
            {props.confirmButton}
          </ReactBootstrap.Button>
        </ReactBootstrap.Modal.Footer>
      </ReactBootstrap.Modal>
    </div>
  );
}

function HabitItem(props) {
  const [habit, setHabit] = React.useState(props.habit);
  const [frequency, setFrequency] = React.useState(props.frequency);
  const [completions, setCompletions] = React.useState(props.completions);
  const [count, setCount] = React.useState(completions.length);

  function deleteHabit() {
    fetch(`/habits/${props.id}`, {
      method: 'DELETE'
    }).then((response) => {
      response.json().then(response => {
        props.deleteHabit(props.index);
      });
    });
  }

  function confirmUpdateHabit() {
    fetch(`/habits/${props.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ habit, frequency })
    }).then((response) => {
      response.json().then(response => {
        props.updateHabit(props.index, response.id, habit, frequency);
      });
    });
  }

  function toggleCompletion(event) {
    const value = event.target.value;
    const checked = event.target.checked;

    fetch(`/completeHabit/${props.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value, checked })
    }).then((response) => {
      response.json().then(response => {
        const currentCompletions = [...completions];

        if (checked) {
          currentCompletions.push(value)
        } else {
          currentCompletions.splice(completions.indexOf(value), 1);
        }

        setCompletions(currentCompletions);
        setCount(currentCompletions.length);
      });
    });
  }

  return (
    <div className="habit-divs">
      <h2> {props.habit} </h2>
        <p style={{ marginLeft: '270px' }}> {props.frequency} days / week</p>
      <label htmlFor="check" className="checkboxes"> 
        <div>
          <div>Mon</div>
          <input type="checkbox" value="Monday" onClick={toggleCompletion} checked={completions.includes("Monday")} />
        </div>
        <div>
          <div>Tue</div>
          <input type="checkbox" value="Tuesday" onClick={toggleCompletion} checked={completions.includes("Tuesday")} />
        </div>
        <div>
          <div>Wed</div>
          <input type="checkbox" value="Wednesday" onClick={toggleCompletion} checked={completions.includes("Wednesday")} />
        </div>
        <div>
          <div>Thu</div>
          <input type="checkbox" value="Thursday" onClick={toggleCompletion} checked={completions.includes("Thursday")} />
        </div>
        <div>
          <div>Fri</div>
          <input type="checkbox" value="Friday" onClick={toggleCompletion} checked={completions.includes("Friday")} />
        </div>
        <div>
          <div>Sat</div>
          <input type="checkbox" value="Saturday" onClick={toggleCompletion} checked={completions.includes("Saturday")} />
        </div>
        <div>
          <div>Sun</div>
          <input type="checkbox" value="Sunday" onClick={toggleCompletion} checked={completions.includes("Sunday")} />
        </div>
      </label>
      <p> Progress: {count} / {props.frequency}</p>

      <Modal 
        setHabit={setHabit}
        setFrequency={setFrequency}
        confirm={confirmUpdateHabit}
        confirmText="Let's Update Your Habit!"
        confirmButton="Update"
        habit={habit}
        frequency={frequency}
        src="/static/img/edit.png"
      />
      <Modal 
        setHabit={setHabit}
        setFrequency={setFrequency}
        confirm={deleteHabit}
        confirmText="Delete This Habit?"
        confirmButton="Delete"
        habit={habit}
        frequency={frequency}
        src="/static/img/delete.png"
      />
      <hr />
      {/* <a href= "#" onClick={deleteHabit}>
        <img
          className="delete-habit-btn"
          alt="delete-goal-btn"
          src="/static/img/delete.png"
          width="20"
          height="20"
        />
      </a> */}
    </div>
  );
}

const HabitsContainer = (props) => {
  const [habits, setHabits] = React.useState([]);
  const [habit, setHabit] = React.useState('');
  const [frequency, setFrequency] = React.useState('');

  function addHabit(id, habit, frequency) {
    const newHabit = { id, habit, frequency };

    setHabits([...habits, newHabit]);
  }

  function deleteHabit(index) {
    const currentHabits = [...habits];
    currentHabits.splice(index, 1);

    setHabits(currentHabits);
  }

  function updateHabit(index, id, habit, frequency) {
    const currentHabits = [...habits];

    const updatedHabit = { id, habit, frequency };
    currentHabits[index] = updatedHabit;
    
    setHabits(currentHabits);
  }

  function confirmAddUpdate() {
    fetch('/habits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ habit, frequency })
    }).then((response) => {
      response.json().then(response => {
        // setHabit('');
        // setFrequency('');
        addHabit(response.id, habit, frequency);
      });
    });
  }

  React.useEffect(() => {
    fetch('/habits.json')
      .then(response => response.json())
      .then(data => setHabits(data));
  }, []);

  const currentHabits = [];

  for (const [index, habit] of habits.entries()) {
    currentHabits.push(
      <HabitItem
        deleteHabit={deleteHabit}
        updateHabit={updateHabit}
        index={index}
        id={habit.id}
        key={habit.id}
        habit={habit.habit}  // TODO: change habit to text
        frequency={habit.frequency}
        completions={habit.completions}
      />
    );
  }

  return (
    <div className="habitsContainer">
      <div className="displayHabits">
        <div>
          <a href="/profile">Back to profile page</a>
          <br />
          <a href="/goals">Let's Check Out Your Goals</a>
          <h1>My Habits</h1>
          <Modal
            setHabit={setHabit}
            setFrequency={setFrequency}
            confirm={confirmAddUpdate}
            confirmText="Add A New Habit"
            confirmButton="Add"
            habit={habit}
            frequency={frequency}
            src="/static/img/add.png"
          />
        </div>
        <ul className="grid">{currentHabits}</ul>
      </div>
    </div>
  );
}

ReactDOM.render(<HabitsContainer />, document.getElementById('container'));