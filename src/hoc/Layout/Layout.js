import React, { Component } from 'react';

import Aux from '../Aux';
import classes from './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {

    // To manage the visiblity of the sideDrawer
    state = {
        showSideDrawer: false
    }

    sideDrawerCloseHandler = () => {
        this.setState({ showSideDrawer: false });
    }

    sideDrawerToggleHandler = () => {
        // this.setState({ showSideDrawer: !this.state.showSideDrawer });
        // The above have a flaw. If you plan on using the state, insert state, you shouldn't do like
        // this, because due to the asynchronous nature of set state, this may lead to unexpected outcome.
        // Instead use the function form.
        this.setState((prevState) => {
            return {showSideDrawer: !this.state.showSideDrawer};
        });
    }

    render () {
        return (
            <Aux>
                <Toolbar drawerToggleClicked={this.sideDrawerToggleHandler} />
                <SideDrawer 
                    open={this.state.showSideDrawer} 
                    closed={this.sideDrawerCloseHandler} />
                <main className={ classes.Content }>
                    { this.props.children }
                </main>
            </Aux>
        )   
    }
};

export default Layout;