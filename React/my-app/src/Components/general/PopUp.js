import React, { Component } from "react";
import './PopUp.css'

class PopUp extends Component {

  handleYes = () =>{
    this.props.toggle();
    this.props.action();
  }

  handleClick = () => {
    this.props.toggle();
  };
    
  render() {
  return (    
      <div className="popUp">
          <div className="modal_content">
              <span className="close" onClick={this.handleClick}>&times;    </span>
              <h3>WARNING</h3>
      <label style={{margin:"5px"}}>{this.props.question}</label>
              <div className="popupBtn-container">
                <input type="button" className="popup-Btn" id="addBtn" onClick={this.handleYes}/>
                <label for="addBtn" className="addBtn">Yes</label>
                <input type="button" className="popup-Btn" id="deleteBtn" onClick={this.handleClick}/>
                <label for="deleteBtn" className="deleteBtn">No</label>
              </div>
          </div>
      </div>
    );
  }
}

export default PopUp