// import React from 'react';
// import ReactDOM from 'react-dom';
const { Component } = React;
const { render } = ReactDOM;
const styled = window.styled;
// const { GridContainer, NavContainer, MainContainer } = styled;

const GridContainer = styled.div`
  display: grid;
  min-height: 100%;
  grid-template-areas:
    "nav"
    "main";
  grid-template-columns: 30% 70%;
  grid-template-rows: 1fr;
`;
const NavContainer = styled.div`
  grid-area: "nav";
`;
const MainContainer = styled.div`
  grid-area: "main";
`;

const MyHabits = () => {
  return (
    <React.Fragment>
      <GridContainer>
        <NavContainer>Nav</NavContainer>
        <MainContainer>Main</MainContainer>
      </GridContainer>
    </React.Fragment>
  );
}

ReactDOM.render(<MyHabits />, document.querySelector('.container'));