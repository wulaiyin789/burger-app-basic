import React from 'react';

import classes from './BuildControls.css';
import BuildControl from './BuildControl/BuildControl';

const controls = [
    { label: 'Salad', type: 'salad' },
    { label: 'Bacon', type: 'bacon' },
    { label: 'Cheese', type: 'cheese' },
    { label: 'Meat', type: 'meat' },
];

const buildControls = (props) => (
    <div className={classes.BuildControls}>
        <p>Current Price: <strong>{props.price.toFixed(2)}</strong></p>

        {controls.map((ctrl) => (
            <BuildControl 
            key={ctrl.label} 
            label={ctrl.label}

            // Keep track of which type this build control has
            // type={ctrl.type} -> Unnecessary Extra Loop
            // Pass it to the individual build control we have 
            added={() => props.ingredientAdded(ctrl.type)} 
            removed={() => props.ingredientRemoved(ctrl.type)} 

            // Pass this information to the individual build control to let it know 
            // if it should disable the button or not
            disabled={props.disabled[ctrl.type]} />
        ))}

        <button 
            className={classes.OrderButton} 
            disabled={!props.purchasable}
            onClick={props.ordered}>ORDER NOW</button>
    </div>
);

export default buildControls;