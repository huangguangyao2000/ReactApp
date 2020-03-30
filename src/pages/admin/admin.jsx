import React, { Component } from 'react';
import {Redirect, Route,Switch} from 'react-router-dom';
import memoryUtils from '../../utils/memoryUtils'
import {Layout} from 'antd'
import LeftNav from '../../component/left-nav';
import Header from '../../component/header';

import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'

const {Footer,Sider,Content} = Layout;
export default class Admin extends Component {
  render() {
      const user = memoryUtils.user;
      if(!user._id){
        return <Redirect to='/login'/>
      }
      return (
          <Layout style={{height:'100%'}}>
            <Sider>
              <LeftNav/>
            </Sider>
            <Layout>
              <Header/>
              <Content style={{backgroundColor: 'gainsboro'}}>
                <Switch>
                    <Route path="/home" component={Home}/>
                    <Route path='/category' component={Category}/>
                    <Route path='/product' component={Product}/>
                    <Route path='/role' component={Role}/>
                    <Route path='/user' component={User}/>
                    <Redirect to='/home' />
                </Switch>
                </Content>
              <Footer/>
            </Layout>
          </Layout>
      );
  }
}
