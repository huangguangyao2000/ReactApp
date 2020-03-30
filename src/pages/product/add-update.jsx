import React from 'react';
import {Card,Form,Input,Cascader,Button,message,Icon} from 'antd'
import LinkButton from '../../component/link-button/index'
import PicturesWall from './pictures-wall'
import {reqCategorys,reqAddOrUpdateProduct} from '../../api/index'

class ProductAddUpdate extends React.Component{

   state = {
      options:[],
   }

   constructor(props){
      super(props);
      this.pw = React.createRef();
      this.editor = React.createRef();
   }

   submit=()=>{
      this.props.form.validateFields(async (err,values)=>{
         if(!err){
            const {name,desc,price,categoryIds} = values;
            const imgs = this.pw.current.getImgs();

            let pCategoryId ='';
            let categoryId = '';
            if(categoryIds.length===1){
               pCategoryId = '0';
               categoryId = categoryIds[0];
            }else{
               pCategoryId = categoryIds[0];
               categoryId = categoryIds[1];
            }

            const product = {name,desc,price,pCategoryId,categoryId,imgs};
            if(this.isUpdate){
               product._id = this.product._id;
            }
            const result = await  reqAddOrUpdateProduct(product);
            if(result.status===0){
               message.success('success');
               this.props.history.goBack();
            }else{
               message.success('fail')
            }
         }
      })
   }

   validateDate = (rule,value,callback)=>{
      value = value*1;
      if(value>=0){
         callback()
      }else{
         callback('可借阅天数需大于等于0')
      }
   }

   getCategorys = async (parentId)=>{
      const result = await reqCategorys(parentId);
      console.log(result);
      if(result.status===0){
         const categorys = result.data;
         if(parentId==='0'){
            this.initOptions(categorys)
         }else{
            return categorys;
         }
      }
   }

   initOptions = async (categorys)=>{
      const options = categorys.map(c=>({
         value:c._id,
         label:c.name,
         isLeaf: false
      }))

      const {product,isUpdate} = this;
      if(isUpdate && product.pCategoryId!=='0'){
         const subCategorys = await this.getCategorys(product.pCategoryId);
         if(subCategorys&&subCategorys.length>0){
            const cOptions = subCategorys.map(c=>({
               value:c._id,
               label:c.name,
               isLeaf:true
            }))

            const targetOption  = options.find(options=>options.value===product.pCategoryId)

            targetOption.children = cOptions;
         }
      }

      this.setState({
         options
      })
   }

   componentDidMount(){
      this.getCategorys('0');
   }

   componentWillMount(){
      const product = this.props.location.state;
      this.product = product || {}
      this.isUpdate = !!product;
   }

   loadData = async (selectedOptions)=>{
      const targetOption = selectedOptions[selectedOptions.length-1]
      targetOption.loading = true;

      const subCategorys = await this.getCategorys(targetOption.value);
      targetOption.loading = false;

      if(subCategorys&& subCategorys.length>0){
         const cOptions = subCategorys.map((c)=>({
            value:c._id,
            label:c.name,
            isLeaf:true
         }))
         targetOption.children = cOptions;
      }else{
         targetOption.isLeaf = true;
      }

      this.setState({
         options:[...this.state.options]
      })
   }

   render(){
         const {product,isUpdate} = this;
         const {pCategoryId,categoryId,imgs} = product;
         const {options} = this.state;
         const {getFieldDecorator} = this.props.form;

         const categoryIds = []
         if(isUpdate){
            if(pCategoryId==='0'){
               categoryIds.push(categoryId)
            }else{
               categoryIds.push(pCategoryId);
               categoryIds.push(categoryId)
            }
         }


   		const formItemLayOut={
   			labelCol:{span:2},
   			wrapperCol:{span:8}
   		}

         const title=(
            <span>
               <LinkButton onClick={()=>this.props.history.goBack()}>
                  <Icon type='arrow-left' style={{fontSize:20}}/>
               </LinkButton>
            </span>
            )

         return (
         	<Card title={title}>
         		<Form>
         			<Form.Item label="书籍名称" {...formItemLayOut}>
         				{
         					getFieldDecorator('name',{
         						initialValue:product.name,
         						rules:[
         							{required:true,message:'书籍名称必须输入'}
         						]
         					})(
         						<Input placeholder='请输入书籍名称'/>
         					)
         				}
         			</Form.Item>
         			<Form.Item label="书籍描述" {...formItemLayOut}>
         				{
         					getFieldDecorator('desc',{
         						initialValue:product.desc,
         						rules:[
         							{required:true,message:'书籍描述必须输入'}
         						]
         					})(
         						<Input.TextArea placeholder='请输入书籍描述' autosize/>
         					)
         				}
         			</Form.Item>
         			<Form.Item label="书籍价格" {...formItemLayOut}>
         				{
         					getFieldDecorator('price',{
         						initialValue:product.price,
         						rules:[
         							{required:true,message:'书籍价格必须输入'},
         							{validator:this.validateDate}
         						]
         					})(
         						<Input type='number' placeholder='请输入书籍价格' addonAfter='元'/>
         					)
         				}
         			</Form.Item>
         			<Form.Item label="书籍分类" {...formItemLayOut}>
         				{
         					getFieldDecorator('categoryIds',{
         						initialValue:product.categoryIds,
         						rules:[
         							{required:true,message:'书籍分类必须输入'}
         						]
         					})(
         						<Cascader
         							options={options}
         							loadData={this.loadData}
         							/>
         					)
         				}
         			</Form.Item>
         			<Form.Item label="书籍图片" {...formItemLayOut}>
                     <PicturesWall ref={this.pw} imgs={imgs}/>
         			</Form.Item>
         			<Button type='primary' onClick={this.submit}>提交</Button>
         		</Form>
         	</Card>
)}
}
export default Form.create()(ProductAddUpdate)