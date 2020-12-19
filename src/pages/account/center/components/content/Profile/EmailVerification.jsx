import { Switch, Space, Spin, message, notification } from 'antd';
import React, { useEffect } from 'react';
import { connect, Link } from 'umi';
import styles from './index.less';
import axios from '../../../../../../umiRequestConfig';

const EmailVerification = (props) => {
  const { dispatch, currentUser, emailVerificationStatus } = props;

  useEffect(() => {
    if (Object.keys(currentUser).length !== 0) {
      const userID = JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id;
      dispatch({
        type: 'accountAndcenter/fetchEmailVerificationStatus',
        payload: { userID: btoa(userID) },
      });
    }
  }, []);

  return (
    <div className="parts">
      {/* <div className={styles.name}>
        Email verified
      </div> */}
      <Space direction="horizontal" align="top" size="large">
        {emailVerificationStatus == 'True'
          ? ''
          : notification['error']({
              message: 'Email not verified',
              description:
                'Please check your mail for an email from us. It contains a link and a code you can use to confirm your registered email.',
              duration: 12,
            })}
      </Space>
    </div>
  );
};

export default connect(({ accountAndcenter }) => ({
  currentUser: accountAndcenter.currentUser,
  emailVerificationStatus: accountAndcenter.emailVerificationStatus,
}))(EmailVerification);
