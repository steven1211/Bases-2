import React, { Component } from 'react';
import { Transition } from 'react-transition-group';
import { Link } from 'react-router-dom';
import { faHome, faUsers, faIdBadge, faArchive, faUserPlus, faBoxes} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './sideBarContent.css'
const sidebarStyle = {
    transition: 'width 2s',
    float: 'left',
    borderRight: '2px solid black',
    backgroundColor: 'seashell',
    height: '100%',
    display:"flex",
    zIndex:"2"
}

const sidebarTransitionStyles = {
    entering: { width: 0 },
    entered: { width: '300px' },
    exiting: { width: '300px' },
    exited: { width: 0 }
  }

const linkStyle = { 
    //transition: 'opacity 2s linear',
}

const linkTransitionStyles = {
    entering: { opacity: 0 },
    entered: { animation:'fadeIn 2.3s linear' },
    exiting: { animation: 'fadeOut 1s linear'},
    exited: {  opacity: 0 }
}


class SidebarContent extends Component{

    renderSideBar = () => {
        return <Transition in={this.props.isOpen} timeout={{appear: 0, enter: 0, exit: 930}}>
            {(state) => (
                <div style={{
                    ...linkStyle,
                    ...linkTransitionStyles[state]
                }}>
                    <div className="profile-space">
                        <div className="image-space">
                            <img src={'../'+this.props.profilePic} className="profilePic" width="50%" height="50%"></img>
                        </div>
                        <div className="user-welcome">
                            <h3>Hi {this.props.userName}</h3>
                        </div>
                    </div>
                    <div className="menu">
                    <Link to="/inbox">
                            <input type="button" className="menuBtn" id="conversations"/>
                            <label for="conversations">
                                {<FontAwesomeIcon className="icon" icon={faUsers}/>}
                                Inbox
                            </label>
                        </Link>
                        <Link to="/">
                            <input type="button" className="menuBtn" id="home"/>
                            <label for="home">
                                {<FontAwesomeIcon className="icon" icon={faHome}/>}
                                Home
                            </label>
                        </Link>
                        <Link to={{ pathname: `/history/${this.props.id}`, state: { _id:this.props.id, auth: true} }}>
                            <input type="button" className="menuBtn" id="pHistory"/>
                            <label for="History">
                                {<FontAwesomeIcon className="icon" icon={faArchive}/>}
                                Historial
                            </label>
                        </Link>
                        <Link to="/friends">
                            <input type="button" className="menuBtn" id="friends"/>
                            <label for="friends">
                                {<FontAwesomeIcon className="icon" icon={faUsers}/>}
                                Friends
                            </label>
                        </Link>
                        {
                            this.props.isAdmin 
                            ? 
                            <>
                                <Link to="/productRegister">
                                    <input type="button" className="menuBtn" id="add"/>
                                    <label for="add">
                                        {<FontAwesomeIcon className="icon" icon={faBoxes}/>}
                                        Add Products
                                    </label>
                                </Link>
                                <Link to={{pathname:"/register", state: { newAdmin:true }}}>
                                    <input type="button" className="menuBtn" id="admin"/>
                                    <label for="admin">
                                        {<FontAwesomeIcon className="icon" icon={faUserPlus}/>}
                                        New Admin
                                    </label>
                                </Link>
                            </>
                            : null
                        }
                        
                    </div>
                </div>
            )}
        </Transition>
    }
    

    render() {
        return <Transition in={this.props.isOpen} >
            {(state) => (
                <div style={{
                    ...sidebarStyle,
                    ...sidebarTransitionStyles[state]
                }}>
                    {this.renderSideBar()}
                </div>
            )}
        </Transition>
    }
}

export default SidebarContent;