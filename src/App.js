import React from 'react';
import './App.css';
import axios from 'axios';
import FontAwesome from 'react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { Navbar, Jumbotron, Button } from 'react-bootstrap';




class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = { color: this.props.color };

  }

  render() {
    return(
    <ul>
      {
        this.props.data.slice(0,3).map(function(d) {
          return <li style={{color: 'white'}}> <a style={{color: 'white'}}  href={d.url}> {d.title} </a> </li>
        })
      }
    </ul>
    );
  }
}


class Box extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };
    this.getRandomColor();
    this.setPrice = this.setPrice.bind(this);
    this.getPrice = this.getPrice.bind(this);

  }

  componentDidMount() {
    this.getPrice();
    this.getRandomColor();
    this.interval = setInterval(this.getPrice, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }


  getPrice() {
    axios.get(this.props.api).then((resp) => {
        this.setPrice(resp.data);
      }
    );
  }

  getRandomColor() {
    const num = Math.floor(Math.random() * this.props.colors.length);
    this.setState({
      color: this.props.colors[num].color,
      textColor: this.props.colors[num].textColor
    });
  }


  setPrice(data) {
    var Hello = this.props.parse(data);

    if (typeof Hello == "string") {
        this.setState({
          text: Hello,
          list: false
        });
    }
    else if (Hello instanceof Array) {
      var array = Hello.map(function(d) {
         return {title: d.data.title , url: d.data.url};
       });
       this.setState({
         text: array,
         list: true
       });
    }
    else {
    }
  }



  render() {
    return(
      <div  class="col-4" style={{backgroundColor: this.state.color, border: '10px solid white'}}>
        <div style={{margin: '1em', color: this.state.textColor}}>
          <h2 style={{textAlign: 'center'}}> {this.props.title} </h2>
          <span className='fa-stack fa-lg' style={{display: 'table', margin:'0 auto'}}>
            <FontAwesome name='square-o' stack='2x'/>
            <FontAwesome name={this.props.iconName} stack='1x' />
          </span>


          {!this.state.list && <h1 class="display-4" style={{textAlign: 'center'}}>{(this.state.text)} </h1>}
          {this.state.list && <List data={this.state.text} /> }

        </div>
      </div>
    );
  }
}

const Bitcoin = (data) => {
    return data.bpi.USD.rate;
}

const Ethereum = (data) => {
  return data.DISPLAY.ETH.USD.PRICE;
};

const RedditPodcasting = (json) => {
  return json.data.children;
};

const Qotd = (data) => {
  return data.contents.quotes[0].quote
};


const Orange = {color: "#e67e22", textColor: 'white' };

const Black = {color: "#2c3e50", textColor: 'white' };

const Teal = {color: "#008080", textColor: 'white' };

const Indigo = {color: "#8e44ad", textColor: 'white'};

const Chocolate = {color: "#D2691E", textColor: 'white'};

const Pomegranite = {color: "#c0392b", textColor: 'white'};

const Blue = {color: "#3498db", textColor: 'white'};

const Emerald = {color: "#2ecc71", textColor: 'white'};


const Colors = [Orange, Black, Teal, Indigo, Chocolate, Pomegranite, Blue, Emerald];




class App extends React.Component {
  render() {
    return(
      <div class="container container-fluid">
      <div class="row" >
        <Box title="Bitcoin" iconName="bitcoin"
          api="https://api.coindesk.com/v1/bpi/currentprice.json"
          parse={Bitcoin}
          colors={Colors} />

        <Box title="r/Podcasting" iconName="reddit"
         api="https://www.reddit.com/r/podcasting.json"
         parse={RedditPodcasting}
         colors={Colors} />

        <Box title="Ethereum" iconName="rocket"
         api="https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD"
         parse={Ethereum}
         colors={Colors} />

      </div>
      <div class="row row-eq-height" >
        <Box title="QOTD" iconName="heart"
         api="http://quotes.rest/qod"
         parse={Qotd}
         colors={Colors} />


      </div>
    </div>
    );
  }
}

export default App;
