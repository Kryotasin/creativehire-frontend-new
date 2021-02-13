import { Avatar, Card, Dropdown, List, Menu, Tooltip, Spin } from 'antd';
import useSelection from 'antd/lib/table/hooks/useSelection';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import jwt_decode from 'jwt-decode';
import asyncLocalStorage from '../../asyncLocalStorage';

import JobsList from '../homepage/components/jobslist';

const SavedJobs = (props) => {
  const { dispatch, saved_jobs, structure, keywords_part, currentUser } = props;

  //----------------------------------------USER ID HANDLING--------------------------------------------------------------------

  const[ userID, setUserID ] = useState(undefined);

  // const [ userIDInterval, setUserIDInterval ] = useState(undefined);
  useEffect(() => {

    asyncLocalStorage.getItem('accessToken')
    .then((token) => {
      return JSON.parse(JSON.stringify(jwt_decode(token)))
    })
    .then((token) => {
      setUserID(token.user_id);
      
      dispatch({
        type: 'user/fetchSavedJobs',
        payload: { userID: btoa(token.user_id) },
      });
    });
  }, []);

  useEffect(() => {
    // if (
    //   Object.keys(currentUser).length === 0 ||
    //   Object.keys(candidate_part).length === 0 ||
    //   Object.keys(keywords_part).length === 0
    // ) {
      if(userID !== undefined){
        dispatch({
          type: 'accountAndcenter/fetchCurrent',
          payload: { userID: btoa(userID) },
        });
      }
    // }
  }, [userID]);

  //------------------------------------------------------------------------------------------------------------


  useEffect(() => {
  }, [saved_jobs]);

  return (
    <>
      {!(saved_jobs === undefined) ? (
        <JobsList
          title="Saved"
          structure={structure}
          keywords_part={keywords_part}
          job_list={saved_jobs}
          maxGridSize={2}
          pageSize={6}          
          dispatch={dispatch}
          // updateJobMatchItem={updateJobMatchItem}
        />
      ) : (
        <Spin />
      )}
    </>
  );
};

export default connect(({ accountAndcenter, user }) => ({
  currentUser: accountAndcenter.currentUser,
  saved_jobs: user.saved_jobs,
  structure: accountAndcenter.structure,
  keywords_part: accountAndcenter.keywords_part,
}))(SavedJobs);
