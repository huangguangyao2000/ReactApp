import React from 'react';
import { Form ,Select, Input} from 'antd';

class AddForm extends React.Component{


    componentWillMount(){
        this.props.setForm(this.props.form)
    }
    render(){
        const {getFieldDecorator}= this.props.form
        const {categorys,parentId} = this.props

        
        return (
            <Form>
                <Form.Item label='所属分类'>
                    {
                        getFieldDecorator('parentId',{
                            initialValue:parentId
                        })(
                        <Select>
                            <Select.Option key='0' value='0'>一级分类</Select.Option>
                                {
                                    categorys.map(c=><Select.Option key={c._id} value={c._id}>
                                        {c.name}
                                    </Select.Option>)
                                }
                        </Select>
                    )
                    }
                </Form.Item>
                <Form.Item label='分类名称'>
                    {
                        getFieldDecorator('categoryName',{
                            initialValue:''
                        })(
                            <Input placeholder="请输入分类名称"/>
                        )
                    }
                </Form.Item>
            </Form>
        )
    }

}
export default Form.create()(AddForm)