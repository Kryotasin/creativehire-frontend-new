import { message, Divider, Button, Card, Input, Form } from 'antd';
import { connect } from 'umi';
import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

const FormItem = Form.Item;
const { TextArea } = Input;

const BasicForm = (props) => {
  const { submitting } = props;
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 7,
      },
    },
    wrapperCol: {
      xs: {
        span: 24,
      },
      sm: {
        span: 12,
      },
      md: {
        span: 10,
      },
    },
  };
  const submitFormLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 10,
        offset: 10,
      },
    },
  };

  const onFinish = (values) => {
    const { dispatch } = props;
    dispatch({
      type: 'formAndbasicForm/submitRegularForm',
      payload: values,
    });
  };

  const onFinishFailed = (errorInfo) => {
    message.error('Failed:', errorInfo);
  };


  return (
    <PageHeaderWrapper content="Enter details about your project and job.">
      <Card bordered={false}>
      <Divider>Project Details</Divider>
        <Form
          style={{
            marginTop: 8,
          }}
          form={form}
          name="newScan"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <FormItem
            {...formItemLayout}
            label="Project Title"
            name="projectTitle"
            rules={[
              {
                required: true,
                message: 'Please enter project title',
              },
            ]}
          >
            <Input placeholder="An interesting title" />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Project Link"
            name="projectLink"
            rules={[
              {
                type: 'url',
                message: 'The input is not valid link!',
              },
              {
                required: true,
                message: 'Please enter project link',
              },
            ]}
          >
            <Input placeholder="http://...."/>
          </FormItem>


          <Divider>Job Details</Divider>

          <FormItem
            {...formItemLayout}
            label="Company/Organization"
            name="org"
            rules={[
              {
                required: true,
                message: 'Please enter company name that posted the job',
              },
            ]}
          >
            <Input placeholder="Google Inc." />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Job Title"
            name="jobTitle"
            rules={[
              {
                required: true,
                message: 'Please enter job title',
              },
            ]}
          >
            <Input placeholder="UX Designer" />
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Job Link"
            name="jobLink"
            rules={[
              {
                type: 'url',
                message: 'The input is not valid link!',
              },
              {
                required: true,
                message: 'Please enter job link',
              },
            ]}
          >
            <Input placeholder="Paste the portal link (Linkdin, Glassdoors, etc.)"/>
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="Job Description"
            name="jobDescription"
            rules={[
              {
                required: true,
                message: 'Please enter the job decription',
              },
            ]}
          >
            <TextArea
              style={{
                minHeight: 32,
              }}
              placeholder="Paste complete job decription here"
              rows={4}
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </FormItem>
          
          <FormItem
            {...submitFormLayout}
            style={{
              marginTop: 32,
            }}
          >
            <Button type="primary" htmlType="submit" loading={submitting}>
              Scan Now
            </Button>
          </FormItem>
        </Form>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ loading }) => ({
  submitting: loading.effects['formAndbasicForm/submitRegularForm'],
}))(BasicForm);
