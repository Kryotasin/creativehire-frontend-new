import { Alert, Checkbox } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, connect } from 'umi';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

import styles from './style.less';
import LoginForm from './components/Login';


const { Tab, UserName, Password, Submit } = LoginForm;

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
  const { status, error } = userAndlogin;
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState('account');

  const handleSubmit = values => {
    const { dispatch } = props;

    
  dispatch({
      type: 'userAndlogin/login',
      payload: { ...values, type },
    });
  };

  useEffect(() => {
  }, [status, error]);

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div className={styles.main}>
      <LoginForm activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <Tab key="account" tab="Login">
          {(status === 400 || status === 401) && !submitting && (
            <LoginMessage content={ error || "Incorrect credentials"} />
          )}
          
          {(status === 521) && (
            <LoginMessage content={error} />
          )}

          <UserName
            label="Username"
            name="email"
            placeholder="Email address"
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
          />
          <Password
            name="password"
            placeholder="Password"
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
          <Link to='/user/reset-password'
            style={{
              float: 'right',
            }}
          >
            Forgot Password
          </Link>
        </div>
        <Submit loading={submitting}>Login</Submit>
        <div className={styles.other}>
          <Link className={styles.register} to="/user/register">
            Register
          </Link>
        </div>
      </LoginForm>
    </div>
  );
};

export default connect(({ userAndlogin, loading }) => ({
  userAndlogin,
  submitting: loading.effects['userAndlogin/login'],
}))(Login);
