const AddHabit = (props) => {
  const [habit, setHabit] = React.useState('');
  const [frequency, setFrequency] = React.useState('');

  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function addNewHabit() {
    fetch('/habits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ habit, frequency })
    }).then((response) => {
      response.json().then(response => {
        console.log(response);
        setHabit('');
        setFrequency('');
        props.addHabit(response.id, habit, frequency);
      });
    });
  }

  return (
    <div>
      <ReactBootstrap.Button variant="primary" onClick={handleShow}>
      <img alt="add-habit-btn" src="/static/img/add.png" width="13" height="13"></img> 
      Add New Habit
      </ReactBootstrap.Button>

      <ReactBootstrap.Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <ReactBootstrap.Modal.Header closeButton>
          <ReactBootstrap.Modal.Title>New Habit</ReactBootstrap.Modal.Title>
        </ReactBootstrap.Modal.Header>
        <ReactBootstrap.Modal.Body>
        <ReactBootstrap.Form>
            <ReactBootstrap.Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <ReactBootstrap.Form.Label>Habit Name</ReactBootstrap.Form.Label>
              <ReactBootstrap.Form.Control
                value={habit}
                onChange={(event) => setHabit(event.target.value)}
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
                value={frequency}
                onChange={(event) => setFrequency(event.target.value)}
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
            addNewHabit();
            handleClose();}}>
            Add
          </ReactBootstrap.Button>
        </ReactBootstrap.Modal.Footer>
      </ReactBootstrap.Modal>
    </div>
  );
}

function HabitItem(props) {
  function deleteHabit() {
    fetch(`/habits/${props.id}`, {
      method: 'DELETE'
    }).then((response) => {
      response.json().then(response => {
        console.log(props.index);
        props.deleteHabit(props.index);
      });
    });
  }

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
      <a href="#" onClick={deleteHabit}>
        <img
          className="edit-habit-btn"
          alt="edit-goal-btn"
          src="/static/img/edit.png"
          width="20"
          height="20" 
        />
      </a>
      <a href= "#" onClick={deleteHabit}>
        <img
          className="delete-habit-btn"
          alt="delete-goal-btn"
          src="/static/img/delete.png"
          width="20"
          height="20"
        />
      </a>
    </div>
  );
}

const HabitsContainer = (props) => {
  const [habits, setHabits] = React.useState([]);

  function deleteHabit(index) {
    habits.splice(index, 1);
    setHabits([...habits]);
  }

  function addHabit(id, habit, frequency) {
    const newHabit = { id, habit, frequency };
    setHabits([...habits, newHabit]);
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
        index={index}
        id={habit.id}
        key={habit.id}
        habit={habit.habit}  // TODO: change habit to text
        frequency={habit.frequency}
      />
    );
  }

  return (
    <div className="habitsContainer">
      <div className="displayHabits">
        <div>
          <h1>Current Habits</h1>
          <AddHabit addHabit={addHabit}/>

        </div>
        <ul className="grid">{currentHabits}</ul>
      </div>
    </div>
  );
}

ReactDOM.render(<HabitsContainer />, document.getElementById('container'));