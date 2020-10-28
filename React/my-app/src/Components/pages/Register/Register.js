import React, { Component } from 'react'
import './Register.css'
import axios from 'axios'
import Header from '../../Header';
import Menu from '../../pages/Profile/Menu';
import { Route, Redirect } from 'react-router';

const crypto = require('crypto');

//hashPassword("PAVO");

function saltGenerator(length){
    return crypto.randomBytes(Math.ceil(length/2))
    .toString('hex')
    .slice(0,length);    
}

function hashPassword(password) {
    //var salt=saltGenerator(20);
    //var contrasenaFinal = salt+password;
    //alert("La contrasena con el sal es: "+contrasenaFinal);
    return crypto.createHash('sha256').update(password).digest("hex");

    //alert("La contrasena con el sal es: "+hash);
}

class Register extends Component{
    state = {
        fullName: null,
        userName: null,
        password: "",
        email: null,
        birthDate: Date,
        confirmPassword: "",
        userImage: null,
        file: null,
        newAdmin: false
    }

    componentDidMount(){
        try{
        this.setState({
            newAdmin: this.props.location.state.newAdmin
        })
        }catch(error){};
    }

    putUserToDB = (e) => {
        e.preventDefault();//prevents that the website reloads 
        //Checks if the passwords match, if not sends an alert 
        if(this.state.fullName ==null | this.state.userName == null | this.state.password == "" | this.state.email == null | this.state.confirmPassword=="" | this.state.userImage==null | this.state.birthDate==null){
            alert("All fields must be filled");
        }else if ((this.state.password !== this.state.confirmPassword)) {
            alert("Password and confirm password don't match, please try again")
        }
        else {
            //Sends in formData cause of multer
            let formData = new FormData();
            let salt=saltGenerator(20);
            formData.append("userName", this.state.userName);
            formData.append("salt",salt);
            formData.append("password", hashPassword(salt+this.state.password));
            formData.append("fullName", this.state.fullName);
            formData.append("email", this.state.email);
            formData.append("birthDate", this.state.birthDate);
            if(this.state.newAdmin){
                formData.append("userType","Admin");
            }else{
                formData.append("userType","User");
            }
            formData.append("imageName", "multer-image-" + Date.now());
            formData.append("imageData", this.state.file);
            //sends the request to the backend to process it, with all the info
            axios.post('putUser', formData
            ).then(function(response){ 
                if(response.data.success === false){ //catches errors in the process
                    console.log(response);
                    alert(response.data.error);
                }else{ //Everything went well :D
                    alert("Thank you for registering :D")
                }
            }) .catch(function(error) { //catches html request errors
                console.log(error)
                alert(error)
            });
        }
    };

    setImage = (e) =>{
        if(e.target.files.length > 0){ //Error if image is selected but canceled, and an image was previously selected
            this.setState({
                userImage: URL.createObjectURL(e.target.files[0]),
                file: e.target.files[0]
            });
        }
    };

    onChange = (e) => this.setState({[e.target.name]:  //Connects state attribute with the input in the html
        e.target.value});

    render(){
        return(
            <div>
            <Header/>
            {this.state.newAdmin &&
            <Menu/>
            }
            <form onSubmit={this.putUserToDB}>
                <div id="center-section"> 
                    <div id="main-section"> 
                        <div className="border">
                            <div className ="box-container">
                                <h1>
                                    {this.state.newAdmin ? "Admin information":"User information"}
                                </h1>  
                                <div className="spacing-base">
                                    <div className="image-space"> 
                                        <img src={this.state.userImage} width="80%" height="50%"></img>
                                    </div>
                                    <input type="file" className="imageButton" id="file" name="userImage" onChange={this.setImage}></input>
                                    <label for="file">Choose an Image</label>
                                </div>
                                <div className="spacing-base">
                                    <label> Full Name</label> 
                                    <input type="text" autoComplete="on" name="fullName" onChange={this.onChange}></input> 
                                </div>  
                                <div className="spacing-base">
                                    <label> User Name</label> 
                                    <input type="text" autoComplete="on" name="userName" onChange={this.onChange}></input> 
                                </div>  
                                <div className="spacing-base">
                                    <label> Email</label> 
                                    <input type="text" autoComplete="on" name="email" onChange={this.onChange}></input> 
                                </div>
                                <div className="spacing-base">
                                    <label> BirthDate </label> 
                                    <input type="date"  name="birthDate" onChange={this.onChange}></input> 
                                </div>  
                                <div className="spacing-base">
                                    <label> Password</label> 
                                    <input type="password" name="password" onChange={this.onChange}></input> 
                                </div>  
                                <div className="spacing-base">
                                    <label> Confirm Password</label> 
                                    <input type="password" name="confirmPassword" onChange={this.onChange}></input> 
                                </div>
                                <div className="spacing-base">
                                    <span> 
                                        <button type="submit" value="Submit">Register</button>
                                    </span> 
                                </div>                                                
                            </div>
                        </div> 
                    </div>
                </div>
            </form>
            </div>
        )
    };
    
}

export default Register;

