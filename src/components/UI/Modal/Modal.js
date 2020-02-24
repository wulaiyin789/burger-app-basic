import React, { Component } from 'react';

import classes from './Modal.css';

import Aux from '../../../hoc/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        // if(nextProps.show !== this.props.show) {
        //     return true;
        // }

        // The reason why the spinner didn't show, it's because the Modal doesn't update and show due to
        // basically only update the component if the show state changed. Here however, the children of 
        // the component simply change to props.children.changed, we're passing a new child and the spinner
        // instead of orderSummary.
        return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
    }

    componentWillUpdate() {
        console.log('[Modal] WillUpdate');
    }

    render() {
        return (
            <Aux>
                <Backdrop 
                    show={this.props.show} 
                    clicked={this.props.modalClosed} />
                <div 
                    className={classes.Modal}
                    style={{
                        transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
                        opacity: this.props.show ? '1' : '0'
                    }}>
                    
                    {this.props.children}
                </div>
            </Aux>
        );
    }
};

export default Modal;