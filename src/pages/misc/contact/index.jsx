import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { Helmet } from 'umi';

import axios from '../../../umiRequestConfig';


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

    componentDidMount(){

    }

  render() {
    const onFinish = values => {
        const { title, email, description } = values;
        const userID = localStorage.getItem('userProfileID') ? localStorage.getItem('userProfileID') : -1;

        axios.post('misc/contact/', {
            userID: userID,
            title: title,
            email: email,
            description: description
        })
        .then(res => {
            if(res.status === 201){
                message.success('We have received your query. We\'ll get back to you soon!');
            }
        })
        .catch(err => {
            message.error('There was an issue:', err.response.data);
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
                    name="title"
                    label="Title"
                    rules={[
                        {
                        required: true,
                        message: 'Please input title!',
                        },
                    ]}
                    >
                    <Input />
                    </Form.Item>

                    <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                        },
                        {
                        required: true,
                        message: 'Please input your E-mail!',
                        },
                    ]}
                    >
                    <Input />
                    </Form.Item>

                    <Form.Item label="Description"
                    name="description" 
                    rules={[
                        {
                            required: true,
                            message:'Please decribe your concern'},
                    ]}>
                        <Input.TextArea placeholder="Enter a Description"/>
                    </Form.Item>

            
                    <Form.Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Send
                        </Button>
                    </Form.Item>
              </Form>
          
      </div>
    );
  } 
  
}

export default ConfirmEmail;