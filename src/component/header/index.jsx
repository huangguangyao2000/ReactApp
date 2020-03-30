import {reqWeather} from '../../api/index.js'
import React from 'react';
import './index.less'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { withRouter } from 'react-router';
import { formateDate } from '../../utils/dateUtils.js';
import LinkButton from '../link-button/index.jsx';
import { Modal } from 'antd';
// import {connect} from 'react-redux'

class Header extends React.Component{

    state={
        cityName:'',
        temperature:'',
        weather:'',
        sysTime:formateDate(Date.now())
    }


    getWeather= async ()=>{ 
        const {weather,temperature,cityName} = await reqWeather('beijing')
        this.setState({
            weather,
            temperature,
            cityName
        })
    }
    logOut() {
        Modal.confirm({
            content:'确认退出登陆？',
            onOk:()=>{
                console.log('OK');
                storageUtils.removeUser();
                memoryUtils.user={}
                this.props.history.replace('/login')
            },
            onCancel:()=>{
                console.log('已取消');
            }
        })
    }

    getSysTime(){
        this.timeInterval = setInterval(()=>{
            this.setState({
                sysTime:formateDate(Date.now())
            })
        },1000)
    }
    
    clearInterval(){
        clearInterval(this.timeInterval)
    }
    render(){
        const user = memoryUtils.user;
        return (
            <div className="header">
                <div className="header-left">
                    <span>{this.state.sysTime} </span>
                    <span>{this.state.cityName} {this.state.weather}  {this.state.temperature}℃ </span>
                </div>
                <div className="header-right">
                    <span>{user.username}</span>
                    <LinkButton onClick={this.logOut}>退出</LinkButton>
                </div>
            </div> 
        )
    }
    componentDidMount(){
        this.getWeather();
        this.getSysTime();
    }
    componentWillUnmount(){
        this.clearInterval();
    }
}
export default withRouter(Header)