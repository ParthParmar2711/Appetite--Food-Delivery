import React, { useReducer, useContext, createContext } from 'react';

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case "ADD":
            // Add a new item to the cart
            return [...state, { 
                id: action.id, 
                name: action.name, 
                qty: action.qty, 
                size: action.size, 
                price: action.price 
            }];
        
        case "REMOVE":
            // Remove an item from the cart
            let newArr = [...state];
            newArr.splice(action.index, 1);
            return newArr;

        case "UPDATE":
            // Update the quantity and price of an existing item
            return state.map((food) => {
                if (food.id === action.id && food.size === action.size) {
                    return { 
                        ...food, 
                        qty: parseInt(food.qty) + parseInt(action.qty), 
                        price: food.price + action.price 
                    };
                }
                return food;
            });
        
        case "DROP":
            return [];

        default:
            console.log("Error in Reducer");
            return state;
    }
};


export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, []);

    return (
        <CartDispatchContext.Provider value={dispatch}>
            <CartStateContext.Provider value={state}>
                {children}
            </CartStateContext.Provider>
        </CartDispatchContext.Provider>
    )
};

export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);
