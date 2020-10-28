import React, { Component } from 'react';
import { faArrowAltCircleLeft, faArrowAltCircleRight, faCartPlus, faBoxTissue } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ProductPage.css"
import Menu from '../../pages/Profile/Menu';
import Header from '../../Header';
import ReactStars from 'react-rating-stars-component';
import axios from 'axios';
import Comment from "../../pages/Comment/Comment";
import Product from "../../pages/Store/Product"


class ProductPage extends Component{

    state={
        productRecommendations: [],
        userId: null,
        buttonRate: true,
        buttonComment:true,
        buttonShop:false,
        rate: 0,
        rateAllowed: true,
        customerUserName:null,
        customerFullName:null,
        commentDescription:'',
        productComments:[],
        imageNumber:0,
        totalImages:0,
        isAuth: true,
    }

    constructor(props){
        super(props);
        this.textArea=React.createRef();
        //this.state.imageNumber=0;
        //this.state.totalImages=this.props.location.state.product.image.length;
    }

    componentDidMount(){
        this.setState({imageNumber:0,totalImages:this.props.location.state.product.image.length})
        var self=this;
        axios.get('/showSession').then(function(res){
            if(res.data.loggedIn) {
                self.setState({buttonRate:true,buttonComment:true,isAuth:true,
                    customerUserName:res.data.userName,customerFullName:res.data.fullName,userId:res.data._id});
                if (self.props.location.state.product.isAvailable) self.setState({buttonShop:true});
            }
            
            else self.setState({buttonRate:false,buttonComment:false,buttonShop:false,isAuth:false});
        });
        this.loadProductComments();
        this.loadProductRecommendations();
    }

    loadProductComments (){
        var self=this;
        axios.post('/productComments',{                
            productId: this.props.location.state.product._id
        }).then(function(res){
            if(res.data.error)alert(res.data.error)
            else self.setState({productComments:res.data})
        })  
      }

      loadProductRecommendations (){
        var self=this;
        axios.post('/getProductRecommendations',{                
            productId: this.props.location.state.product._id
        }).then(function(res){
            if(res.data.error)alert(res.data.error)
            else {
                console.log("El resultado de la consulta es:"+res.data);
                res.data.map(member=>{
                    axios.post('/getProduct',{
                        id:member.idProduct
                    }).then(function (res){
                        var aux=self;
                        if ((res.data.product._id != aux.props.location.state.product._id)){
                            if(!self.state.productRecommendations.find(element=>element._id==res.data.product._id)) self.setState({productRecommendations:[...self.state.productRecommendations,res.data.product]})
                            
                        }
                    })
                })
            }
        })  
      }

    rateProduct = (e) => {
        e.preventDefault();
        var self = this;
        if (this.state.rate != 0 && this.state.rateAllowed) {
          axios.post('/rateProduct', {
            pIdProduct: this.props.location.state.product._id,
            pRate: this.state.rate,
            customerUserName: this.state.customerUserName
          }).then(function (res) {
            if (!res.data.success) {
              alert(res.data.error)
              self.setState({buttonRate:false,rateAllowed:false})              
            } else {
                alert('A ' + self.state.rate + ' stars rating has submited for this product,thank you!!');
                self.setState({buttonRate:false,rateAllowed:false})
            }
            });

        } else if (this.state.rate==0) alert("Please select a rating star for this product!!");
        else alert("A rating for this product have already registered, you can´t vote twice!!");
      }

    addToShoppingCart = (e) => {
        e.preventDefault();
        axios.post('/addToShoppingCart',{ 
            id: this.state.userId,
            productId: this.props.location.state.product._id
        }).then(res => {
            if(!res.data.success){
                alert(res.data.err);
            } else {
                alert("Product added to cart!!");
            }
        })
    }

    changeImage =(e)=>{
        //e.preventDefault();
        var total=this.state.totalImages;
        if(e.target.name=="left-arrow") {
            if(this.state.imageNumber>0) this.state.imageNumber--;
        }
        else {
            if(this.state.imageNumber<total-1) this.state.imageNumber++;
        }
        this.setState({imageNumber:this.state.imageNumber});
    }

      commentProduct = (e) => {
        e.preventDefault();
        var self = this;
        if (this.state.commentDescription != '') {
          axios.post('/commentProduct', {
            productId: this.props.location.state.product._id,
            customerUserName: this.state.customerUserName,
            customerFullName: this.state.customerFullName,
            comment: this.state.commentDescription,
          }).then(function (res) {
            if (!res.data.success) alert("The comment cannot exceed 1000 characters")
            else {
                self.loadProductComments();
                self.textArea.current.value="";
            }
        });
        } else if (this.state.commentDescription=='') alert("Please enter a comment for the product!!");
      }

      onChange = (e) => this.setState({[e.target.name]:
        e.target.value}); 

