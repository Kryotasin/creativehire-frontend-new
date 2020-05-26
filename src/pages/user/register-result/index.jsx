import { Button, Result } from 'antd';
import { FormattedMessage, formatMessage, Link } from 'umi';
import React from 'react';
import styles from './style.less';

const actions = (
  <div className={styles.actions}>
    <Link className={styles.login} to="/">
      <Button size="large" type="primary">
        Home
      </Button>
    </Link>
    <Link to="/user/login">
      <Button size="large">Login</Button>
    </Link>
  </div>
);

const RegisterResult = ({ location }) => (
  <Result
    className={styles.registerResult}
    status="success"
    title={<div className={styles.title}>Registration Successfull!</div>}
    subTitle="The activation email has been sent to your mailbox, and the email is valid for 24 hours. Please log in to the mailbox in time and click the link in the email to activate the account."
    extra={actions}
  />
);

export default RegisterResult;
