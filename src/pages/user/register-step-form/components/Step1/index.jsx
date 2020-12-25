import React, { useState, useEffect } from 'react';
import {
  Alert,
  Form,
  Radio,
  Button,
  Input,
  Popover,
  Progress,
  Divider,
  message,
  Tooltip,
} from 'antd';
import { connect, Link } from 'umi';
import { QuestionCircleOutlined } from '@ant-design/icons';

import styles from './index.less';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 12 },
    lg: { span: 12 },
    xl: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10, offset: 2 },
    lg: { span: 10, offset: 2 },
    xl: { span: 16, offset: 2 },
  },
};

const passwordStatusMap = {
  ok: <div className={styles.success}>Stregth: Strong</div>,
  pass: <div className={styles.warning}>Stregth: Medium</div>,
  poor: <div className={styles.error}>Stregth: Poor</div>,
};
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

const RegisterMessage = ({ content }) => (
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
  const { dispatch, userAndregister = {}, submitting, errorMessages, status } = props;

  const [visible, setVisible] = useState(false);
  const [popover, setPopover] = useState(false);
  const confirmDirty = false;
  let interval;
  const [form] = Form.useForm();

  const { validateFields } = form;

  const onValidateForm = async () => {
    const values = await validateFields();

    dispatch({
      type: 'userAndregister/registerUserAndGetLinks',
      payload: values,
    });
  };

  useEffect(() => {}, [userAndregister]);

  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [],
  );

  const getPasswordStatus = () => {
    const value = form.getFieldValue('password');

    if (value && value.length > 9) {
      return 'ok';
    }

    if (value && value.length > 5) {
      return 'pass';
    }

    return 'poor';
  };

  const checkConfirm = (_, value) => {
    const promise = Promise;

    if (value && value !== form.getFieldValue('password')) {
      return promise.reject('Passwords do not match!');
    }

    return promise.resolve();
  };

  const checkPassword = (_, value) => {
    const promise = Promise; // No value

    if (!value) {
      setVisible(!!value);
      return promise.reject('Please enter password');
    } // Case

    if (!visible) {
      setVisible(!!value);
    }

    setPopover(!popover);

    if (value.length < 6) {
      return promise.reject('');
    }

    if (value && confirmDirty) {
      form.validateFields(['confirm']);
    }

    return promise.resolve();
  };

  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        layout="horizontal"
        className={styles.stepForm}
        colon={false}
        labelAlign="left"
      >
        <Form.Item
          label="Email"
          name="email"
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please enter email address',
            },
            {
              type: 'email',
              message: 'Invalid email',
            },
          ]}
        >
          <Input size="large" placeholder="don@norman.com" />
        </Form.Item>

        <Form.Item
          hasFeedback
          label={<span>Portfolio URL</span>}
          name="portfolio"
          rules={[
            {
              required: true,
              message: 'Enter your portfolio URL so we can fetch your projects',
            },
            {
              type: 'url',
              message: 'Invalid url',
            },
          ]}
          tooltip={{
            title: 'We will fetch your projects and set up your profile',
            icon: <QuestionCircleOutlined />,
          }}
        >
          <Input size="large" placeholder="http://www.myportfolio.com/" />
        </Form.Item>

        <Form.Item
          name="type"
          label="Are you a recruiter?"
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please choose one',
            },
          ]}
        >
          <Radio.Group>
            <Radio value="2">Yes</Radio>
            <Radio value="1">No</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          hasFeedback
          label="First Name"
          name="firstName"
          rules={[
            {
              required: true,
              message: 'Please enter your first name',
            },
          ]}
        >
          <Input size="large" placeholder="Don" />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[
            {
              required: true,
              message: 'Please enter your last name',
            },
          ]}
        >
          <Input size="large" placeholder="Norman" />
        </Form.Item>

        {window.innerWidth > 855 ? (
          <Popover
            getPopupContainer={(node) => {
              if (node && node.parentNode) {
                return node.parentNode;
              }

              return node;
            }}
            content={
              visible && (
                <div
                  style={{
                    padding: '4px 0',
                  }}
                >
                  {passwordStatusMap[getPasswordStatus()]}
                  {renderPasswordProgress()}
                  <div
                    style={{
                      marginTop: 10,
                    }}
                  >
                    Enter at least 6 characters containing uppercase letters, numbers and symbols.
                  </div>
                </div>
              )
            }
            overlayStyle={{
              width: 240,
            }}
            placement="right"
            visible={visible}
          >
            <Form.Item
              hasFeedback
              label="Password"
              name="password"
              className={
                form.getFieldValue('password') &&
                form.getFieldValue('password').length > 0 &&
                styles.password
              }
              rules={[
                {
                  required: true,
                  validator: checkPassword,
                },
              ]}
            >
              <Input.Password size="large" placeholder="Password. 6 characters, case sensitive" />
            </Form.Item>
          </Popover>
        ) : (
          <Form.Item
            hasFeedback
            label="Password"
            name="password"
            className={
              form.getFieldValue('password') &&
              form.getFieldValue('password').length > 0 &&
              styles.password
            }
            rules={[
              {
                required: true,
                validator: checkPassword,
              },
            ]}
          >
            <Input.Password size="large" placeholder="Password. 6 characters, case sensitive" />
          </Form.Item>
        )}

        <Form.Item
          hasFeedback
          label="Confirm Password"
          name="confirm"
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            {
              validator: checkConfirm,
            },
          ]}
        >
          <Input.Password size="large" placeholder="" />
        </Form.Item>

        {(status === 400 || status === 500 || status === 401) && !submitting && (
          <RegisterMessage content={errorMessages ? errorMessages : 'Incorrect credentials'} />
        )}

        <Form.Item
          label={
            <Button
              size="large"
              onClick={onValidateForm}
              loading={props.loading}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              Register
            </Button>
          }
        >
          <Link className={styles.login} to="/user/login">
            Already registered?
          </Link>
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
          Enter your details and create an account on Creativehire. We will try to fetch your
          project links for the next step.
        </p>
      </div>
    </>
  );
};

export default connect(({ userAndregister }) => ({
  link: userAndregister.link,
  loading: userAndregister.loading,
  errorMessages: userAndregister.errorMessages,
  status: userAndregister.status,
}))(Step1);
