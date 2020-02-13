import React, { Component } from 'react';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';

// Typically name constants you want to use as global constants in all capital characters
const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {

    // constructor(props) {
    //     super(props);
    //     this.state = {}
    // }

    state = {
        // ingredients: {  // This is an oject
        //     salad: 0,
        //     bacon: 0,
        //     cheese: 0,
        //     meat: 0,
        // },
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        // Purchase Mode
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount() {
        // No error mode if .json deleted because componetDidMount is called 
        // after all child component have been rendered, which means afte componentDidMount was completed in the child component
        axios.get('https://react-my-burger-d4f53.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ ingredients: response.data });
            })
            .catch(error => {
                this.setState({ error: true });
            });
    }

    updatePurchaseState(ingredients) {
        // A copy of state, however this cause outdated version. 
        // (ORDER ME button enable after adding two ingredients instead of one)
        // const ingredients = {
        //     ...this.state.ingredients
        // }
        // Create constant and an array of string entries (salad, bacon, ...) (["salad", "bacon", "cheese", "meat"])
        const sum = Object.keys(ingredients)
            // Get each string entry value ([0, 0, 0, 0])
            .map(igKey => {
                return ingredients[igKey];
            }).reduce((sum, el) => {
                return sum + el;
            }, 0);

        console.log(sum);

        this.setState({ purchasable: sum > 0 });
    }

    addIngredientHandler = (type) => {
        // Access the old count
        const oldCount = this.state.ingredients[type];
        // Calcuate the updated count and + 1
        const updatedCount = oldCount + 1;
        // Update ingredients
        const updatedIngredients = {
            // State should be updated in immutable way
            ...this.state.ingredients
        };
        // Access the type for which I have to update the ingredients
        // and set the count, the value which is just the amount of ingredients = to updatedCount
        updatedIngredients[type] = updatedCount;

        // Price add
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        // Set both ingredients and prices
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
        this.updatePurchaseState(updatedIngredients);
        // console.log(this.updatePurchaseState(updatedIngredients));

    }

    removeIngredientHandler = (type) => {
        // Access the old count
        const oldCount = this.state.ingredients[type];

        // Fix the negative count
        if(oldCount <= 0) {
            return;
        }

        // Calcuate the updated count and + 1
        const updatedCount = oldCount - 1;
        // Update ingredients
        const updatedIngredients = {
            // State should be updated in immutable way
            ...this.state.ingredients
        };
        // Access the type for which I have to update the ingredients
        // and set the count, the value which is just the amount of ingredients = to updatedCount
        updatedIngredients[type] = updatedCount;

        // Price add
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        // Set both ingredients and prices
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
        this.updatePurchaseState(updatedIngredients);
        // console.log(this.updatePurchaseState(updatedIngredients));
    }

    purchaseHandler = () => {
        this.setState({ purchasing: true });
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        // this.setState({ loading: true });
        // const order = {
        //     ingredients: this.state.ingredients,
        //     price: this.state.totalPrice,
        //     customer: {
        //         name: 'Peter Wu',
        //         address: {
        //             street: 'BrisStreet',
        //             zipCode: '4000',
        //             country: 'Australia'
        //         },
        //     email: 'test1@gmail.com'
        //     },
        //     deliveryMethod: 'ASAP'
        // }

        // axios.post('/orders.json', order)
        //     .then(response => {
        //         this.setState({ loading: false, purchasing: false });
        //     }).catch(error => {
        //         this.setState({ loading: false, purchasing: false });
        //     });
        // alert('You Continued!');
        
        const queryParams = [];
        for(let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price=' + this.state.totalPrice);
        const queryString = queryParams.join('&');

        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    }

    render() {

        const disabledInfo = {
            ...this.state.ingredients
        };

        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }

        let orderSummary = null;
        // Default the burger is a spinner
        let burger = this.state.error ? <p style={{textAlign: 'center'}}>Ingredients cannot be loaded</p> : <Spinner />;

        // Basically the ingredients is not null then loaded the following
        if(this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls 
                        ingredientAdded={this.addIngredientHandler} 
                        ingredientRemoved={this.removeIngredientHandler} 
                        disabled={disabledInfo} 
                        purchasable={this.state.purchasable}
                        ordered={this.purchaseHandler}
                        price={this.state.totalPrice} />
                </Aux>
            );
            
            // Same as the burger since this uses the ingredients as well
            orderSummary = <OrderSummary 
            ingredients={this.state.ingredients} 
            price={this.state.totalPrice.toFixed(2)}
            purchaseCancelled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler} />;
        }
        
        // Overwrite this again if loading is set
        if(this.state.loading) {
            orderSummary = <Spinner />
        };

        // {salad: true, meat: false, ...}

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);