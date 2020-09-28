import React, { useEffect } from 'react';

import CountriesAuthorized from './CountriesAuthorized';

import styles from './index.less';

const Profile = props => {
  // const { currentUser } = props;

  useEffect(() => {
    // console.log(currentUser)
  })

  return (
    <>
      <CountriesAuthorized />
    </>
  );
};

export default Profile;
