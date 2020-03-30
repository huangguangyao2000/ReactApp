import React from 'react';
import { Upload, Icon, message } from 'antd';
import { BASE_IMG_PATH } from '../../utils/constants'
import { reqDeleteImg } from '../../api/index'

const { Dragger } = Upload;


export default class PicturesWall extends React.Component {
      constructor(props) {
            super(props);
            let fileList = [];
            const { imgs } = this.props;
            if (imgs && imgs.length > 0) {
                  fileList = imgs.map((img, index) => ({
                        uid: -index,
                        name: img,
                        status: 'done',
                        url: BASE_IMG_PATH+img
                  }))
            }

            this.state = {
                  fileList
            }
      }

      getImgs  = () => {
            return this.state.fileList.map(file => file.name)
      }

      onChange = async ({ file, fileList }) => {
            console.log('handleChange()', file.status, fileList.length, file === fileList[fileList.length - 1])
            if (file.status === 'done') {
                  const result = file.response  // {status: 0, data: {name: 'xxx.jpg', url: '图片地址'}}
                  console.log(result);
                  if (result.status === 0) {
                        message.success('上传图片成功!')
                        const { name, url } = result.data
                        file = fileList[fileList.length - 1]
                        file.name = name
                        file.url = url
                  } else {
                        message.error('上传图片失败')
                  }
            } else if (file.status === 'removed') { // 删除图片
                  console.log(file.name)
                  const result = await reqDeleteImg(file.name)
                  if (result.status === 0) {
                        message.success('删除图片成功!')
                  } else {
                        message.error('删除图片失败!')
                  }
            }
            this.setState({
                  fileList
            })
      }

      render() {
            const props = {
                  name: 'image',
                  multiple: false,
                  action: '/manage/img/upload',
            };
            return (
                  <Dragger {...props} onChange={this.onChange} fileList={this.state.fileList}>
                        <p className="ant-upload-drag-icon">
                              <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                              Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                              band files
                        </p>
                  </Dragger>
            )
      }
}




