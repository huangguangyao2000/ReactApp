import React from 'react';
import {Switch,Route,Redirect} from 'react-router-dom'
import ProductHome from './home'
import ProductAddUpdate from './add-update'

export default class Product extends React.Component{

   render(){
         return (
         	<Switch>
         		<Route path='/product' exact component={ProductHome}/>
         		<Route path='/product/addUpdate' component={ProductAddUpdate}/>
         		<Redirect to='/product'/>
         	</Switch>
)}
}
