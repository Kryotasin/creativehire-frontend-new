import { Button, Result } from 'antd';
import { Link } from 'umi';
import React from 'react';
import styles from './style.less';

const actions = (
  <div className={styles.actions}>
    <Link className={styles.login} to="/home">
      <Button size="large" type="primary">
        My Dashboard
      </Button>
    </Link>
    {/* <Link to="/user/login">
      <Button size="large">Login</Button>
    </Link> */}
  </div>
);

const RegisterResult = () => (
  <Result
    className={styles.registerResult}
    status="success"
    title={<div className={styles.title}>Registration Successfull!</div>}
    subTitle="The activation email has been sent to your mailbox, and the email is valid for 24 hours. Please log in to the mailbox in time and follow instructions in the email to activate the account."
    extra={actions}
  />
);

export default RegisterResult;
