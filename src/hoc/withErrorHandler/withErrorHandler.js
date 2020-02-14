import React, { Component } from 'react';

import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Aux';

const withErrorHandler = ( WrappedComponet, axios ) => {
    return class extends Component {
        // Constructor() {
        //     axios.interceptors.request.use(req => {
        //         // Call this setState and clear any errors, therefore whenever I send a request
        //         // I don't have my error set up anymore
        //         this.setState({ error: null });
        //         return req;
        //     }) 
        //     axios.interceptors.response.use(res => res, error => {
        //         this.setState({ error: error });
        //     }) 
        // }

        state = {
            error: null
        }

        // Constructor can be used to do exactly the same way
        componentWillMount() {
            this.reqInterceptors = axios.interceptors.request.use(req => {
                // Call this setState and clear any errors, therefore whenever I send a request
                // I don't have my error set up anymore
                this.setState({ error: null });
                return req;
            }) 
            this.resInterceptors = axios.interceptors.response.use(res => res, error => {
                this.setState({ error: error });
            }) 
        }

        componentWillUnmount() {
            // Test ONLY for the topic of memory leak (213)
            // console.log('Will Unmount', this.reqInterceptors, this.resInterceptors);
            axios.interceptors.request.eject(this.reqInterceptors);
            axios.interceptors.response.eject(this.resInterceptors);
        }

        errorConfirmedHandler = () => {
            this.setState({ error: null });
        }
        
        render() {
            return (
                // WrappedComponet {...props}: 
                // Distribute any props this component  might receive on it
                // Because I don't know these props but definitely don't want to lose it
                <Aux>
                    <Modal 
                    show={this.state.error}
                    // Because the Modal component we created also exposes the clicked property
                    // which occurs when we click the Backdrop, so I also want to clear the error and get rid of the error
                    modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponet {...this.props} />
                </Aux>
            );
        }
    }
};

export default withErrorHandler;