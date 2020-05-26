import { Form, Button, Input, Popover, Progress, Select, message } from 'antd';
import React, { useState, useEffect } from 'react';
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

const Register = ({ submitting, dispatch, userAndregister }) => {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [prefix, setPrefix] = useState('86');
  const [popover, setPopover] = useState(false);
  const confirmDirty = false;
  let interval;
  const [form] = Form.useForm();
  useEffect(() => {
    if (!userAndregister) {
      return;
    }

    const account = form.getFieldValue('email');

    if (userAndregister.status === 'ok') {
      message.success('Registration Successul');
      history.push({
        pathname: '/user/register-result',
        state: {
          account,
        },
      });
    }
  }, [userAndregister]);
  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [],
  );

  const onGetCaptcha = () => {
    let counts = 59;
    setCount(counts);
    interval = window.setInterval(() => {
      counts -= 1;
      setCount(counts);

      if (counts === 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

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
    dispatch({
      type: 'userAndregister/submit',
      payload: { ...values, prefix },
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
    const promise = Promise; // 没有值的情况

    if (!value) {
      setVisible(!!value);
      return promise.reject('Pleaseenter password');
    } // 有值的情况

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

  const changePrefix = (value) => {
    setPrefix(value);
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
        <FormItem
          name="username"
          rules={[
            {
              required: true,
              message: 'Please enter a username!',
            },
          ]}
        >
          <Input size="large" placeholder="userandregister.username.placeholder" />
        </FormItem>
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
                  Enter at least 6 characters. Please do not enter easy passwords.
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
            name="password"
            className={
              form.getFieldValue('password') &&
              form.getFieldValue('password').length > 0 &&
              styles.password
            }
            rules={[
              {
                validator: checkPassword,
              },
            ]}
          >
            <Input size="large" type="password" placeholder="At least 6 digits, case sensitive" />
          </FormItem>
        </Popover>
        <FormItem
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

export default connect(({ userAndregister, loading }) => ({
  userAndregister,
  submitting: loading.effects['userAndregister/submit'],
}))(Register);
