import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';
import './Product.css';


class Product extends Component{
  renderAdminBtn = (id) => {
    const {_id, title, description, price, image, productPic,isAvailable,isDeleted,totalRate,shipmentInfo} = this.props.productData;
    console.log(_id)
      return (
        <>
           <Link to={{pathname:`/productModify/${_id}`, state:{ product: this.props.productData }}}>
              <input type="button" className="btn" id={"modifyBtn"+this.props.value} disabled={!isAvailable}/>
              <label for={"modifyBtn"+this.props.value} className="modifyBtn">Modify</label>
            </Link>
           <input type="button" className="btn" id={"blockBtn"+this.props.value} onClick={this.props.blockToggle.bind(this,id)}/>
           <label for={"blockBtn"+this.props.value} className="blockBtn">Block</label>
           <input type="button" className="btn" id={"deleteBtn"+this.props.value} onClick={this.props.deleteToggle.bind(this,id)}/>
           <label for={"deleteBtn"+this.props.value} className="deleteBtn">Delete</label>
        </>
      )
  }

  render(){
    const {_id, title, description, price, image, productPic,isAvailable,totalRate,shipmentInfo,isDeleted} = this.props.productData;
    //const starPercentajeRounded = `${(Math.round(( starPercentaje/ 10)*10*2))}%` 
    const starPercentajeRounded=`${(totalRate /5)*100}%`
    //console.log("El resutlado redondeado es: "+starPercentajeRounded);
    const divStye={
      width: starPercentajeRounded,
    }
    //document.querySelector(`.stars-inner`).style.width = starPercentajeRounded;
    //console.log(_id)
    return(
      <article className="mw5 center bg-white br3 pa3 pa4-ns mv3 ba b--black-10" id={_id}>
      <div className="tc">
        <div>
          <img src={'../'+  image[0].imageData} class="br-100 h4 w4 dib ba b--black-05 pa2" />
          <h1 className="f3 mb2">{title}</h1>
          <div className="btn-container">
            <Link className="link-product" to={{pathname:`/ProductPage/${_id}`, state:{ product: this.props.productData }}}>
              <input type="button" className="btn" id={"addBtn"+this.props.value} disabled={!isAvailable}/>
              <label for={"addBtn"+this.props.value} className="addBtn">{isAvailable ? "Purchase" : "Not Available"}</label>
            </Link>
            {this.props.isAdmin ? this.renderAdminBtn(_id): null}
          </div>
          <span>$ {price}</span>
        </div>
        <div  class="stars-outer">
          <div class="stars-inner" style={divStye}>
          </div>
        </div> 
        <h5 className ="f5 fw4 mt0">Total Rating: {totalRate}</h5>
        <h4 id="h4Shipment">{shipmentInfo}</h4>    
      </div>



    </article>
    
    )

  }
};

//starsInner.style.width = '100';




export default Product;