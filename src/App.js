import {Component} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

import './App.css'

class App extends Component {
  state = {
    cartList: [],
  }

  //   TODO: Add your code for remove all cart items, increment cart item quantity, decrement cart item quantity, remove cart item
  removeAllCartItems = () => {
    this.setState({cartList: []})
  }

  decrementCartItemQuantity = id => {
    const {cartList} = this.state
    const itemIndex = cartList.findIndex(each => each.id === id)
    // findIndex method is used as we don't want to change index of array while updating List item
    // if we use filter and spread(...) method to update list than update item added at the last
    // which is not seems appropriate
    if (cartList[itemIndex].quantity > 1) {
      cartList[itemIndex].quantity -= 1
    } else {
      cartList.splice(itemIndex, 1)
    }
    this.setState({cartList})
  }

  incrementCartItemQuantity = id => {
    this.setState(prevState => ({
      cartList: prevState.cartList.map(eachCartItem => {
        if (id === eachCartItem.id) {
          const updatedQuantity = eachCartItem.quantity + 1
          return {...eachCartItem, quantity: updatedQuantity}
        }
        return eachCartItem
      }),
    }))
  }

  removeCartItem = id => {
    const {cartList} = this.state
    const filteredCartList = cartList.filter(each => each.id !== id)
    this.setState({cartList: filteredCartList})
  }

  addCartItem = product => {
    //   TODO: Update the code here to implement addCartItem
    const {cartList} = this.state
    const isItemAvailable = cartList.find(each => each.id === product.id)
    if (isItemAvailable === undefined) {
      this.setState(prevState => ({cartList: [...prevState.cartList, product]}))
    } else {
      const itemTotalQuantity = isItemAvailable.quantity + product.quantity
      // findIndex method is used as we don't want to change index of array while updating List item
      // if we use filter and spread(...) method to update list than update item added at the last
      // which is not seems appropriate
      /* i.e 
        const filteredCartList = cartList.filter(each => each.id !== product.id)
      const finalCartList = [
        ...filteredCartList,
        {...product, quantity: itemTotalQuantity},
      ]
      this.setState({cartList: finalCartList})
    */
      const itemIndex = cartList.findIndex(each => each.id === product.id)
      cartList[itemIndex].quantity = itemTotalQuantity
      this.setState({cartList})
    }
  }

  render() {
    const {cartList} = this.state
    // console.log(cartList)
    return (
      <CartContext.Provider
        value={{
          cartList,
          removeAllCartItems: this.removeAllCartItems,
          addCartItem: this.addCartItem,
          removeCartItem: this.removeCartItem,
          decrementCartItemQuantity: this.decrementCartItemQuantity,
          incrementCartItemQuantity: this.incrementCartItemQuantity,
        }}
      >
        <Switch>
          <Route exact path="/login" component={LoginForm} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/products" component={Products} />
          <ProtectedRoute
            exact
            path="/products/:id"
            component={ProductItemDetails}
          />
          <ProtectedRoute exact path="/cart" component={Cart} />
          <Route path="/not-found" component={NotFound} />
          <Redirect to="not-found" />
        </Switch>
      </CartContext.Provider>
    )
  }
}

export default App
