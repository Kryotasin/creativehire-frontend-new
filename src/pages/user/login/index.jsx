import { Alert, Checkbox } from 'antd';
import React, { useState } from 'react';
import { Link, connect } from 'umi';
import styles from './style.less';
import LoginFrom from './components/Login';

const { Tab, UserName, Password, Submit } = LoginFrom;

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = props => {
  const { userAndlogin = {}, submitting } = props;
  const { status, type: loginType } = userAndlogin;
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState('account');

  const handleSubmit = values => {
    const { dispatch } = props;

    dispatch({
      type: 'userAndlogin/login',
      payload: { ...values, type },
    });
  };

  return (
    <div className={styles.main}>
      <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <Tab key="account" tab="Login">
          {status === 'error' && loginType === 'account' && !submitting && (
            <LoginMessage content="Incorrect credentials" />
          )}

          <UserName
            name="userName"
            placeholder="admin or user"
            rules={[
              {
                required: true,
                message: 'Please enter username!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="ant.design"
            rules={[
              {
                required: true,
                message: 'Please enter password!',
              },
            ]}
          />
        </Tab>

        <div>
          <Checkbox checked={autoLogin} onChange={e => setAutoLogin(e.target.checked)}>
            Remember me
          </Checkbox>
          <a
            style={{
              float: 'right',
            }}
          >
            Forgot Password
          </a>
        </div>
        <Submit loading={submitting}>Login</Submit>
        <div className={styles.other}>
          <Link className={styles.register} to="/user/register">
            Register
          </Link>
        </div>
      </LoginFrom>
    </div>
  );
};

export default connect(({ userAndlogin, loading }) => ({
  userAndlogin,
  submitting: loading.effects['userAndlogin/login'],
}))(Login);
