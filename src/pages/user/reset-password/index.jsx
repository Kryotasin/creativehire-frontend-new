import React from 'react';
import { Form, Input, Button, Spin, Alert, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import {Helmet, Link} from 'umi';

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
class ResetPassword extends React.Component {

    state = {
        loading: false,
        message: null,
        description: null,
        type: null
    }

    componentDidMount(){
    }

  render() {

    const onFinishEmail = values => {
        this.setState({
            loading: true
        });
        axios.post('/api/v1/rest-auth/password/reset/', {
            'email': values.email
        })
        .then(res => {
            this.setState({
                loading: false
            });
            if(res.status === 200 || res.status === 201){
                this.setState({
                    message: 'Email sent!',
                    description: 'An email with with instructions ot reset your password has been sent.',
                    type: 'success'         
                });

            }
            else if(res.status !== 200){
                this.setState({
                    message: 'Failed to send an email!',
                    description: 'Please check the email address again. If problem persists contact admin@creativehire.co.',
                    type: 'error'         
                });
            }
        })
    };


    const onFinishPassword = values => {
        this.setState({
            loading: true
        });

        axios.post('/api/v1/rest-auth/password/reset/confirm/', {
            'new_password1': values.password,
            'new_password2': values.confirm,
            'uid': this.props.match.params.uidb64,
            'token': this.props.match.params.token
        })
        .then(res => {
            this.setState({
                loading: false
            });
            if(res.status === 200 || res.status === 201){
                this.setState({
                    message: 'Password reset successful!',
                    description: 'Your password has been changed.',
                    type: 'success'         
                });

            }
            else if(res.status !== 200){
                this.setState({
                    message: 'Password reset failed!',
                    description: 'Please check the password again. Make sure it has atleast one uppercase character, one digit and one symbol. If problem persists contact admin@creativehire.co.',
                    type: 'error'         
                });
            }
        })
    };
    
    const onFinishFailed = errorInfo => {
    };


    return (
        <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Password Reset</title>
        </Helmet>
            {
                this.state.loading ?
  
                <Spin indicator={antIcon} />
                
                :
  
              <div>
                  {
                      this.props.match.params.uidb64 && this.props.match.params.token ?
                      <Form
                            {...layout}
                            initialValues={{
                                remember: true,
                            }}
                            ref={this.formRef}
                            onFinish={onFinishPassword}
                            onFinishFailed={onFinishFailed}
                            >
                         <Form.Item
                                name="password"
                                label=" New Password"
                                rules={[
                                {
                                    required: true,
                                    message: 'Please input your new password!',
                                },
                                ]}
                                hasFeedback
                            >
                                <Input.Password />
                            </Form.Item>
                        
                            <Form.Item
                                name="confirm"
                                label="Confirm Password"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your new password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                        
                                    return Promise.reject('The two passwords do not match!');
                                    },
                                }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>
                
                            <Form.Item {...tailLayout}>
                                <Space size="large">
                                    <Button type="primary" htmlType="submit">
                                        Reset Password
                                    </Button>
                                    <Link style={{marginRight: '10px'}} 
                                    to='/user/login/'> Login
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

                      :

                      <Form
                            {...layout}
                            initialValues={{
                                remember: true,
                            }}
                            ref={this.formRef}
                            onFinish={onFinishEmail}
                            onFinishFailed={onFinishFailed}
                            >
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                
                            <Form.Item {...tailLayout}>
                                <Space size="large">
                                    <Button type="primary" htmlType="submit">
                                    Send Email
                                    </Button>
                                    <Link style={{marginRight: '10px'}} 
                                    to='/user/login'> Login
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
          }
      </div>
    );
  } 
  
}

export default ResetPassword;