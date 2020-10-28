import React, { Component } from 'react';
import './Friends.css';
import { Route, Redirect } from 'react-router';
import axios from 'axios';
import Menu from './Menu';
import Header from '../../Header';
import { Link } from 'react-router-dom';
import History from '../History/History'
import FriendCard from './FriendCard'

class Friends extends Component{

    state={
        profilePic: null,
        userName: null,
        isAuth:true,
        otherUsers:[],
        friends:[],
        friendsIds:[]
    }
    
    componentDidMount(){
        this.getSession();
        this.getFriends();
        this.getUsers();
    }

    getSession(){
        var self = this;
        axios.get('/showSession', {}).then(function(res){
            self.setState({
                profilePic: res.data.imageData,
                name: res.data.fullName,
                userName: res.data.userName
            });
            if(res.data.userType === "Admin"){
                self.setState({
                    isAdmin: true
                })
            }
        });
    }

    getUsers(){
        var self = this;
        axios.get('/allUsers', {}).then(function(res){
            //console.log("Axios get all users")
            //console.log("Received usermap: " + res.data)
            self.setState({
                otherUsers: res.data
            })

        })
    }

    getFriends(){
        var self = this;
        axios.get('/getFriends', {}).then(res =>{
            //console.log("Get friends data:")
            //console.log(res.data.friends)
            res.data.friends.map(friendId =>{
                //console.log("Id: ")
                //console.log(friendId._fields[0])
                var newId = friendId._fields[0]
                var newArray = self.state.friendsIds
                newArray.push(newId)
                self.setState({
                    friendsIds: newArray
                })
            })
            console.log("State friendsIds: ")
            console.log(self.state.friendsIds)

            axios.post('/getUsersById', {ids: self.state.friendsIds}).then(function(res){
                self.setState({
                    friends: res.data
                })

                //Remove friends from non friend user list
                var array = self.state.otherUsers
                self.state.friendsIds.forEach(function removeFriendsFromOtherUsers(item){
                    //console.log("Item")
                    //console.log(item)
                    var index = -1
                    array.forEach(function(arrItem, elementIndex){
                        //console.log("Current friend id" + item)
                        //console.log("Current user id")
                        if(arrItem._id == item && elementIndex!= -1){ 
                            index = elementIndex
                            array.splice(index, 1)
                        }
                    })
                })
                self.setState({
                    otherUsers: array
                })
            })
        })


    }

    addFriend=(userId)=>{
        var self = this;
        console.log("Entra en el add")
        axios.post('/addFriend', {id:userId})
        .then(function(res){
            if(!res.data.success){
                console.log("Problema agregando en base")
            } else{
                console.log("Success agregando en base")
                var friendArray = self.state.friends
                var otherUserArray = self.state.otherUsers
                otherUserArray.forEach(function changeOtherUserToFriendList(item, index){
                    if(item._id == userId){
                        friendArray.push(item)
                        otherUserArray.splice(index, 1)
                    }
                });
                self.setState({
                    friends:friendArray,
                    otherUsers:otherUserArray
                });
            }
        });
    }

    removeFriend= (userId)=>{
        var self = this;
        console.log("Entra en el remove")
        axios.post('/removeFriend', {id:userId})
        .then(function(res){
            if(!res.data.success){
                console.log("Problema eliminando en base")
            } else{
                console.log("Success eliminando en base")
                var friendArray = self.state.friends
                var otherUserArray = self.state.otherUsers
                friendArray.forEach(function changeFriendToOtherUsersList(item, index){
                    
                    if(item._id == userId){
                        otherUserArray.push(item) //Add to other user array
                        friendArray.splice(index, 1) //Remove from friend array
                    }
                });
                self.setState({
                    friends: friendArray,
                    otherUsers: otherUserArray
                });
            }
        });
        
    }
    
    render(){
            const items = []
            const friendItems = []
            if(this.state.isAuth) {
                return(
                    <div>
                        <Header/>
                        <Menu/>
                        <div class="row">
                            <div class="column">
                                <h1 float="right">My Friends</h1>
                                {this.state.friends.map((friend,index)=>
                                    (<FriendCard key={friend._id} friendData={friend} isFriend={true} removeFriend={this.removeFriend} addFriend={this.addFriend} currentUser={this.state.userName}/>)
                
                                
                                )}

                            </div>
                            <div class="column">
                                <h1>Find friends</h1>
                                {this.state.otherUsers.map((user,index) => 
                                    (<FriendCard key={user._id} index={index} friendData={user} isFriend={false} removeFriend={this.removeFriend} addFriend={this.addFriend} currentUser={this.state.userName}/>)
                                )}
                            </div>
                        </div>
                    </div>
                )} else {
                    return <Redirect to={'/login'}/>
                }
        
    }
}

export default Friends;