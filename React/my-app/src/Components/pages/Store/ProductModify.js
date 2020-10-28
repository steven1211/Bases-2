import React, { Component } from 'react';
import './ProductModify.css';
import axios from 'axios';
import Header from '../../Header';
import ModifyImage from './ModifyImage'
import Select from 'react-select';
import { Redirect, BrowserRouter } from 'react-router';
import Menu from '../../pages/Profile/Menu';

let shipmentsAvailable = ["Fast Shipment", "Slow Shipment"];
let categoriesAvailable = ["Automotive and Transport", "Business and Finance", "Chemicals and Materials",
    "Company Reports", "Consumer Goods and Services", "Country Reports", "Energy and Natural Resources",
    "Food and Beverage", "Government and Public Sector", "Healthcare", "Humanities Books", "Industry Standards",
    "Manufacturing and Construction", "Military Aerospace and Defense", "Pharmaceuticals", "Science Books",
    "Telecommunications and Computing"];
class ProductModify extends Component{

    state = {
        category: this.props.location.state.product.category,
        title: this.props.location.state.product.title,
        description: this.props.location.state.product.description,
        price: this.props.location.state.product.price,
        stock: this.props.location.state.product.stock,
        shipmentInfo: this.props.location.state.product.shipmentInfo,
        //productPic: this.props.location.state.product.productPic,
        images:this.props.location.state.product.image,
        newImages: [],
        photos: null,
        file: [],
        videos: null,
        options:[], 
        selectedOption:[],
        done: false,
        imageWasChanged: false,
        isAuth:true,
    }

    componentWillMount(){
        this.loadOptions();
    }

    componentDidMount() {
        var self=this;
        axios.get('/showSession').then(function(res){
            if(res.data.loggedIn) self.setState({isAuth:true})
            else self.setState({isAuth:false});
            //console.log("Hola el componente de sesionn es: "+res.data.loggedIn);
        })    
      };

    modifyProduct = (e) => {
        var self = this;
        e.preventDefault();
        if (this.state.title === null) {
            alert("Product must have a name")
        } else {
            var newCategories = [];
            this.state.selectedOption.map(option => {
                newCategories.push(option.value)
            })
            axios.post('/updateProduct',{
                id: this.props.location.state.product._id,
                update:{
                    category : newCategories,
                    title: this.state.title,
                    description: this.state.description,
                    price: this.state.price,
                    stock: this.state.stock,
                    shipmentInfo: this.state.shipmentInfo,
                    image: this.state.images
                }
            }).then(function(res){
                if(!res.data.success){
                    alert(res.data.error);
                    console.log("Product modify error: " + res.data.error);
                }else{
                    let formData = new FormData();
                    formData.append("id",self.props.location.state.product._id);
                    for(var i=0;i<self.state.file.length;i++){
                        formData.append("imageData",self.state.file[i]);
                    }
                    axios.post('/addImagesProduct', formData).then(function(res){
                        if(!res.data.success){
                            alert(res.data.error);
                            console.log("Product modify error: " + res.data.error);
                        }else{
                            console.log("Product modified correctly!");
                            alert("Product modified correctly!");
                            self.props.history.push("/")
                        }
                    });
                    
                }
            });
        }
    } 

    setImages = (e) => {
        if (e.target.files.length > 0) { //Error if image is selected but canceled, and an image was previously selected
            this.state.file=e.target.files;
        }
    };

    detectIfImageLeft(id){
        var cont = 0;
        this.state.images.map( image => {
            if(image.imageName.includes(".jpg") || image.imageName.includes(".png")){
                if(image.imageData !== id){
                    cont++;
                }
            }
        })
        if(cont > 0){
            return true;
        }
        return false;
    }


    deleteImage = (imageData) => {
        if(this.detectIfImageLeft(imageData)){
            if(this.state.images.length > 1){
                var self = this;
                axios.post('/deleteImage', {image: imageData})
                .then(
                    self.setState({
                        images: this.state.images.filter(image => image.imageData !== imageData)
                    })
                )
            }else{
                alert("The product needs at least one image")
            }
        }else{
            alert("The product needs at least one image")
        }
    }

