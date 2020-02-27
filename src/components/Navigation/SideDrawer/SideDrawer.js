import React from 'react';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './SideDrawer.css';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Aux from '../../../hoc/Auxiliary';

const sideDrawer = (props) => {
    // ... Do something. Basically want to conditionally attach different css classes
    // to make sure we play some animation when the drawer is shown
    let attachClasses = [classes.SideDrawer, classes.Close];

    if(props.open) {
        attachClasses = [classes.SideDrawer, classes.Open];
    }

    // Can't pass the an array of strings but should pass a single string
    return (
        <Aux>
            <Backdrop show={props.open} clicked={props.closed} />
            <div className={attachClasses.join(' ')}>
            <div className={classes.Logo}>
                <Logo />
            </div>  
            <nav>
                <NavigationItems />
            </nav>
        </div>
        </Aux>
    );
};

export default sideDrawer;