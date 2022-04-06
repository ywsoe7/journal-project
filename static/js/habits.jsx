// import Modal from 'react-bootstrap/Modal'

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

// function Example() {
//   const [show, setShow] = useState(false);

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   return (
//     <>
//       <Button variant="primary" onClick={handleShow}>
//         Launch static backdrop modal
//       </Button>

//       <Modal
//         show={show}
//         onHide={handleClose}
//         backdrop="static"
//         keyboard={false}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Modal title</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           I will not close if you click outside me. Don't even try to press
//           escape key.
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//           <Button variant="primary">Understood</Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// }

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
      <hr />
    </div>
  );
}

const HabitsContainer = (props) => {
  const [habits, setHabits] = React.useState([]);

  function deleteHabit(index) {
    const currentHabits = [...habits];
    currentHabits.splice(index, 1);

    setHabits(currentHabits);
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
      <AddHabit addHabit={addHabit}/>

      <div className="displayHabits">
        <div>
          <h1>Current Habits</h1>
          <div> 
            <img alt="add-habit-btn" src="/static/img/add.png" width="13" height="13"></img>
            Add Habit
          </div>
        </div>
        <ul className="grid">{currentHabits}</ul>
      </div>
    </div>
  );
}

ReactDOM.render(<HabitsContainer />, document.getElementById('container'));