import React, { Component } from 'react';
import "./Profile.css";
import Menu from './Menu';
import Header from '../../Header';
import axios from 'axios';
import { Route, Redirect } from 'react-router';
import { Link } from 'react-router-dom';


//alert("Entrando en perfil");
console.log("ENTRANDO EN PERFIL ...");
class Profile extends Component{

    state={
        isAuth:true,
        file:null,
    }
    
    componentWillMount(){
        var self=this;
        axios.get('/showSession').then(function(res){
            if(res.data.loggedIn) self.setState({isAuth:true})
            else self.setState({isAuth:false});
            //console.log("Hola el componente de sesionn es: "+res.data.loggedIn);
        })
    }

    putProduct = (e) => {
        e.preventDefault();//prevents that the website reloads 
        //Checks if the passwords match, if not sends an alert 

            //Sends in formData cause of multer
            let formData = new FormData();
            //formData.append("title", this.state.title);
            //formData.append("category", this.state.category);
            //formData.append("description", this.state.description);
            //formData.append("price", this.state.price);
            //formData.append("stock", this.state.stock);
            //formData.append("shipmentInfo", this.state.shipmentInfo);
            //formData.append("imageName", "multer-image-" + Date.now());
            for(var i=0;i<this.state.file.length;i++){
                formData.append("imageData",this.state.file[i]);
            }
            //formData.append("imageData", this.state.file[0]);
            //formData.append("imageData", this.state.file[1]);

            //sends the request to the backend to process it, with all the info
            axios.post('/putMultiple1', formData)
                .then(function (response) {
                    if (response.data.success === false) { //catches errors in the process
                        console.log(response);
                        alert(response.data.error);
                    } else { //Everything went well :D
                        alert("Product Registered Correctly")
                    }
                }).catch(function (error) { //catches html request errors
                    console.log(error)
                    alert(error)
                });       
    };

    setImages1 = (e) => {
        /*if (e.target.files.length > 0) { //Error if image is selected but canceled, and an image was previously selected
            this.setState({
                photos: URL.createObjectURL(e.target.files[0]),
                file: e.target.files[0]
            });
        }
        */
        this.state.file=e.target.files;
        console.log("Mostrando arreglo de putMultiple1 en el front end");
        for(var i=0;i<e.target.files.length;i++){
            console.log(e.target.files[i]);
        }
    };

    setImages2 = (e) => {
        /*if (e.target.files.length > 0) { //Error if image is selected but canceled, and an image was previously selected
            this.setState({
                photos: URL.createObjectURL(e.target.files[0]),
                file: e.target.files[0]
            });
        }
        */
        //this.state.file=e.target.files[0];
        console.log("Mostrando arreglo de putMultiple2 en el front end");
        for(var i=0;i<e.target.files.length;i++){
            console.log(e.target.files[i]);
        }
    };

    render(){
        if(this.state.isAuth) {
        return(
            <div>
            <Header/>
            <Menu/>
            <form onSubmit={this.putProduct}>
                    <input type="file"  multiple="multiple" name="imageData" onChange={this.setImages1}></input>
                    <input type="submit" value="uploading_img"/>
            </form>            
            <form action="/putMultiple2" method="post" enctype="multipart/form-data">
                <input type="file" name="uploadedImages" multiple onChange={this.setImages2}/>
                <input type="submit" value="uploading_img"/>
            </form>   
            </div>   
        )} else {
            return <Redirect to={'/login'}/>
            /*<div>
                <h1>You are not authorized to visit this page!! please login</h1>
                <div>
                <span id="registrationLink" class="button">
                    <a role="button" href="/login" class="button-text">Log in</a>                     
                </span>         
                </div>   
            </div>
            */

           
        }
    }
}

export default Profile;