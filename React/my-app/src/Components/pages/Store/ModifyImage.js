import React, { Component } from 'react';
import './ModifyImage.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

class ModifyImage extends Component{
    
    displayMedia(data){
        if(data.includes(".mp4")){
            return (
                <video width="100%" controls>
                    <source src={"/../"+data} type="video/mp4"/>
                </video>
            )
        }else{
            return(
                <img src={"/../"+data} className="product-image" style={{position: "relative"}}/>
            )
        }
    }

    render(){
        return(
            <>
                <div className="modify-img-container">
                    {this.displayMedia(this.props.data)}
                    <input type="button" className="delete-img-btn" id={"delete-img-btn"+this.props.value} onClick={this.props.delete.bind(this, this.props.data)}/>
                    <label for={"delete-img-btn"+this.props.value}>      
                        {<FontAwesomeIcon className="x-icon" icon={faTimesCircle}/>}
                    </label> 
                </div>
            </>
        )
    }
}

export default ModifyImage;