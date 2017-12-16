import React from 'react';
import './App.css';
import axios from 'axios';

class List extends React.Component {
  render() {
    return(
      <ol>
        {
        this.props.items.map(item => {
          return <li>{item}</li>
        })}
      </ol>
      );
  }
}


class CardList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      value: ''};
    this.nameSubmit = this.nameSubmit.bind(this);
    this.changeText = this.changeText.bind(this);
    this.axiosSubmit = this.axiosSubmit.bind(this);
  }

  axiosSubmit(resp) {
    this.setState(prevState => ({
      cards: prevState.cards.concat({avatar_url: resp.avatar_url,
      name: resp.name, age: resp.followers})
    }));
  }

  nameSubmit(event) {
    event.preventDefault();
    axios.get('https://api.github.com/users/' + this.state.value).then(resp => {
      this.axiosSubmit(resp.data);
    });
  }

  changeText(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <div>
      <form onSubmit={this.nameSubmit}>
          <input type="text"
           value={this.state.value}
           onChange={this.changeText}
           placeHolder="name" />
           <input type="submit" value="Submit" />
      </form>
      <div>
        {this.state.cards.map(card => <Card {...card} />) }
      </div>
      </div>
    );
  }

}


class Card extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return(
    <div style={{margin: '1em'}}>
      <img
       src={this.props.avatar_url}
       width="200px"
       alt="" />
      <div style={{display: 'inline-block', marginLeft: 10}}>

      <h1> Name: {this.props.name } </h1>
      <h3> Age: {this.props.age} </h3>
    </div>
    </div>
    );
  }
}

class Here extends React.Component {
  constructor(props) {
    super(props);
    this.state = {number: 0 };
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    this.setState((prevState) => ({
      number: prevState.number + 1
    }));
  }

  render() {
    return (
      <button onClick={this.clickHandler}>
        + {this.state.number}
      </button>
    );
  }
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      list: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.value == '') {
      alert("blank not allowed");
    }else {
      this.setState((prevState) => ({
        list: prevState.list.concat(this.state.value)
      }));
    }

    this.setState({value: ''});

  }

  render() {
    return (
      <div>
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value}
           onChange={this.handleChange}
           placeHolder="hello"
            />
        </label>
        <input type="submit" value="Submit" />
        <List items={this.state.list} />
        </form>
        <CardList />
      </div>

    );
  }
}

export default App;