    onChange = (e) => this.setState({
        [e.target.name]:  //Connects state attribute with the input in the html
            e.target.value
    });

    renderProductCategories(){
        return
    }

    loadOptions = () => {
        var selectedCategories = []
        this.state.category.map( category => {
            console.log(this.state.options);
            const newOption = {value: category, label: category}
            selectedCategories.push(newOption);
        });
        this.setState({
            selectedOption: selectedCategories
        });
        categoriesAvailable.map(cat => {
            console.log(this.state.options);
            const newOption = {value: cat, label: cat}
            var newArray = this.state.options
            newArray.push(newOption)
            this.setState({
                options: newArray
            })    
        })
    }

    handleChange = selectedOption => {
        this.setState(
          { selectedOption },
          () => console.log(`Option selected:`, this.state.selectedOption)
        );
      };

    render(){
        console.log(this.props.location.state.product)
        const {_id, title, category, description, price, stock, shipmentInfo, productPic} = this.props.location.state.product

        function selectProductCategory(value){
            console.log("Category: " + category + "\n Select value: " + value)
            return ((category == value) ? true : false);
        }

        function selectProductShipmentInfo(value){
            console.log("Shipment info: " + shipmentInfo + "\n Select value: " + value)
            return ((shipmentInfo == value) ? true : false);
        }      

        return(
            <>
                <Header/>
                {this.state.isAuth &&
                    <Menu/>
                }
                <div id="center-section">
                    <div id="main-section">
                        <div className="border">
                            <div className="box-container">
                                <h1>
                                    Modify Product
                                </h1>
                                <form onSubmit={this.modifyProduct}>
                                    <div className="spacing-base">
                                        <label> Product Title</label>
                                        <input type="text" autoComplete="on" value={this.state.title} name="title" onChange={this.onChange}>
                                        </input>
                                    </div>
                                    <div className="spacing-base">
                                        <label>Description</label>
                                        <textarea type="text" autoComplete="on" rows="10" cols="30" name="description" onChange={this.onChange}>
                                            {this.state.description}
                                        </textarea>
                                    </div>

                                    <div className="spacing-base">
                                        <label> Price $</label>
                                        <input type="Number" autoComplete="on" name="price" value={this.state.price} min="0" onChange={this.onChange}>
                                        </input>
                                    </div>

                                    <div className="spacing-base">
                                        <label> Category </label>
                                        <Select isMulti name="categories" value={this.state.selectedOption} onChange={this.handleChange} options={this.state.options} className="basic-multi-select" classNamePrefix="select" />
                                    </div>

                                    <div className="spacing-base">
                                        <label> Stock</label>
                                        <input type="Number" min="1" name="stock" value={this.state.stock} onChange={this.onChange}></input>
                                    </div>

                                    <div className="spacing-base">
                                        <label> Shipment Information</label>
                                        <select id="shipmentInfo" name="shipmentInfo" value={this.state.shipmentInfo} onChange={this.onChange} >
                                            {
                                                shipmentsAvailable.map(function (x) {
                                                    return <option selected={selectProductShipmentInfo(x)} value={x}>{x}</option>;
                                                })
                                            }
                                        </select>
                                    </div>

                                    <div className="spacing-base">
                                        <label> Product Image</label>
                                        {this.state.images.map((image, index) => (<ModifyImage data={image.imageData} value={index} delete={this.deleteImage}/>))}
                                    </div>

                                    <div className="spacing-base">
                                        <input type="file" multiple="multiple" className="imageButton" accept="image/png, image/jpeg, image/jpg, video/mp4" id="imageFile" onChange={this.setImages}></input>
                                        <label for="imageFile">Add Product Image or Video</label>
                                    </div>

                                    <div className="spacing-base">
                                        <span>
                                            <button type="submit" className="saveButton" value="Submit">Save Product</button>
                                        </span>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default ProductModify;