import React, { Component } from 'react'
import axios from 'axios'
import "./ProductRegister.css"
import { Route, Redirect } from 'react-router';
import Select from 'react-select';
import Menu from '../../pages/Profile/Menu';
import Header from '../../Header';


let shipmentsAvaiable = ["Fast Shipment", "Slow Shipment"];

class ProductRegister extends Component {
    state = {
        options:[], 
        selectedOption:[],
        title: null,
        description: null,
        price: null,
        stock: null,
        shipmentInfo: "Fast Shipment",
        photos: null,
        file: [],
        videos: null,
        totalRate: null,
        isAuth: true,
        isAdmin: true,
        categoriesAvailable: []
    }

    componentDidMount(){
        var self=this;
        axios.get('/showSession').then(function(res){
            if(res.data.loggedIn && res.data.userType=="Admin") self.setState({isAuth:true,isAdmin:true})
            else self.setState({isAuth:false,isAdmin:false});
        })
        this.loadCategories();
    }

    loadCategories() {
        var self = this;
        axios.get('allCategories', {}).then(function (res) {
            console.log(res.data)
            self.setState(
                {
                    categoriesAvailable: res.data
                }
            )
            self.loadOptions();
        });
    };



    productToDB = (e) => {
        e.preventDefault();//prevents that the website reloads 
        //Checks if the passwords match, if not sends an alert 
        if (this.state.title === null) {
            alert("Product must have a name")
        }
        else if(this.state.file.length==0) alert("You must select at least one image for the product!!");
        else if(this.state.file[0].name.includes(".mp4")) alert("Please select a photo first to display in the store and then more photos or videos!!")
        else {
            //Sends in formData cause of multer
            var newCategories = [];
            this.state.selectedOption.map(option => {
                newCategories.push(option.value)
            })
            console.log("hello it's me")
            console.log(newCategories);
            let formData = new FormData();
            formData.append("title", this.state.title);
            for(var i=0; i<newCategories.length; i++){
                formData.append("category",newCategories[i]);
            }
            formData.append("description", this.state.description);
            formData.append("price", this.state.price);
            formData.append("stock", this.state.stock);
            formData.append("shipmentInfo", this.state.shipmentInfo);
            formData.append("imageName", "multer-image-" + Date.now());
            for(var i=0;i<this.state.file.length;i++){
                formData.append("imageData",this.state.file[i]);
            }
            //formData.append("imageData", this.state.file);
            //sends the request to the backend to process it, with all the info
            axios.post('putProduct', formData)
                .then(function (response) {
                    if (response.data.success === false) { //catches errors in the process
                        console.log('ERROR REGISTRANDO: '+response);
                        alert("ERROR REGISTRANDO: "+response.data.error);
                    } else { //Everything went well :D
                        alert("The product has been successfully registered!!")
                    }
                }).catch(function (error) { //catches html request errors
                    console.log("CATCH"+error)
                    alert("CATCH"+error)
                });
        }
    };

    setImages = (e) => {
        if (e.target.files.length > 0) { //Error if image is selected but canceled, and an image was previously selected
            this.state.file=e.target.files;
            console.log("Mostrando arreglo de putMultiple1 en el front end");
            for(var i=0;i<e.target.files.length;i++){
                console.log(e.target.files[i]);
            }
            //this.state.photos=URL.createObjectURL(e.target.files[])
            //this.setState({
                //photos: URL.createObjectURL(e.target.files[0]),
                //file: e.target.files[0]
            //});
        }
    };

    onChange = (e) => this.setState({
        [e.target.name]:  //Connects state attribute with the input in the html
            e.target.value
    });

    loadOptions = () => {
        this.state.categoriesAvailable.map(cat => {
            const newOption = {value: cat.category, label: cat.category}
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


    render() {
        if (this.state.isAuth && this.state.isAdmin) {
        return (
            <>
            <div>
            <Header/>
            <Menu/>
            </div>
            <form onSubmit={this.productToDB}>
                <div id="center-section">
                    <div id="main-section">
                        <div className="border">
                            <div className="box-container">
                                <h1>
                                    Create a New Product
                                </h1>
                                <div className="spacing-base">
                                    <label> Product Title</label>
                                    <input type="text" autoComplete="on" name="title" onChange={this.onChange}></input>
                                </div>
                                <div className="spacing-base">
                                    <label>Description</label>
                                    <textarea type="text" autoComplete="on" rows="10" cols="30" name="description" onChange={this.onChange}></textarea>
                                </div>

                                <div className="spacing-base">
                                    <label> Price $</label>
                                    <input type="Number" autoComplete="on" name="price" min="0" onChange={this.onChange}></input>
                                </div>

                                <div className="spacing-base">
                                    <label> Categories </label>
                                    <Select isMulti name="categories" onChange={this.handleChange} options={this.state.options} className="basic-multi-select" classNamePrefix="select" />
                                </div>

                                <div className="spacing-base">
                                    <label> Stock</label>
                                    <input type="Number" min="1" name="stock" onChange={this.onChange}></input>
                                </div>

                                <div className="spacing-base">
                                    <label> Shipment </label>
                                    <select name="shipmentInfo" onChange={this.onChange} >
                                        {
                                            shipmentsAvaiable.map(function (x) {
                                                return <option value={x}>{x}</option>;
                                            })}
                                    </select>
                                </div>

                                <div className="spacing-base">
                                    <input type="file" multiple="multiple" name="imageData" accept="image/png, image/jpeg, image/jpg, video/mp4 "onChange={this.setImages} />
                                    <label for="file">Insert Product Images or Videos</label>
                                </div>

                                <div className="spacing-base">
                                    <span>
                                        <button type="submit" className="registerButton" value="Submit">Register new Product</button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            </>
        )
        } else if (this.state.isAdmin=="User"){
            return <Redirect to={'/login'}/>
        } else return <Redirect to={'/'}/>
    };


}//llave de cierre de clase
export default ProductRegister;
