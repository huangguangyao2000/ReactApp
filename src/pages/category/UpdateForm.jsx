import React from 'react';
import {Form,Input} from 'antd'

class UpdateForm extends React.Component{

    componentWillMount(){
        this.props.setForm(this.props.form)

    }

    render(){
        const {categoryName} = this.props;
        const {getFieldDecorator} = this.props.form;
        return (
            <Form>
                    <Form.Item label='分类名称'>
                    {
                        getFieldDecorator('categoryName',{
                            initialValue:categoryName
                        })(
                            <Input placeholder="请输入分类名称"/>
                        )
                    }
                </Form.Item>
            </Form>
        )
    }

}
export default Form.create()(UpdateForm)