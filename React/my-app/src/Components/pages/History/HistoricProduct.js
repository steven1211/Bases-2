import React, { Component } from 'react';
import Card from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './History.css'


class HistoricalProduct extends Component {

    render() {
        const { _id, title, description, price, imageData, quantity, purchaseDate, idPurchase } = this.props.productData;
        return (
            <div>
                    <div className="card" style={{ width: '18rem' }} id={_id}>
                        <div className="imageHolder">
                            <img src={'../' + imageData} class="card-img-top" alt="Card image cap" />
                        </div>
                            <div class="card-body">
                                <h5 class="card-title">{title}</h5>
                                <p class="card-text">{description}</p>
                            </div>
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item">Precio: ${price}</li>
                                <li class="list-group-item">Cantidad de Productos: {quantity}</li>
                                <li class="list-group-item">Fecha de Compra: {purchaseDate}</li>
                                <li class="list-group-item">Orden Nº{idPurchase}</li>
                            </ul>
                            {/* <div class="card-body">
                                <a href="#" class="card-link">Card link</a>
                                <a href="#" class="card-link">Another link</a>
                            </div> */}
                        </div>


                    </div>
            
        )
    }

};

export default HistoricalProduct;