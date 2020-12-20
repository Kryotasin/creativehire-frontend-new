import { notification } from 'antd';
import React, { useEffect } from 'react';
import { connect, Link } from 'umi';

const EmailVerification = (props) => {
  const { dispatch, emailVerificationStatus } = props;

  useEffect(() => {
      const userID = JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id;
      dispatch({
        type: 'accountAndcenter/fetchEmailVerificationStatus',
        payload: { userID: btoa(userID) },
      });
  }, []);

  useEffect(() => {

  }, [emailVerificationStatus]);

  return (
    <>
      {emailVerificationStatus === 'False' && emailVerificationStatus !== undefined
        ? 
        notification['error']({
          message: 'Email not verified',
          description:
            'Please check your mail for an email from us. It contains a link and a code you can use to confirm your registered email.',
          duration: 12,
        })
        : ''}
    </>
        
  );
};

export default connect(({ accountAndcenter }) => ({
  emailVerificationStatus: accountAndcenter.emailVerificationStatus,
}))(EmailVerification);
