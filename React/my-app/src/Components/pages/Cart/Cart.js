import React,{ Component } from 'react'
import './Cart.css'
import axios from 'axios';
import Header from '../../Header';
import { Redirect } from 'react-router';
import CartItem from './CartItem'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import Menu from '../../pages/Profile/Menu';


class Cart extends Component{
    state = {
        currentUserId : null,
        hash: [],
        products: [],
        productTotal: null,
        totalCost: null,
        isAuth:true,
        isPublic: false
    }

    componentWillMount(){
        var self=this;
        axios.get('/showSession').then(function(res){
            if(res.data.loggedIn) {
                self.setState({
                    isAuth:true,
                    currentUserId: res.data._id
                });
                axios.post('/getCart', { 
                        id: self.state.currentUserId
                    })
                    .then(function(res){
                    if(res.data.success){
                        if(res.data.hash){
                           self.setState({
                               hash: res.data.hash
                           });
                           self.loadProducts();
                        }
                        else{
                            console.log("empty");
                        }
                    }else{
                        console.log(res.data.error);
                        alert(res.data.error)
                    }
                })
            }
            else self.setState({isAuth:false});
            //console.log("Hola el componente de sesionn es: "+res.data.loggedIn);
        })
    }

    loadProducts = () =>{
        Object.keys(this.state.hash).map( key => {
            var self = this;
            console.log(key);
            axios.post('/getProduct',{ id: key})
                .then(function(res){
                    console.log(res);
                    if(res.data.success){
                        const newProduct = {
                            id: key,
                            title: res.data.product.title,
                            category: res.data.product.category,
                            price: res.data.product.price,
                            //productPic: res.data.product.productPic.imageData,
                            productPic:res.data.product.image[0].imageData,
                            quantity: self.state.hash[key],
                            stock: res.data.product.stock
                        }
                        self.setState({
                            products: [ ... self.state.products, newProduct]
                        })
                    }
                })
        })
    }

    deleteItemCart = (productId) => {
        var self = this;
        axios.post('/deleteFromCart', { id: this.state.currentUserId, productId: productId})
            .then(res => {
                console.log(res)
                if(!res.data.success) {
                    alert("Error al borrar el item del carrito");
                }else{
                    self.setState({
                        products: this.state.products.filter(product => productId !== product.id)
                    })
                }
            })
    }

    addItem = (productId) => {
        var self = this;
        axios.post('/addToShoppingCart',{ 
            id: this.state.currentUserId,
            productId: productId
        }).then(res => {
            if(!res.data.success){
                alert(res.data.err);
            }else{
                self.setState({
                    products: this.state.products.map( product => {
                        if(product.id == productId){
                            product.quantity = Number(product.quantity) + 1
                        }
                        return product
                    })
                })
            }
        })
    }

    decreaseItem = (productId) => {
        var self = this;
        axios.post('/decreaseFromCart',{ 
            id: this.state.currentUserId,
            productId: productId
        }).then(res => {
            if(!res.data.success){
                alert(res.data.error);
            }else{
                self.setState({
                    products: this.state.products.map( product => {
                        if(product.id == productId){
                            product.quantity = Number(product.quantity) - 1
                        }
                        return product
                    })
                })
            }
        })
    }

    checkOut = () => {
        var self = this;
        axios.post('/insertHistory', {
            idPerson: this.state.currentUserId,
            isPublic: this.state.isPublic,
            products: this.state.products
        }).then(res => {
            if(res.data.err){
                alert(res.data.error);
            }else{
                self.state.products.map(product => {
                    axios.post('/reduceStock', { id: product.id, stock: product.quantity})
                        .then(res => {
                            if (!res.data.success) {
                                alert(res.data.error);
                            }
                        })
                        self.deleteItemCart(product.id);

                })
                alert("Thank you :D")
            }
        })
    }


    renderCartItems(){
        return(
            this.state.products.map((p, index) => (<CartItem key={p._id} value={index} productData={p} delete={this.deleteItemCart} add={this.addItem} decrease={this.decreaseItem}/>))
        )
    }

    checkedPublic = () => {
        this.setState({
            isPublic: !this.state.isPublic
        })
    }
 
    render(){
        if (this.state.isAuth) {
            return(
                <>
                    <div>
                        <Header/>
                        <Menu/>
                        <h1>
                            {this.state.cart === null ?"Go to store and get some stuff" : this.renderCartItems()}
                        </h1>
                        <input type="button" className="checkout-btn" id={"minusArrow"+this.props.value} onClick={this.checkOut}/>
                        <label for={"minusArrow"+this.props.value}>  
                            Checkout    
                            {<FontAwesomeIcon className="checkout-icon" icon={faCreditCard} size="2x"/>}
                        </label> 
                        <div class="custom-control custom-switch" style={{float:"right", marginRight:"2em", marginTop:"1em" }}>
                            <input type="checkbox" class="custom-control-input" id="customSwitches" onChange={this.checkedPublic}/>
                            <label class="custom-control-label" for="customSwitches">Public Order</label>
                        </div>                        
                    </div>
                </>
            )
        } else {
            return <Redirect to={'/login'}/>
        } 
    };
}

export default Cart;