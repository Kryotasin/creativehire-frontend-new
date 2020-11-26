import React, { useEffect } from 'react';

import CountriesAuthorized from './CountriesAuthorized';
import WorkExperience from './WorkExperience';
import Education from './Education';

const Profile = () => {

  return (
    <>
      <CountriesAuthorized />
      <WorkExperience />
      <Education />
    </>
  );
};

export default Profile;
