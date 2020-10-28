import React, { Component } from 'react';
import "./Menu.css";
import axios from 'axios';
import SidebarContent from './sidebarContent'
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Menu extends Component{
    state = {
        profilePic: null,
        userName: null,
        isOpen: false,
        isAdmin: false,
        id: null
    }

    componentDidMount(){
        this.getSession();
    }

    getSession(){
        var self = this;
        axios.get('/showSession', {}).then(function(res){
            self.setState({
                profilePic: res.data.imageData,
                name: res.data.fullName,
                userName: res.data.userName,
                id:res.data._id
            });
            if(res.data.userType === "Admin"){
                self.setState({
                    isAdmin: true
                })
            }
        });
    }

    toogleSideBar = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    render(){
        return( 
            <div className="sidebar-container">
                <div className = "sidebar-icon">
                    <input type="button" className="sidebarBtn" id="sidebarBtn" onClick={this.toogleSideBar}/>
                    <label for="sidebarBtn">
                        <FontAwesomeIcon className="icon" icon={faBars}/>
                    </label>
                </div>
                <SidebarContent isOpen={this.state.isOpen} profilePic={this.state.profilePic} userName={this.state.userName} id={this.state.id} isAdmin={this.state.isAdmin}/>
            </div>
        )
    }

}


export default Menu