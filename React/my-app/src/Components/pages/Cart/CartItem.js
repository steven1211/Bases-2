import React,{ Component } from 'react';
import './CartItem.css';
import { faTrashAlt, faCaretUp, faCaretDown, faSadTear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


class CartItem extends Component{

    handleDecrease = (e) => {
        e.preventDefault();
        if(this.props.productData.quantity > 1){
            this.props.decrease(this.props.productData.id);
        }else{
            this.props.delete(this.props.productData.id);
        }
    }

    renderUpArrow = () =>{
        const {id, stock, quantity} = this.props.productData
        if(Number(stock) > Number(quantity)){
            return(
                <>
                    <input type="button" className="cartItemBtn" id={"addArrow"+this.props.value} onClick={this.props.add.bind(this,id)}/>
                    <label for={"addArrow"+this.props.value} style={{height:"0.7em"}}>      
                        {<FontAwesomeIcon className="arrow-icon" icon={faCaretUp}/>}
                    </label> 
                </>
            )   
        }
        
    }

    render(){
        const {id,title, productPic, price, quantity} = this.props.productData
        return(
            <div className="item-container">
                <div className="item-image">
                    <img className="img" src={productPic}/>
                </div>
                <h5 className="item-text">{title}</h5>
                <h6 className="item-text">$ {price}</h6>
                <h6 className="item-quantity">Quantity: {quantity}</h6>
                <div className="arrow-container">
                    {this.renderUpArrow()}
                    <input type="button" className="cartItemBtn" id={"minusArrow"+this.props.value} onClick={this.handleDecrease}/>
                    <label for={"minusArrow"+this.props.value} style={{height:"1.2em"}}>      
                        {<FontAwesomeIcon className="arrow-icon" icon={faCaretDown}/>}
                    </label> 
                </div>
                <input type="button" className="cartItemBtn" id={"deleteCart"+this.props.value} onClick={this.props.delete.bind(this,id)}/>
                <label for={"deleteCart"+this.props.value}>      
                    {<FontAwesomeIcon className="trash-icon" icon={faTrashAlt}/>}
                </label> 
            </div>
        )
    }
}

export default CartItem;