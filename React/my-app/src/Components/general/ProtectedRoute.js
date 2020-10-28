import React, { Component } from 'react';
import { Route, Redirect } from 'react-router';

function ProtectedRoute({component: Component,authed, ...rest}){
    console.log("el estafo en el protectedRoute es: "+authed)

    return (
        <Route 
        {...rest}
        render={(props)=>authed
        ? <Component {...props}/>
        : <Redirect to={{pathname: '/login',state: {from:props.location}}}/>
        }
        />
    )
}

export default ProtectedRoute;
