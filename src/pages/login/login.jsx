import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import './login.less'
import img from '../../assets/images/logo.png';
import {message} from 'antd';
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { reqLogin } from '../../api';
import {Redirect} from 'react-router-dom'

class login extends Component {
    
    SubmitHandle(e){
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const {username, password} = values;
                const result = await reqLogin(username,password);
                if(result.status===0){
                    message.success('Success',2);
                    const user = result.data;
                    console.log(result)
                    memoryUtils.user = user;
                    storageUtils.saveUser(user);
                    this.props.history.replace('/');
                }else{
                   message.error(result.msg)
                }
            } else {
            console.log(err)
            }
        })
        }
    validator(rule,value,callback){
        const length = value && value.length;
        const pwdReg = /^[a-zA-Z0-9_]+$/;
        if (!value) {
            callback('必须输入密码')
            } else if (length < 4) {
            callback('密码必须大于 4 位')
            } else if (length > 12) {
            callback('密码必须小于 12 位')
            } else if (!pwdReg.test(value)) {
            callback('密码必须是英文、数组或下划线组成')
            } else {
            callback() 
        }
    }
    render() {
         if(memoryUtils.user&&memoryUtils.user._id){
             return <Redirect to="/"/>
        }
        const {getFieldDecorator} =  this.props.form;
        return (
            <div className="login">
                <header className="login-header">
                    <img src={img} alt="logo"/>
                    <h1>React后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>
                        用户登陆
                    </h2>
                    <Form onSubmit={this.SubmitHandle.bind(this)}>
                        <Form.Item>
                            {
                                 getFieldDecorator("username",{
                                    rules:[
                                        {required:true,whitespace:true,message:'请输入用户名'},
                                        {min:4,message:"长度需大于4"},
                                        {max:12,message:"长度需小于12"},
                                        {pattern:/^[a-zA-Z0-9_]+$/,message:"用户名必须由英文、数组或下划线组成"}
                                    ]
                                })(
                                    <Input
                                    prefix={<Icon type="user" style={{ color: '#2d3338' }} />}
                                    placeholder="Username"
                                    />
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            {
                                getFieldDecorator("password",{
                                    rules:[
                                        {validator:this.validator}
                                    ]
                                })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: '#2d3338' }} />}
                                    type="password"
                                    placeholder="Password"
                                />
                                )
                            }
                            
                        </Form.Item>
                        <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                                </Button>
                        </Form.Item>
                    </Form>
                </section>
                
            </div>
        );
    }
}

export default Form.create()(login)
