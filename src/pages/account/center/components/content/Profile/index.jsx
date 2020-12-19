import React, { useEffect } from 'react';

import EmailVerification from './EmailVerification';
import Remote from './Remote';
import WorkAuthorization from './WorkAuthorization';
import WorkExperience from './WorkExperience';
import Education from './Education';

const Profile = () => {
  return (
    <>
      <EmailVerification />
      <Remote />
      <WorkAuthorization />
      <Education />
      <WorkExperience />
    </>
  );
};

export default Profile;
