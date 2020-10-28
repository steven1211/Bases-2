import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './FriendCard.css';


class FriendCard extends Component {

    
    renderFriendBtns(){
        const { userName,_id} = this.props.friendData;
        return(
            <div className="friend-btns-container">
                <input type="button" onClick={this.props.removeFriend.bind(this,this.props.friendData._id)} className="friend-btn" id={"btnUnfollow" + this.props.index}></input>
                <label for={"btnUnfollow" + this.props.index} className="unfollowBtn">Unfriend</label>
                <Link to={{ pathname: `/history/${_id}`, state: { _id:_id, auth: false} }}>
                    <input type="button" className="friend-btn" id={"friendHistory" + this.props.index} />
                    <label for={"friendHistory" + this.props.index}>History</label>
                </Link>
                <Link to={{ pathname: `/messages/${_id}`, state: { person1:userName,person2:this.props.currentUser,messages:[]} }}>
                    <input type="button" className="friend-btn" id={"messsageBtn" + this.props.index} />
                    <label for={"messsageBtn" + this.props.index}>Send Message</label>
                </Link>
            </div>
        )
    }

    renderUserBtns(){
        const { index,_id} = this.props.friendData;
        return(
            <div className="friend-btns-container">
                <input type="button" onClick={this.props.addFriend.bind(this,_id)} className="friend-btn" id={"btnFollow" + this.props.index}></input>
                <label for={"btnFollow" + this.props.index} className="unfollowBtn">Follow</label>
            </div>
        )
    }

    render() {
        const { profilePic, userName, removeFriend,_id} = this.props.friendData;
        return(
            <div className="friend-container">
                <h3>{userName}</h3>
                <div className="friend-img-container">
                    <img src={profilePic.imageData} className="friend-img" alt="This user has no image"/>
                </div>
                {this.props.isFriend ? this.renderFriendBtns() : this.renderUserBtns()}
            </div>
        )

    }
}
export default FriendCard;