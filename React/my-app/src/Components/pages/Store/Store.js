import React, { Component } from 'react';
import './Store.css';
import Product from "./Product"
import axios from 'axios'
import PopUp from '../../general/PopUp';
import Header from '../../Header';
import Menu from '../../pages/Profile/Menu';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';
import { faWindowRestore } from '@fortawesome/free-solid-svg-icons';


var sortOptionPrice="asc";
var sortOptionRate="asc";
var sortOptionShipping="asc";

function byPrice(a,b){
  if(sortOptionPrice == "asc") {
    if(a.price > b.price) return 1;
    if(a.price < b.price) return -1;
  } else {
    if(a.price < b.price) return 1;
    if(a.price > b.price) return -1;
  }  
}

function byRate(a,b){
  if(sortOptionRate == "asc") {
    if(a.totalRate > b.totalRate) return 1;
    if(a.totalRate < b.totalRate) return -1;
  } else {
    if(a.totalRate < b.totalRate) return 1;
    if(a.totalRate > b.totalRate) return -1;
  }  
}

function byShipping(a,b){
  if(sortOptionShipping == "asc") {
    if(a.shipmentInfo > b.shipmentInfo) return 1;
    if(a.shipmentInfo < b.shipmentInfo) return -1;
  } else {
    if(a.shipmentInfo < b.shipmentInfo) return 1;
    if(a.shipmentInfo > b.shipmentInfo) return -1;
  }  
}

class Store extends Component {

  state = {
    products: [],
    resultSearch:[],
    recomendations: [],
    productsRecomendations: [], 
    isAdmin: false,
    deleteWindow: false,
    blockWindow: false,
    focusProductId: null,
    rate: 0,
    productSearch: null,
    //resultMessage: false,
    displaySearch:true,
    displayResult:false,
    displayAtStart:true,
    sortPrice: false,
    sortRate: false,
    sortShipping: false,
    isAuth:true,

    sortOptionPrice: "asc",
    sortOptionRate: "asc",
    sortOptionShipping: "asc",

    rateAllowed: false,
    isAuth:true,
  };

  componentWillMount(){
    var self=this;
    axios.get('/showSession').then(function(res){
        if(res.data.loggedIn) self.setState({isAuth:true})
        else self.setState({isAuth:false});
        //console.log("Hola el componente de sesionn es: "+res.data.loggedIn);
    })
}


  componentDidMount() {
    var self=this;
    axios.get('/showSession').then(function(res){
        if(res.data.loggedIn) self.setState({isAuth:true})
        else self.setState({isAuth:false});
        //console.log("Hola el componente de sesionn es: "+res.data.loggedIn);
    })
    try {
      console.log("El estado del search es: " + this.props.location.state.productSearch);
      this.state.productSearch = this.props.location.state.productSearch;
      this.state.displayAtStart = false;
    } catch (error) {
      this.state.productSearch = null;
    }

    if (this.state.productSearch != null) {
      this.searchProduct()
    } this.loadProduct();
    this.verifyAdmin();
    this.loadRecomendations();
  };

  deleteToggle = (id) => {
    this.setState({
      deleteWindow: !this.state.deleteWindow,
      focusProductId: id
    })
  };

  blockToggle   = (id) => {
    this.setState({
      blockWindow: !this.state.blockWindow,
      focusProductId: id
    })
  }

  blockProduct = () => {
    console.log(this.state.focusProductId)
    axios.post('blockProduct', {
      id: this.state.focusProductId
    }).then(function (res) {
      if (!res.data.success) {
        alert(res.data.error);
        console.log(res.data.error);
      } else {
        alert("Success")
      }
    });
    this.setState({
      products: this.state.products.map(product => {
        if (product._id === this.state.focusProductId) {
          product.isAvailable = !product.isAvailable;
        }
        return product;
      })
    });
  }

  deleteProduct = () => {
    console.log(this.state.focusProductId)
    axios.delete('deleteProduct', {
      data: {
        id: this.state.focusProductId
      }
    }).then(function (res) {
      if (!res.data.success) {
        alert(res.data.error);
        console.log(res.data.error);
      } else {
        alert("Success")
      }
    });
    this.setState({
      products: this.state.products.filter(product => this.state.focusProductId !== product._id)
    })
  }

  loadProduct() {
    var self = this;
    axios.get('allProducts', {}).then(function (res) {
      self.setState(
        {
          products: res.data
        }
      )
      //console.log("Arreglo principal:");
      //console.log(self.state.products);
    });
  };

  loadRecomendations(){
    var self=this;
    axios.get('/showSession').then(function(res){
        if(res.data.loggedIn){
          axios.post('/getRecomendations',{userId: res.data._id})
          .then(res => {
           res.data.recomendations.map( category => {
              self.setState({
                recomendations: [ ... self.state.recomendations, category._fields[1]]
              })
            })
            self.state.recomendations.map( recommendation => {
              axios.post('/getProductByCategory', { category: recommendation})
              .then(res => {
                if(res.data.success){
                    self.setState({
                      productsRecomendations: [ ... self.state.productsRecomendations,res.data.product]
                    })
                }
              })
            })

          })
        }
    })
  }


