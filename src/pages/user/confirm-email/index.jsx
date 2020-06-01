import React from 'react';
import { Space, Form, Input, Button, Spin, Alert } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Helmet, Link } from 'umi';

import axios from '../../../umiRequestConfig';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 8,
  },
};
class ConfirmEmail extends React.Component {

    state = {
        loading: false,
        message: null,
        description: null,
        type: null
    }

    componentDidMount(){

    }

  render() {

    const onFinish = values => {
        this.setState({
            loading: true
        });
        axios.post('api/v1/rest-auth/registration/verify-email/', {
            'key': values.token
        })
        .then(res => {
            this.setState({
                loading: false
            });
            if(res.status === 200 || res.status === 201){
                this.setState({
                    message: 'Email verified!',
                    description: 'Your email has been verified.',
                    type: 'success'         
                });

            }
            else if(res.status !== 200){
                this.setState({
                    message: 'Email verification failed!',
                    description: 'Please check the token again If problem persists contact admin@creativehire.co.',
                    type: 'error'         
                });
            }
        })
    };
    
    const onFinishFailed = errorInfo => {
    };

    const onSubCap = event => {
        event.preventDefault();
    };
   

    return (
        <div>  
            <Helmet>
                <meta charSet="utf-8" />
                <title>Confirm Email</title>
            </Helmet>
            {

                this.state.loading ?
  
                <Spin indicator={antIcon} />
                
                :
  
  
              <Form
              {...layout}
              initialValues={{
                  remember: true,
              }}
              ref={this.formRef}
              onSubmitCapture={onSubCap}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              >
              <Form.Item
                  label="Token"
                  name="token"
                  rules={[
                  {
                      required: true,
                      message: 'Please input your token!',
                  },
                  ]}
              >
                  <Input autoComplete="off" />
              </Form.Item>
  
              <Form.Item {...tailLayout}>
                <Space size="large">
                    <Button type="primary" htmlType="submit">
                    Verify Email
                    </Button>
                    <Link style={{marginRight: '10px'}} 
                        to='/'> Back to home
                    </Link>
                </Space>
              </Form.Item>
            
            {
                this.state.message && this.state.description && this.state.type ? 
                <Alert {...tailLayout} message = {this.state.message} description = {this.state.description} type={this.state.type} showIcon />
                :
                ''
            }
              
              </Form>
          }
      </div>
    );
  } 
  
}

export default ConfirmEmail;