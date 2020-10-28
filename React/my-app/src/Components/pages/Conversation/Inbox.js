import React, { Component } from 'react'
import axios from 'axios'
//import "./ProductRegister.css"
import { Route, Redirect } from 'react-router';
import Select from 'react-select';
import Menu from '../Profile/Menu';
import Header from '../../Header';
import Conversation from '../../pages/Conversation/Conversation';

class Inbox extends Component {
    state = {
        conversations:[],
        isAuth: true,
        idPerson:null,
    }

    componentDidMount(){
        var self=this;
        axios.get('/showSession').then(function(res){
            console.log("El usuaio de sesion es: "+res.data.userName);

            if(res.data.loggedIn) {
                console.log("Prueba 100"+res.data.userName);
                self.setState({isAuth:true,idPerson:res.data.userName});
                self.loadConversations();
            }
            else self.setState({isAuth:false});
        })
        
    }

    loadConversations() {
        console.log("el usuario a consultar es: "+this.state.idPerson);

        var self = this;
        axios.post('allConversations', { idPerson: this.state.idPerson}).then(function (res) {
            if(res.data.success) {
               console.log("Estoy aqio");
                self.setState({conversations:res.data.messagesData})
                console.log("arreglo"+res.data.messagesData);
            }
        });
    };

    putMessage = (e) => {
        e.preventDefault();
        if (this.state.message == null) {
            alert("Please insert a message")
        }
        else {
            let formData = new FormData();
            formData.append("idPerson1", this.state.idPerson1);
            formData.append("idPerson2", this.state.idPerson2);
            formData.append("message", this.state.message);
            formData.append("messageOwner", this.state.messageOwner);
            axios.post('putNewMessage', formData)
                .then(function (response) {
                    if (response.data.success == false) { 
                        //console.log('ERROR REGISTRANDO: '+response);
                        alert(response.data.error);
                    } else { //Everything went well :D
                        alert("Message sent successfully");
                    }
                }).catch(function (error) { //catches html request errors
                    console.log("CATCH"+error)
                    alert("CATCH"+error)
                });
        }
    };

    onChange = (e) => this.setState({
        [e.target.name]:  //Connects state attribute with the input in the html
            e.target.value
    });

    render() {
        if (this.state.isAuth) {
        return (
            <>
            <div>
            <Header/>
            <Menu/>
            <h1>
                {this.state.conversations.length == 0 ?"You have no conversations yet" : "Current conversations: "}
            </h1>
            </div>
            <main className="pa3 pa5-ns flex flex-wrap">
            {
              this.state.conversations.map((p, index) => (<Conversation key={p._id} value={index} messagesData={p} userId={this.state.idPerson}  />))
            }
          </main>
            </>
        )
        } else return <Redirect to={'/'}/>
    };


}//llave de cierre de clase
export default Inbox;