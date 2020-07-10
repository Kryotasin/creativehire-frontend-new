import { message, Divider, Button, Card, Input, Form, Select } from 'antd';
import { connect, history } from 'umi';
import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import axios from '../../../umiRequestConfig';

const FormItem = Form.Item;
const { TextArea } = Input;

const BasicForm = (props) => {
  const userID = localStorage.getItem('userID');
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // const source = axios.CancelToken.source;
    try {
      const fetchProjects = async () => {
        setLoading(true);
        let data = await axios.post(
          'portfolio/',
          {
            userID,
          },
          // {
          //   cancelToken: source.token,
          // },
        );
        data = data.data;
        setProjects(data);
        setLoading(false);
      };
      fetchProjects();
    } catch (err) {
      // if (!axios.isCancel(err)) {
        console.log('Request Canceled');
      // }
    }

    // return () => {
    //   source.cancel();
    // };
  }, []);


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

  const {Option} = Select;

  const projectList = projects.map(p => {
    const { fields, pk } = p;
    const { title } = fields;
    return <Option key={pk} >{title}</Option>
  })


  const ProjectSelectorComponent = (
    <Select
      mode="multiple"
      placeholder="Select projects"
    >
    {projectList}
    </Select>
  )


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
          label="Projects"
          name="projectList"
          rules={[
            {
              required: true,
              message: 'Please enter project titles',
            },
          ]}
        >
        {ProjectSelectorComponent}
        </FormItem>
        
        <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
        Or
        </div>
        <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
        <Button type="secondary" onClick={() => history.push('/portfolio/new')}>
          Add New Project
        </Button>
        </div>
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
