import { Alert, Form, Radio, Button, Input, Popover, Progress, Select, message } from 'antd';
import React, { useState, useEffect } from 'react';

import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Link, connect, history } from 'umi';
import styles from './style.less';

const FormItem = Form.Item;
const passwordStatusMap = {
  ok: <div className={styles.success}>Stregth: Poor</div>,
  pass: <div className={styles.warning}>Stregth: Medium</div>,
  poor: <div className={styles.error}>Stregth: Strong</div>,
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



const Register = props => {
  const{ userAndregisterOld = {}, submitting} = props;
  const { status, error } = userAndregisterOld;

  const [visible, setVisible] = useState(false);
  const [popover, setPopover] = useState(false);
  const confirmDirty = false;
  let interval;
  const [form] = Form.useForm();

  useEffect(() => {
    if (!userAndregisterOld) {
      return;
    }

    const account = form.getFieldValue('email');

    if (status === 201) {
      message.success('Registration Successul');
      history.push({
        pathname: '/user/register-result',
        state: {
          account,
        },
      });
    }
  }, [userAndregisterOld]);

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

  const onFinish = (values) => {
    // console.log(props)
    const { dispatch } = props;

    dispatch({
      type: 'userAndregisterOld/submit',
      payload: { ...values },
    });
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
    <div className={styles.main}>
      <h3>Register</h3>
      <Form form={form} name="UserRegister" onFinish={onFinish}>
        <FormItem
          // label="Email"
          name="email"
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
          <Input size="large" placeholder="Email" />
        </FormItem>

        <Form.Item name="type" label="Are you a recruiter?"
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

        <FormItem
          // label="First Name"
          name="firstName"
          rules={[
            {
              required: true,
              message: 'Please enter your first name',
            },
          ]}
        >
          <Input size="large" placeholder="First Name" />
        </FormItem>

        <FormItem
          // label="Last Name"
          name="lastName"
          rules={[
            {
              required: true,
              message: 'Please enter your last name',
            },
          ]}
        >
          <Input size="large" placeholder="Last Name" />
        </FormItem>

        { window.innerWidth > 855 ?
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
          <FormItem
            // label="Password"
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
            <Input size="large" type="password" placeholder="Password. 6 characters, case sensitive" />
          </FormItem>
        </Popover>
        :
        <FormItem
            // label="Password"
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
            <Input size="large" type="password" placeholder="Password. 6 characters, case sensitive"/>
          </FormItem>
        }

        
        <FormItem
          // label="Confirm Password"
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
          <Input size="large" type="password" placeholder="Confirm password" />
        </FormItem>

        {status === 400 && !submitting && (
            <RegisterMessage content={error ? error : "Incorrect credentials"} />
          )}

        <FormItem>
          <Button
            size="large"
            loading={submitting}
            className={styles.submit}
            type="primary"
            htmlType="submit"
          >
            Register
          </Button>
          <Link className={styles.login} to="/user/login">
            Already registered?
          </Link>
        </FormItem>
      </Form>
    </div>
  );
};

export default connect(({ userAndregisterOld, loading }) => ({
  userAndregisterOld,
  submitting: loading.effects['userAndregisterOld/submit'],
}))(Register);
