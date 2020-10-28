import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

class Comment extends Component{
  render(){
    const {_id, product_id,customer_userName, customer_fullName, commentDescription, commentDate} = this.props.commentData;
    return(
      <article style={{backgroundColor:'rgb(255,255,191)', 'text-align':'left',width:'80%','margin-bottom':'2%','border-radius':'2%'}} className=" center   pa3 ba b--black-10" id={_id}>
      <div className="">
        <div style={{display:'flex'}}>
          <h1 className="f3 mb2">{customer_fullName}: </h1>
        </div>
        <p style={{}}>"{commentDescription}"</p> 
        <h5 style={{'margin-top':'5%',textAlign:'right'}}className ="">Date: {moment(commentDate).format('MM/DD/YYYY')}</h5>
        <h5 style={{'margin-top':'0%',textAlign:'right'}}className ="">Hour: {moment(commentDate).format('H:mm')}</h5>
      </div>
    </article>    
    )
  }
};

export default Comment;