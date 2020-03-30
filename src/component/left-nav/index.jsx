import React from 'react';
import { withRouter } from 'react-router';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import menuConfig from '../../config/menuConfig'
import img from '../../assets/images/logo.png';
import './index.less'
import memoryUtils from '../../utils/memoryUtils';

// import {setHeadTitle} from '../../redux/actions'
// import {connect} from 'react-redux'

const { SubMenu } = Menu;
class LeftNav extends React.Component {

    getMenuNodes = (menuConfig) => {

        const path = this.props.location.pathname;
        // if(path === '/'){
        //     this.props.setHeadTitle('首页');
        // }
        return menuConfig.reduce((pre, item) => {
            if(this.hasAuth(item)){
            if (!item.children) {

                // if(item.key === path || path.indexOf(item.key)===0){
                //     this.props.setHeadTitle(item.title);
                // }

                pre.push((
                    <Menu.Item key={item.key}>
                        {/* <Link to={item.key} onClick={()=>this.props.setHeadTitle(item.title)}> */}
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                ))
            } else {

                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0);

                if(cItem){
                    this.openKey = item.key;
                }

                pre.push((
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                ))
            }
        }
            return pre;
        }, [])

    }
    getMenuNodes2 = (menuList) => {
        // 得到当前请求的 path
        return menuList.map(item => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                return (
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }

    hasAuth = (item)=>{
        const key = item.key;
        const menuSet = this.menuSet;

        if(item.isPubilc || memoryUtils.user.username==='admin' || menuSet.has(key)){
            return true;
        }else if(item.children){
            return !!item.children.find(child=>menuSet.has(child.key));
        }
        return false;
    }

    
    componentWillMount(){
        this.menuNodes = this.getMenuNodes(menuConfig);
        this.menuSet = new Set(memoryUtils.user.role.menus || []);
    }

    render() {

        let selectKey = this.props.location.pathname;
        console.log('render()',selectKey);
        if(selectKey.indexOf('/product') === 0){
            selectKey = '/product';
        }
        const openKey = this.openKey;
        return (
            <div className='leftnav-logo'>
                <Link to='/home' className="leftnav-link">
                    <img src={img} alt="logo"/>
                    <h1>图书管理</h1>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[selectKey]}
                    defaultOpenKeys={[openKey]}
                >
                    {this.menuNodes}
                </Menu>
            </div>
        )
    }

}

// export default connect(
//     state => ({user:state.user}),
//     {setHeadTitle}
// )(withRouter(LeftNav))
export default withRouter(LeftNav)
