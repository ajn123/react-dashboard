import React from 'react';
import './App.css';
import axios from 'axios';
import FontAwesome from 'react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import XMLParser from 'react-xml-parser';


class RedditList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: props.text };
  }

  render() {
    return(
    <ul>
      { this.props.text.length > 0 &&
        this.props.text.slice(0,this.props.length).map(function(d,k) {
          return <li key={k} style={{color: 'white'}}> <a style={{color: 'white'}}  href={d.url}> {d.title} </a> </li>
        })
      }
    </ul>
    );
  }

}

RedditList.defaultProps = {
  length: 8
};

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
    this.interval = setInterval(this.getPrice, 9000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getPrice() {
    axios.get(this.props.api, {

    }).then((resp) => {
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
    if (this.props.type == "String") {
        this.setState({
          text: Hello
        });
    }
    else if (this.props.type == "Image") {
      if (this.state.text == '' || this.state.text == null || Hello == '' || Hello == null) {
        this.setState({
          text: "http://25.media.tumblr.com/tumblr_lvp5ib5YEv1qmqimlo1_1280.png"
        });
      }
      else {
        this.setState({
          text: Hello
        });
      }
    }
    else if (this.props.type == "Array") {
       this.setState({
         text: Hello
       });
    }
  }


  render() {
    return(
      <div  className={"col-4"} style={{backgroundColor: this.state.color, border: '10px solid white'}}>
        <div style={{margin: '1em', color: this.state.textColor}}>
          <h2 style={{textAlign: 'center'}}> {this.props.title} </h2>
          <span className='fa-stack fa-lg' style={{display: 'table', margin:'0 auto'}}>
            <FontAwesome name='square-o' stack='2x'/>
            <FontAwesome name={this.props.iconName} stack='1x' />
          </span>

          {this.props.type == "String" && <h1 className={"display-4"} style={{textAlign: 'center'}}> {(this.state.text)} </h1> }
          {this.props.type == "Array"  && <RedditList text={this.state.text} /> }
          {this.props.type == "Image"  && <img className={"img-fluid"} alt="image" src={this.state.text} /> }

        </div>
      </div>
    );
  }
}

Box.defaultProps = {
  type: "String"
};

const Bitcoin = (data) => {
    return data.bpi.USD.rate;
};

const Ethereum = (data) => {
  return data.DISPLAY.ETH.USD.PRICE;
};


const RedditPodcasting = (json) => {
  var array = json.data.children.map(function(d) {
     return {title: d.data.title , url: d.data.url};
   });
  return array;
};

const Qotd = (data) => {
  return data.contents.quotes[0].quote
};

const CatImage = (data) => {
  const imageLink = data.match(/http:\/\/25.*png/g)
  return imageLink;
};

const PsychologicalWarfarePodcast = (data) => {
  var parse = require('xml-parser');
  var obj = parse(data);
  var array = obj.root.children[0].children.splice(18).map((d) => {
    return {title: d.children[1].content ,url: d.children[3].content};
  });
  return array;
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
      <div className={"container container-fluid"}>
      <div className={"row"} >

      <Box title="r/Podcasting" iconName="reddit"
         api="https://www.reddit.com/r/Blogging.json"
         parse={RedditPodcasting}
         colors={Colors}
         type="Array" />

        <Box title="Bitcoin" iconName="bitcoin"
            api="https://api.coindesk.com/v1/bpi/currentprice.json"
            parse={Bitcoin}
            colors={Colors} />

        <Box title="Ethereum" iconName="rocket"
           api="https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD"
           parse={Ethereum}
           colors={Colors} />

      </div>
      <div className={"row row-eq-height"} >
        <Box title="QOTD" iconName="heart"
           api="http://quotes.rest/qod"
           parse={Qotd}
           colors={Colors} />

       <Box title="Cats" iconName="heart"
          api="http://thecatapi.com/api/images/get?format=html&type=png"
          parse={CatImage}
          colors={Colors}
          type="Image" />

      <Box title="Psychological Warfare" iconName="rss"
         api="http://feeds.soundcloud.com/users/soundcloud:users:316981916/sounds.rss"
         parse={PsychologicalWarfarePodcast}
         colors={Colors}
         type="Array"/>

     </div>



    </div>
    );
  }
}

export default App;
