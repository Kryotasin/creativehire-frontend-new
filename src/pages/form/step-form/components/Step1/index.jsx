import React from 'react';
import { Form, Button, Divider, Input, Alert, Select } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const ErrorMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Step1 = (props) => {
  const { dispatch, link, loading, prefix } = props;
  const [form] = Form.useForm();

  const { validateFields } = form;

  const onValidateForm = async () => {
    const values = await validateFields();

    if(values.projectLink.includes('://')){
      values.projectLink = values.prefix.concat(values.projectLink.split('://')[1]);
    }

    if (dispatch) {
      dispatch({
        type: 'formAndstepForm/fetchBasicDetails',
        payload: values,
      });
    }
  };

  function handleChange(value) {
    
  }

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 100 }} onChange={handleChange}>
        <Option value="https://">https://</Option>
        <Option value="http://">http://</Option>
      </Select>
    </Form.Item>
  );

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        layout="horizontal"
        initialValues={{
          prefix: prefix || 'https://',
          projectLink: link ? link.split('://')[1] : 'www.myportfolio.com/my-design-project'
        }}
        className={styles.stepForm}
      >{console.log(link)}
        <Form.Item
          label="Project Link"
          name="projectLink"
          rules={[
            {
              type: 'url',
              message: 'The input is not valid link!',
            },
            {
              required: true,
              message: 'Please enter exact link to project ',
            },
          ]}
        >
          <Input placeholder="www.myportfolio.com/my-design-project" addonBefore={prefixSelector} />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
        >
          <Button type="primary" loading={loading} onClick={onValidateForm}>
            Next
          </Button>
        </Form.Item>
      </Form>
      <Divider
        style={{
          margin: '40px 0 24px',
        }}
      />
      <div className={styles.desc}>
        <h3>Help</h3>
        <h4>What is this?</h4>
        <p>
          Enter your project link above. We will fetch all the information we can from the link.
        </p>
      </div>
    </>
  );
};

export default connect(({ formAndstepForm }) => ({
  link: formAndstepForm.link,
  prefix: formAndstepForm.prefix,
  loading: formAndstepForm.loading,
}))(Step1);