  sortResults = (e) => {
   sortOptionPrice=this.state.sortOptionPrice;
   sortOptionRate=this.state.sortOptionRate;
   sortOptionShipping=this.state.sortOptionShipping;

   if(this.state.sortPrice) {
     if(this.state.sortRate && this.state.sortShipping) {
       this.setState({products:this.state.products.sort(byShipping).sort(byRate).sort(byPrice)});
       this.setState({resultSearch:this.state.resultSearch.sort(byShipping).sort(byRate).sort(byPrice)});
     }
     else if(this.state.sortRate) {
       this.setState({products:this.state.products.sort(byRate).sort(byPrice)});
       this.setState({resultSearch:this.state.resultSearch.sort(byRate).sort(byPrice)});
     }
     else if(this.state.sortShipping) {
       this.setState({products:this.state.products.sort(byShipping).sort(byPrice)});
       this.setState({resultSearch:this.state.resultSearch.sort(byShipping).sort(byPrice)});
     }
     else {
       this.setState({products:this.state.products.sort(byPrice)});
       this.setState({resultSearch:this.state.resultSearch.sort(byPrice)})
     }
   }
   else if(this.state.sortRate){
    if(this.state.sortShipping) {
      this.setState({products:this.state.products.sort(byShipping).sort(byRate)});
      this.setState({resultSearch:this.state.resultSearch.sort(byShipping).sort(byRate)});
    }
    else {
      this.setState({products:this.state.products.sort(byRate)});
      this.setState({resultSearch:this.state.resultSearch.sort(byRate)});

    }
   }
   else if(this.state.sortShipping){
     this.setState({products:this.state.products.sort(byShipping)})     
     this.setState({resultSearch:this.state.resultSearch.sort(byShipping)})     

    }
   this.render();

   
  }
  
  verifyAdmin() {
    var self = this;
    axios.get('/showSession', {}).then(function (res) {
      if (res.data.userType === "Admin") self.setState({isAdmin: true})
    });
  }


  searchProduct() {
    //e.preventDefault();
    var self = this;
    axios.post('productSearch',
      {
        pSearch: this.state.productSearch,
        pSort: "price",
        pAscendant: 1,

      }).then(function (res) {
        if (!res.data.success) {
          self.loadProduct();
          self.setState({displaySearch:true,productSearch:null,displayResult:false});
          //alert("No results were found in the search, showing all products!!");          
        }
        else {
          self.setState(
            {
              //products: res.data.productData
              resultSearch: res.data.productData,
              displayResult:true,
              displayAtStart:false,
            }
          )
        }
        self.state.resultSearch.sort(function (a, b) {
          return (b.totalRate - a.totalRate)
        })
        /*self.state.products.sort(function (a, b) {
          return (b.totalRate - a.totalRate)
        })
        */
      });
  };


  searchProduct2 =(productSearch)=>
   {
    var self = this;
    axios.post('productSearch',
      {
        pSearch: productSearch,
        pSort: "price",
        pAscendant: 1,

      }).then(function (res) {
        if (!res.data.success) {
          self.loadProduct();
          self.setState({displaySearch:true,productSearch:null,displayResult:false})
          //alert("No results were found in the search, showing all products!!");          

        }
        else {
          self.setState(
            {
              //products: res.data.productData
              resultSearch: res.data.productData,
              displayResult:true,
              displayAtStart:false,
            }
          )
        }
        self.state.resultSearch.sort(function (a, b) {
          return (b.totalRate - a.totalRate)
        })
        /*self.state.products.sort(function (a, b) {
          return (b.totalRate - a.totalRate)
        })
        */
      });
    }  
  


  rateProduct = (e) => {
    e.preventDefault();
    var self = this;
    if (!this.state.rateAllowed) alert("You have already voted for this product!!")
    else if (this.state.rate != 0) {
      axios.post('rateProduct', {
        pIdProduct: 12,
        pRate: this.state.rate
      }).then(function (res) {
        if (!res.data.success) {
          alert(res.data.error)
        }
        else alert('A ' + this.state.rate + ' stars rating has submited for this product');

      }).catch(err => {
        console.log(e)
      });
    }
  }

  reload (){
    window.location.reload(true);
  };

  onChange = (e) => this.setState({
    [e.target.name]:
      e.target.value
  });

  setSortValue(event) {
    if(event.target.value=="price") {(this.state.sortPrice==true)? this.state.sortPrice=false:this.state.sortPrice=true};
    if(event.target.value=="rate") {(this.state.sortRate==true)? this.state.sortRate=false:this.state.sortRate=true};
    if(event.target.value=="shipping") {(this.state.sortShipping==true)? this.state.sortShipping=false:this.state.sortShipping=true};
    this.setState({sortShipping:this.state.sortShipping});
    this.sortResults();

  }

