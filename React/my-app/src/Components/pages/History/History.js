import React, { Component } from 'react'
import axios from 'axios'
import Header from '../../Header';
import SidebarContent from "../Profile/sidebarContent"
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProductCard from "./HistoricProduct.js"
import Menu from "../Profile/Menu"
import './History.css'

class History extends Component {
    state = {
        data: "HOLA",
        isAuth: true,
        profilePic: null,
        userName: null,
        isOpen: false,
        isAdmin: false,
        history: [],
        products: [],
    }

    componentWillMount() {
        this.loadHistory();
    }

    componentDidMount() {
        try {

            console.log("El amigo actual es: " + this.props.location.state.userData);
            this.setState({
                friend: this.props.location.state.userData
            })
        } catch (error) {
            this.state.productSearch = null;
        }
    }


    loadHistory() {
        var self = this;
        if(this.props.location.state.auth){
            axios.post("/findHistory",{userId: this.props.location.state._id})
            .then(function (history) {// esta reponse lo que trae son todos los datos 
                self.setState(
                    {
                        history: history.data
                    }
                )
                self.loadProducts();
            })
        }else{
            axios.post("/findHistoryFriend",{userId: this.props.location.state._id, auth: true})
            .then(function (history) {// esta reponse lo que trae son todos los datos 
                self.setState(
                    {
                        history: history.data
                    }
                )
                self.loadProducts();
            })
        }

    };//final

    toogleSideBar = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }


    loadProducts = () => {
        this.state.history.map(h => {
            var self = this;
            axios.post('/getProduct', { id: h.idProduct }).then(

                function (res) {//a;adir el error
                    if (res.data.success) {
                        const newProduct = {
                            id: h.idProduct,
                            title: res.data.product.title,
                            price: res.data.product.price,
                            quantity: h.Quantity,
                            purchaseDate: h.purchaseDate,
                            idPurchase: h.idPurchase,
                            imageData: res.data.product.image[0].imageData
                        }
                        self.setState(
                            {
                                products: [...self.state.products, newProduct]
                            }
                        )
                    }
                    else {
                        console.log("Ha ocurrido un recuperando el historial");
                    }

                }
            )
        }
        )

    }

    render() {
        return (
            <div>
            <Header />
            <Menu/>
            
            {/* <Menu/> */}
            <div>
                <main className="pa3 pa5-ns flex flex-wrap">
                    {
                        this.state.products.map(p => <ProductCard key={p._id} productData={p} />)
                    }
                </main>
            </div>
        </div>
                
        )
    };
}
export default History;