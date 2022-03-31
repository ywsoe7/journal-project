// import React from 'react';
// import ReactDOM from 'react-dom';
// const { Component } = React;
// const { render } = ReactDOM;
// const styled = window.styled;
// const { GridContainer, NavContainer, MainContainer } = styled;

const GridContainer = (props) => {
  return (
    <div className='grid'>
      {props.children}
    </div>
  );
};

const MainContainer = (props) => {
  return (
    <div className='main'>
      {props.children}
    </div>
  );
};

const NavContainer = (props) => {
  return (
    <div className='nav'>
      {props.children}
    </div>
  );
};

const Title = (props) => {
  return (
    <div className='title'>
        {props.children}
    </div>
  );
};

const HeaderContainer = (props) => {
  return (
    <div className='header-container'>
        {props.children}
    </div>
  );
};

const HeaderItem = (props) => {
  return (
    <div className='header-item'>
        {props.children}
    </div>
  );
};

const GoalsContainer = (props) => {
  const AllGoals = [
    {id : 0, name: "lose weight"},
    {id : 1, name: "goal 1"},
    {id : 2, name: "goal 2"},
    {id : 3, name: "goal 3"},
  ];
  return (
    <div className='goals'>
      {AllGoals.map((goal,index) => (
        <GoalRow key={`goal-number-` + index}>
          <Name>{goal.name}</Name>
          <Action>
            <img alt="edit-goal-btn" src="/static/img/edit.png" width="20" height="20"></img>
            <img alt="delete-goal-btn" src="/static/img/delete.png" width="20" height="20"></img>
          </Action>
        </GoalRow>
      ))}
        {props.children}
    </div>
  );
};

const AddGoalButton = (props) => {
  return (
    <div className='add-goal-btn'>
      <img alt="add-goal-btn" src="/static/img/add.png" width="20" height="20"></img>
      {props.children}
    </div>
  );
};

const GoalRow = (props) => {
  return (
    <div className='goal-row'>
        {props.children}
    </div>
  );
};

const Name = (props) => {
  return (
    <div className='goal-name'>
        {props.children}
    </div>
  );
};

const Action = (props) => {
  return (
    <div className='goal-action'>
        {props.children}
    </div>
  );
};
const MyHabits = () => {
  return (
      <GridContainer>
        <NavContainer>
          <Title>Goals</Title>
          <GoalsContainer>
            <AddGoalButton></AddGoalButton>
          </GoalsContainer>
        </NavContainer>
        <MainContainer>
          <HeaderContainer>
            <HeaderItem>My Habits</HeaderItem>
            <HeaderItem>History</HeaderItem>
            <HeaderItem><a href="/profile">Profile</a></HeaderItem>
          </HeaderContainer>
        </MainContainer>
      </GridContainer>
  );
};

ReactDOM.render(<MyHabits />, document.querySelector('.container'));
