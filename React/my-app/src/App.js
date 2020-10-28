import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route,Switch } from 'react-router-dom'
import Header from './Components/Header';
import Register from './Components/pages/Register/Register';
import Login from './Components/pages/Login/Login';
import axios from 'axios';
import Store from './Components/pages/Store/Store'
import ProductRegister from "./Components/pages/Store/ProductRegister"
import ProductModify from "./Components/pages/Store/ProductModify";
import Profile from './Components/pages/Profile/Profile';
import Friends from './Components/pages/Profile/Friends';
import ProtectedRoute from './Components/general/ProtectedRoute'
import ProductPage from './Components/pages/Product/ProductPage'
import Cart from './Components/pages/Cart/Cart';
import History from "./Components/pages/History/History"
import Inbox from './Components/pages/Conversation/Inbox';
import Messages from './Components/pages/Conversation/Messages';


class App extends Component {

  state = {
    nodeCount: null
  };

  state={
    isAuth: false
  }

  componentDidMount(){
    /*this.setState({
      isAuth : auth.getAuth()
    })
    */
    var self=this;
    axios.get('/showSession').then(function(res){
        if(res.data.loggedIn == true) self.setState({isAuth:true})
        else self.setState({isAuth:false});
        //console.log("Hola el componente de sesionn en App.js es: "+res.data.loggedIn);
    })  
    
  }
  

  /*onChange = (e) => this.setState({[e.target.name]: 
    e.target.value});
  */


  render(){
    console.log("App.js, el estado es: "+this.state.isAuth);
    return (
      <Router>
        <div className="App">
          <Switch>
          <Route exact path="/history/:UserId" component={History}/>
          <Route exact path="/" component={Store}/>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/store" component={Store} />
          <Route path="/productRegister" component={ProductRegister} />
          <Route path="/profile" component={Profile} />
          <Route path="/MyCart" component={Cart} /> 
          <Route path="/productModify/:ProductId" component={ProductModify}/>
          <Route path="/productPage/:ProductId" component={ProductPage}/>
          <Route path="/messages/:ProductId" component={Messages}/>
          <Route path="/friends" component={Friends} />
          <Route path='/inbox' component={Inbox}/>
          </Switch>
        </div>
      </Router>
    );
  }
}
export default App;

