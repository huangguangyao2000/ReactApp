import React from 'react';
import {Card,Table,message,Button,Select,Input} from 'antd'
import {reqUpdateProductStatus,reqProducts,reqSearchProducts} from '../../api/index'
import {PAGE_SIZE} from '../../utils/constants'

export default class ProductHome extends React.Component{

  	state={
  		total:0,
  		products:[],
  		searchType:'productName',
  		searchName:''  		
  	}

  	initColumns = ()=>{
  		this.columns=[
  		{
  			title:'书籍名称',
  			dataIndex:'name'
  		},
  		{
  			title:'书籍描述',
  			dataIndex:'desc'
  		},
  		{
  			title:'可借阅天数',
  			dataIndex:'date',
  			render:(date)=><span>{date}</span>
  		},
  		{
  			title:'状态',
  			width:200,
  			//dataIndex:'status',
  			render:(product)=>{
				const {status, _id} = product
				const newStatus = status===1 ? 2 : 1
				return (
				  <span>
					<span>{status===1 ? '在售' : '已下架'}</span>
					<Button
					  type='primary'
					  onClick={() => this.updateProductStatus(_id, newStatus)}
					>
					  {status===1 ? '下架' : '上架'}
					</Button>
				  </span>
				)
			  }
  		},
  		{
  			title:'操作',
  			width:100,
  			render:(product)=>(
  				<span>
  					<link-button onClick={()=>this.props.history.push('/product/addupdate',product)}>
  					修改</link-button>
  				</span>
  				)
  		},
  		]
  	}

  	updateProductStatus=async (productId,status)=>{
  		const result = await reqUpdateProductStatus(productId,status);
  		if (result.status===0) {
  			message.success('书籍状态更改成功')
  			this.getProducts(this.pageNum||1)
  		}
  	}

  	getProducts = async (pageNum)=>{
  		this.pageNum = pageNum;
  		const {searchType,searchName} = this.state;
  		let result;
  		if(searchName){
  			result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchType,searchName})
  		}else{
  			result = await reqProducts(pageNum,PAGE_SIZE)
  		}
  		console.log(result);
  		if(result.status === 0){
  			const {total,list} = result.data;
  			this.setState ({
  				total,
  				products:list
  			})
  		}
  	}

  	componentWillMount(){
  		this.initColumns();
  	}
  	componentDidMount(){
  		this.getProducts(1);
  	}


    render(){

    	const {total,products,searchType} = this.state;

    	const title = (
    		<span>
    			<Select value={searchType} onChange={value=>this.setState({searchType:value})}>
    				<Select.Option key='productName'>按名称搜索</Select.Option>
    				<Select.Option key='productDesc'>按描述搜索</Select.Option>
    			</Select>
    		<Input style={{width:150,marginLeft:10,marginRight:10}} placeholder='关键字'
    			onChange={(e)=>{
    				this.setState({searchName:e.target.value})
    			}}
    		/>
    		<Button type='primary' onClick={()=>this.getProducts(1)}>搜索</Button>
    		</span>
    		)
    	const extra = (
    		<Button type="primary" style={{float:'right'}} onClick={()=>this.props.history.push('/product/addupdate')}>
    		添加书籍
    		</Button>
    		)
	    return (
	     	<div>
	     		<Card title={title} extra={extra}>
	     			<Table
	     				bordered
	     				rowKey='_id'

	     				columns={this.columns}
	     				dataSource={products}
	     				pagination={{
	     					defaultPageSize:PAGE_SIZE,
	     					total,
	     					showQuickJumper:true,
	     					onChange:this.getProducts
	     				}}
	     			/>
	     		</Card>
	     	</div>
)}
}
