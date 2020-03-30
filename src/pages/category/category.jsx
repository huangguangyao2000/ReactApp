import React from 'react';
import { Card, Table, Modal ,Icon, Button, message } from 'antd';
import AddForm from './AddForm'
import UpdateForm from './UpdateForm';
import LinkButton from '../../component/link-button/index'
import { reqCategorys, reqUpdateCategory, reqAddCategory } from '../../api';

export default class Category extends React.Component{
    state={
        categorys:[],
        subCategorys:[],
        parentId:'0',
        parentName:'',
        loading:false,
        showStatus:0
    }

    async getCategorys(parentId){
        this.setState({
            loading:true
        })

        parentId = parentId||this.state.parentId;
        const result = await reqCategorys(parentId)

        this.setState({
            loading:false
        })
        debugger
        if(result.status === 0){
            const categorys = result.data
            if(parentId === '0'){
                this.setState({
                    categorys
                })
            }else{
                this.setState({
                    subCategorys:categorys
                })
            }
        }else{
            message.error('获取链表失败')
        }
    }
    

    showCategorys(){
        this.setState({
            parentId:'0',
            parentName:'',
            subCategorys:[],
            showStatus:0
        })
    }

    showSubCates(category){
        this.setState({
            parentId:category._id,
            parentName:category.name   
        },()=>{
            this.getCategorys()   
        })
    }

    showAdd(){
        this.setState({
            showStatus:1
        })
    }
    
    showUpdate(category){
        this.category = category
        this.setState({
            showStatus:2
        })
    }
    async addCategorys(){
        const {parentId,categoryName} = this.form.getFieldsValue()
        this.setState({
            showStatus:0
        })

        this.form.resetFields()

        const result = await reqAddCategory(parentId,categoryName)
        if(result.status===0){
            if(parentId === this.state.parentId){
                this.getCategorys()
            }else if(parentId==='0'){
                this.getCategorys(parentId)
            }
        }
    }  

    async updateCategory(){
        const categoryId = this.category._id;
        const {categoryName} = this.form.getFieldsValue();
        
        this.setState({
            showStatus:0
        })

        this.form.resetFields()

        const result = await reqUpdateCategory({categoryId,categoryName})
        if(result.status===0){
            this.getCategorys()
        }
    }

    componentWillMount(){
        this.columns=[
            {
                title:'分类名称',
                dataIndex:'name'
            },
            {
                title:'操作',
                width:300,
                render:(category)=>(
                    <span>
                        <LinkButton onClick={()=>this.showUpdate(category)} style={{color:'black'}}>修改分类</LinkButton>
                        {this.state.parentId === '0'?
                        <LinkButton onClick={()=>this.showSubCates(category) } style={{color:'black'}}>查看子分类</LinkButton>:null}
                    </span>
                )
            }
        ];
    }

    componentDidMount(){
        this.getCategorys()
    }

    render(){
        const {parentId,parentName,subCategorys,loading,showStatus,categorys} = this.state;

        const category = this.category||{}

        const title = parentId === '0'?'一级分类列表':(
            <span>
                <LinkButton onClick={this.showCategorys.bind(this)}>
                <Icon type="arrow-right"/>
                <span>{parentName}</span>
                </LinkButton>
            </span>
        )
        
        const extra = <Button type='primary' onClick={this.showAdd.bind(this)}>
            <Icon type='plus'/>添加
        </Button>

        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={parentId==='0'?categorys:subCategorys}
                    columns={this.columns}
                    loading={loading}
                    pagination={{pageSize:5,showQuickJumper:true,showSizeChanger:true}}
                />
                <Modal
                    title="添加分类"
                    visible={showStatus===1}
                    onOk = {this.addCategorys.bind(this)}
                    onCancel = {()=>this.setState({showStatus:0})}
                    okText = "确定"
                    cancelText = "取消"
                >
                    <AddForm
                        categorys={categorys}
                        parentId={parentId}
                        setForm={form=>this.form=form}
                    />
                </Modal>
                <Modal
                    title="修改分类"
                    visible={showStatus===2}
                    onOk = {this.updateCategory.bind(this)}
                    onCancel = {()=>{
                        this.setState({showStatus:0})
                        this.form.resetFields()    
                }    
                }
                    okText = "确定"
                    cancelText = "取消"
                >
                    <UpdateForm
                        categoryName={category.name}
                        setForm={form=>this.form=form}
                    />
                </Modal>
            </Card>
        )
    }

}