  setSortOption(event) {
    if(event.target.name=="price") this.state.sortOptionPrice=event.target.value;
    if(event.target.name=="rate") this.state.sortOptionRate=event.target.value;
    if(event.target.name=="shipping") this.state.sortOptionShipping=event.target.value;
    this.sortResults();
  }

  renderRecommendations = () =>{
    if(this.state.productsRecomendations.length > 0){
      return(
        <>
          <h3>Based on your past purchases, we believe you would like this products</h3>
          <main className="pa3 pa5-ns flex flex-wrap">
            {
              this.state.productsRecomendations.map((p, index) => (<Product key={p._id} value={index} productData={p} isAdmin={this.state.isAdmin} blockToggle={this.blockToggle} deleteToggle={this.deleteToggle} />))
            }
          </main>
        </>
      )
    }
  }

  render() {
    var displaySortPrice=(this.state.sortPrice)? {display:true}:{display:'none'};
    var displaySortRate=(this.state.sortRate)? {display:true}:{display:'none'};
    var displaySortShipping=(this.state.sortShipping)? {display:true}:{display:'none'};
    var displayResultLabel=(this.state.displayResult)? {display:true}:{display:'none'};
    var displaySearch=(this.state.displaySearch)? {display:true}:{display:'none'};
    var resultMessage='Showing search results ';
    var searchMessage=(this.state.displayResult || this.state.displayAtStart)? "All products" : "No search results, showing all products"
    
    return (
      <div>
        {this.state.deleteWindow ? <PopUp toggle={this.deleteToggle} action={this.deleteProduct} question={"Are you sure you want to delete this package?"} /> : null}
        {this.state.blockWindow ? <PopUp toggle={this.blockToggle} action={this.blockProduct} question={"Are you sure you want to block this package?"} /> : null}
        <Header reload={this.reload} isStore={true} searchProduct2={this.searchProduct2} />
        {this.state.isAuth &&
        <Menu/>
        }
        <br/>
        <article style={{backgroundColor:'rgb(255,255,191)', 'text-align':'center',width:'30%','border-radius':'2%'}} className=" center   pa3 ba b--black-10" >
        <label>Sort results by:</label><br/> 
              <div style={{display:'inline'}}>
              <div style={{display:'flex',marginBottom:'2.5%'}}>
                <input type="checkbox" value="price" name="gender" onChange={this.setSortValue.bind(this)} /> Price
                <div style={displaySortPrice}>
                  <input style={{'margin-left':'67px'}}  type="radio" value="asc" name="price" onChange={this.setSortOption.bind(this)}/> Lower
                  <input style={{'margin-left':'10px'}}  type="radio" value="desc" name="price" onChange={this.setSortOption.bind(this)}/> Higher              
                </div>
              </div>  
              <div style={{display:'flex',marginBottom:'2.5%'}}>
                <input type="checkbox" value="rate" name="gender" onChange={this.setSortValue.bind(this)} /> Rating
                <div style={displaySortRate}>
                  <input style={{'margin-left':'56px'}} type="radio" value="asc" name="rate" onChange={this.setSortOption.bind(this)}/> Lower
                  <input style={{'margin-left':'10px'}} type="radio" value="desc" name="rate" onChange={this.setSortOption.bind(this)}/> Higher           
                </div>
              </div>  
              <div style={{display:'flex'}}>
                <input type="checkbox" value="shipping" name="gender" onChange={this.setSortValue.bind(this)} /> Shipping
                <div style={displaySortShipping}>
                  <input style={{'margin-left':'40px'}} type="radio" value="asc" name="shipping" onChange={this.setSortOption.bind(this)}/> Fast
                  <input style={{'margin-left':'25px'}} type="radio" value="desc" name="shipping" onChange={this.setSortOption.bind(this)}/> Slow         
                </div>
              </div>  
              </div> 
          </article>
          <br/><label style={displayResultLabel}>{resultMessage}</label>
          <main style={displayResultLabel} className="pa3 pa5-ns flex flex-wrap">
            {
              this.state.resultSearch.map((p, index) => (<Product key={p._id} value={index} productData={p} isAdmin={this.state.isAdmin} blockToggle={this.blockToggle} deleteToggle={this.deleteToggle} />))
            }
          </main>
          <br/>
          <label style={displaySearch}>{searchMessage}</label>
          {this.state.isAuth ? this.renderRecommendations() : null}
          <main className="pa3 pa5-ns flex flex-wrap">
            {
              this.state.products.map((p, index) => (<Product key={p._id} value={index} productData={p} isAdmin={this.state.isAdmin} blockToggle={this.blockToggle} deleteToggle={this.deleteToggle} />))
            }
          </main>
        </div>
    );
  }
}
export default Store;