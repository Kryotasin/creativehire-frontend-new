import { Button, Result, message } from 'antd';
import { Link, connect } from 'umi';
import React, {useEffect} from 'react';
import styles from './index.less';

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

const Step3 = (props) => {

  const { completionStatus } = props;

  useEffect(() => {
    
    message.destroy('processing');
  })

  return (
    <div>
        <Result
          className={styles.registerResult}
          status={completionStatus.type}
          title={<div className={styles.title}>Registration Successful!</div>}
          subTitle={"The activation email has been sent to your mailbox, and the email is valid for 24 hours. ".concat(completionStatus.message)}
          extra={actions}
        />
    </div>
  );
};

export default connect(({ userAndregister }) => ({
  completionStatus: userAndregister.completionStatus,
  // structure: userAndregister.structure.payload,
}))(Step3);

