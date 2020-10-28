import React, { Component } from 'react'
import axios from 'axios'
//import "./ProductRegister.css"
import { Route, Redirect } from 'react-router';
import Select from 'react-select';
import Menu from '../Profile/Menu';
import Header from '../../Header';
import Message from '../../pages/Conversation/Message';


var idPerson1="";
var idPerson2="";
var message="";
var messageOwner="";
class Messages extends Component {


    constructor(props){
        super(props);
        this.textArea=React.createRef();
    }

    state = {
        messages:[],
        isAuth: true,
        idPerson1:null,
        idPerson2:null,
        message:null,
        messageOwner:"admin",
        messageDescription:null,
    }

    componentDidMount(){
        console.log("Estoy en messages, mostrando usuarios ");
        console.log(this.props.location.state.person1,this.props.location.state.person2);
        this.setState({messages:this.props.location.state.messages})
        idPerson1=this.props.location.state.person1;
        idPerson2=this.props.location.state.person2;
        messageOwner=this.props.location.state.person2;
        var self=this;
    }

    putMessage = (e) => {
        var self=this;
        e.preventDefault();
        if (this.state.messageDescription == null) {
            alert("Please insert a message")
        }
        else {
            axios.post('/putNewMessage', {
                idPerson1:idPerson1,
                idPerson2:idPerson2,
                message:this.state.messageDescription,
                messageOwner:messageOwner,
            })
                .then(function (response) {
                    if (response.data.success == false) { 
                        alert(response.data.error);
                    } else { //Everything went well :D
                        const newMessage={                
                            message:self.state.messageDescription,
                            idPerson:messageOwner,
                            messageDate: new Date(),
                        }
                        self.setState({
                            messages:[...self.state.messages,newMessage]
                        })
                        alert("Message sent successfully");
                        self.textArea.current.value="";
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
            <div>
            <Header/>
            <Menu/>
            <div className="below-container" >
                    <h2 className="description">All messages:</h2>
                    <main className="pa3 pa5-ns flex flex-wrap">
                    {
                        this.state.messages.map((p, index) => (<Message key={p._id} value={index} messageData={p} />))
                    }
                    </main>
                </div>
            <article style={{backgroundColor:'rgb(255,255,191)', 'text-align':'left',width:'800px','margin-bottom':'2%','border-radius':'2%'}} className=" center   pa3 ba b--black-10" id={12}>
                <div>
                    <p >Please enter a new message to send here</p>  
                    <br/>
                    <textarea ref={this.textArea} style={{ backgroundColor:'rgb(255,255,230)',width:'100%',height:'100px'}}type='text' onChange={this.onChange} name='messageDescription'/>
                </div>
            </article>
            <br></br>
                <form className="" onSubmit={this.putMessage} >
                    <div class="star">
                        <button type="submit" className="cartBtn2" id="messagePerson"/>
                        <label for="messagePerson">
                          send message             
                        </label>                         
                        <br></br>
                    </div>
                </form>
            </div>            
        )
        } else return <Redirect to={'/'}/>
    };


}//llave de cierre de clase
export default Messages;

