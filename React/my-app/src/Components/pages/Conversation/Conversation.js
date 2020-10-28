import React, { Component } from 'react'
import axios from 'axios'
//import "./ProductRegister.css"
import { Route, Redirect } from 'react-router';
import Select from 'react-select';
import Menu from '../Profile/Menu';
import Header from '../../Header';
import { Link } from 'react-router-dom';


class Conversation extends Component {

    render(){
        const {_id, idPerson1, idPerson2, messages} = this.props.messagesData;
        const userId=this.props.userId;
        console.log("userId: "+userId);
        console.log("person1"+idPerson1);
        console.log("person2"+idPerson2);
        var person1,person2;
        if (userId==idPerson1){
            person1=idPerson2;
            person2=idPerson1;
        } else {
            person1=idPerson1;
            person2=idPerson2;
        }
        console.log("Mostrando personas" +person1,person2);
        return(
          <article className="mw5 center bg-white br3 pa3 pa4-ns mv3 ba b--black-10" id={_id}>
          <div className="tc">
            <div>
              <h1 className="f3 mb2">{(userId==idPerson1)? idPerson2:idPerson1}</h1>
              <div className="btn-container">
                <Link className="link-product" to={{pathname:`/messages/${_id}`, state:{ messages: this.props.messagesData.messages, person1:person1, person2:person2}}}>
                  <input type="button" className="btn" id={"addBtn"+this.props.value} />
                  <label for={"addBtn"+this.props.value} className="addBtn">View messages</label>
                </Link>
              </div>
              <span>Total messages:  {this.props.messagesData.messages.length}</span>
            </div>
            </div> 
    
    
    
        </article>
        
        )
    
      }
}
 
export default Conversation;
