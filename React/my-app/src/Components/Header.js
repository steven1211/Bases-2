import React, { useState, Component } from 'react'
import './Header.css'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Route, Redirect } from 'react-router';



class Header extends Component {
    state = {
        isAuth: false,
        productSearch: null,
        isStore:false,
    }


    componentDidMount(){
       if(this.props.isStore) this.state.isStore=true;          
        var self=this;
        axios.get('/showSession').then(function(res){
            if(res.data.loggedIn == true) self.setState({isAuth:true})
            else self.setState({isAuth:false});
        })
    }

    logOut(){
        try {this.props.reload()} catch(error){}

        axios.get("logOut",{})
        .then(function (res) {
          })
          .catch(function (err) {
          });        
        this.setState({
            isAuth:false
        })
    }

    showSession = () => {
        axios.get('/showSession',{}).then(function(res){
            alert("La sesión pertenece al usuario: "+res.data.userName+"\nEl correo es: "+res.data.email+
            "\nSu nombre completo es: "+res.data.fullName+"\nUsuario"+res.data.userType+"\nID"+res.data._id+
            "\nTipo de usuario "+res.data.userType);
        });    
      };

    onChange = (e) => this.setState({[e.target.name]:
        e.target.value}); 

    _handleKeyDown=(e)=>{
        if(e.key == 'Enter'){
            this.props.searchProduct2(this.state.productSearch)
        }
    }

    render(){
        var session = this.state.isAuth;
        
        return(
            <>
            <head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            </head>
            <header className="header">
                <div className="topContainer">
                    {/* Home logo */}
                    <h1 display="inline-block">
                    <Link className="link" to="/">Amazon ++</Link>
                    </h1>
                    {/* Search bar */}
                    <div className="search-container">
                        {this.state.isStore==false &&
                            <form  >
                                <input type="text" name="productSearch" placeholder="Search a product by name or description..." onChange={this.onChange} tabIndex="1"></input>
                                <Link to={{pathname:`/store`, state:{productSearch: this.state.productSearch}}} >
                                <button type="submit" ><i class="fa fa-search"></i></button>
                                </Link>
                            </form>
                        }
                        {this.state.isStore==true &&
                            <div>
                            <input type="text" name="productSearch" placeholder="Search a product by name or description..." onChange={this.onChange} tabIndex="1" onKeyDown={this._handleKeyDown}></input>
                            <button  onClick={()=>this.props.searchProduct2(this.state.productSearch)} type="submit" ><i class="fa fa-search"></i></button>
                            </div>
                        }
                    </div>
                    <div id="menu">
                        <Route
                            render={() => {
                                if(!session){
                                    return <>{" | "} <Link className="link" to="/login">Log in</Link></>
                                }else{
                                    return <></> 
                                }
                            }}
                        />
                        <Route
                            render={() => {
                                if(!session){
                                    return <>{" | "} <Link className="link" to={{pathname:"/register", state:{ newAdmin: false }}}>Register</Link></>
                                }else{
                                    return <></> 
                                }
                            }}
                        />
                        <Route
                            render={() => {
                                if(session){
                                    return <>{" | "} <Link className="link" to="/MyCart">My cart</Link></>
                                }else{
                                    return <></> 
                                }
                            }}
                        />
                        <Route
                            render={() => {
                                if(session){
                                    return <>{" | "}<Link className="link" to="/" onClick={() => this.logOut()}>Log out</Link></>
                                }else{
                                    return <></> 
                                }
                            }}
                        />
                       <Route
                            render={() => {
                                    return <>{" | "} <Link className="link" onClick={()=>this.showSession()}>Show Session</Link></>

                            }}
                        />
                    </div>
                </div>
            </header>
            </>
        )
    }
}

export default Header