    render(){
        const {_id, title, description, price, stock, shipmentInfo, image,productPic,totalRate,rate} = this.props.location.state.product
        const starPercentajeRounded=`${(totalRate /5)*100}%`
        var totalOpinions = 0;
        for (var i=0;i<rate.length;i++){
            totalOpinions+=rate[i].value;
        }
        const divStyle={
          width: starPercentajeRounded,
        }
        const rateStyle=(this.state.buttonRate)? {display:true}:{display:'none'};
        const displayCommentButton=(this.state.buttonComment)? true:'none';
        const displayShoppingButton=(this.state.buttonShop)? true:'none';
        const displayLeftArrow=(this.state.imageNumber>0)? {display:true}:{display:'none'};
        const displayRightArrow=(this.state.imageNumber<this.state.totalImages-1)? {display:true}:{display:'none'};
        const numberImage=this.state.imageNumber;
        const displayRecommendatios = (this.state.productRecommendations.length!=0)? {display:true}:{display:'none'}; 
        return(
            <div>
                <Header/>
                {this.state.isAuth &&
                    <Menu/>
                }
                <link href="https://fonts.googleapis.com/css2?family=Mukta:wght@500&family=Ubuntu&display=swap" rel="stylesheet"></link>
                <div>
                    <div className="img-container">
                        <div style={displayLeftArrow}>
                        <input type="button" className="arrow" id="left-arrow" name="left-arrow" onClick={this.changeImage}/>
                        <label for="left-arrow" className="arrow-btn">
                            {<FontAwesomeIcon className="arrow-icon" icon={faArrowAltCircleLeft} size="3x"/>}
                        </label>
                        </div>
                        {/*{this.displayMedia(image[this.state.imageNumber])}*/}
                        {image[numberImage].imageData.includes(".mp4") 
                            ? <video width="100%" controls>
                                <source src={"/../"+image[numberImage].imageData} type="video/mp4"/>
                              </video>       
                            :<img src={"/../"+image[numberImage].imageData} className="product-image"/>                                             
                        }
                        <div style={displayRightArrow} >
                        <input type="button" className="arrow" id="right-arrow" name="right-arrow" onClick={this.changeImage}/>
                        <label for="right-arrow" className="arrow-btn">
                            {<FontAwesomeIcon className="arrow-icon" icon={faArrowAltCircleRight} size="3x"/>}
                        </label>
                        </div>
                    </div>
                    <div className="top-container">
                        <div className="top-container-text">
                            <h1 className="title">{title}</h1>
                            <h2 className="top-text">$ {price}</h2>
                            <h3 className="top-text">Disponibles: {stock}</h3>
                            <h3 className="top-text">Delivery: {shipmentInfo}</h3>
                            <div style={{display:displayShoppingButton}}>
                            <input type="button" className="cartBtn" id="addCart" onClick={this.addToShoppingCart}/>
                            <label for="addCart">
                                Add to shopping cart           
                                {<FontAwesomeIcon className="cart-icon" icon={faCartPlus} size="2x"/>}
                            </label>
                            </div> 
                        </div>        
                    </div>
                </div>
                <div className="below-container">
                    <h2 className="description">Description:</h2>
                    <p className="description">{description}</p>
                </div>
                <div className="below-container">
                    <h2 className="description">Total product rating: {totalRate}</h2>
                    <p className="description" >Based on {totalOpinions} reviews</p>
                    <br></br>
                    <div className="star">
                        <div  class="stars-outer2">
                            <div class="stars-inner2" style={divStyle}></div>
                        </div> 
                    </div>
                </div>
                <div className="below-container" style={rateStyle}>
                    <h2 className="description">Rate this product</h2>
                    <div class="star">
                    <form className="description" onSubmit={this.rateProduct} style={{display:'inline'}}>
                        <ReactStars id='starContainer'
                        size={40}
                        half={false}
                        onChange={newRating => { console.log(newRating) }, newRating => this.state.rate = newRating}
                    />
                        <button type="submit" className="cartBtn2" id="rateProduct"/>
                        <label for="rateProduct">Rate </label> 
                        <br></br>
                     </form>
                     </div>
                    <br></br>
                </div>
                <div className="below-container" >
                    <h2 className="description">Product Comments:</h2>
                    {this.state.productComments.length==0 &&
                        <p className="description" >There are no comments for this product!!</p>
                    }
                    {this.state.productComments.length!=0 &&
                    <main className="pa3 pa5-ns flex flex-wrap">
                    {
                        this.state.productComments.map((p, index) => (<Comment key={p._id} value={index} commentData={p} />))
                    }
                    </main>
                    }
                </div>
                    <article style={{display:displayCommentButton, backgroundColor:'rgb(255,255,191)', 'text-align':'left',width:'800px','margin-bottom':'2%','border-radius':'2%'}} className=" center   pa3 ba b--black-10" id={12}>
                        <div>
                            <p >Please enter a new comment here</p>  
                            <br/>
                            <textarea ref={this.textArea} style={{ backgroundColor:'rgb(255,255,230)',width:'100%',height:'100px'}}type='text' onChange={this.onChange} name='commentDescription'/>
                        </div>
                    </article>
                    <br></br>
                    <form className="" onSubmit={this.commentProduct} >
                    <div class="star" style={{display:displayCommentButton}}>
                    <button type="submit" className="cartBtn2" id="commentProduct"/>
                        <label for="commentProduct">
                            Add comment             
                        </label>                         
                    <br></br>
                    </div>
                    <div style={displayRecommendatios}className="below-container" >
                    <h2 className="" style={displayRecommendatios}>Users who bought this also purchase these others products</h2>
                    <main style={displayRecommendatios} className="pa3 pa5-ns flex flex-wrap">
                    {
                        this.state.productRecommendations.splice(6),
                        this.state.productRecommendations.map((p, index) => (<Product key={p._id} value={index} productData={p} isAdmin={this.state.isAdmin} blockToggle={this.blockToggle} deleteToggle={this.deleteToggle} />))
                    }
                    </main>
                </div>
                    </form>
            </div>
        )
    }
}

export default ProductPage; 