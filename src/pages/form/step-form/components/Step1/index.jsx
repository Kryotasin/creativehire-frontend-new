import React from 'react';
import { Form, Button, Divider, Input } from 'antd';
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

const Step1 = props => {
  const { dispatch, data } = props;
  const [form] = Form.useForm();

  if (!data) {
    return null;
  }

  const { validateFields } = form;

  const onValidateForm = async () => {
    const values = await validateFields();

    if (dispatch) {
      dispatch({
        type: 'formAndstepForm/saveStepFormData',
        payload: values,
      });
      dispatch({
        type: 'formAndstepForm/saveCurrentStep',
        payload: 'job',
      });
    }
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        layout="horizontal"
        className={styles.stepForm}
      >

        <Form.Item
          label="Project Name"
          name="projectName"
          rules={[
            {
              required: true,
              message: 'Please enter project name',
            },
          ]}
        >
          <Input placeholder="Project name" />
        </Form.Item>
        <Form.Item
          label="Project Link"
          name="projectLink"
          rules={[
            {
              required: true,
              message: 'Please enter project link',
            },
            {
              type: 'url',
              message: 'Invalid url',
            },
          ]}
        >
          <Input placeholder="http://...."/>
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
          <Button type="primary" onClick={onValidateForm}>
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
          We gather information about your skillset from your projects directly. Please make sure we have acces to the webpage you paste above.
        </p>
      </div>
    </>
  );
};

export default connect(({ formAndstepForm }) => ({
  data: formAndstepForm.step,
}))(Step1);
