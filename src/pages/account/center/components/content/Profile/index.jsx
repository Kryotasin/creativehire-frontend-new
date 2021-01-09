import React, { useEffect } from 'react';

import EmailVerification from './EmailVerification';
import Remote from './Remote';
import WorkAuthorization from './WorkAuthorization';
import WorkExperience from './WorkExperience';
import Education from './Education';

const months = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];
const currentYear = 2020;
const defaultDate = 1;

const Profile = (props) => {

  const { userID } = props;

  return (
    <>
      <EmailVerification userID={userID} />
      <Remote userID={userID} />
      <WorkAuthorization userID={userID} />
      <Education months={months} currentYear={currentYear} defaultDate={defaultDate} userID={userID} />
      <WorkExperience months={months} currentYear={currentYear} defaultDate={defaultDate} userID={userID} />
    </>
  );
};

export default Profile;
