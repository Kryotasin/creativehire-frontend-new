import { Avatar, Card, Dropdown, List, Menu, Tooltip, Spin } from 'antd';
import useSelection from 'antd/lib/table/hooks/useSelection';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';

import JobsList from '../../../../../homepage/components/jobslist';

const SavedJobs = (props) => {
  const { dispatch, saved_jobs, structure, keywords_part } = props;
  // Object.keys(saved_jobs).length === 0 &&

  useEffect(() => {
    // if(saved_jobs===undefined){
    const userID = btoa(JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id);
    dispatch({
      type: 'user/fetchSavedJobs',
      payload: { userID },
    });
    // }
  }, []);

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
  saved_jobs: user.saved_jobs,
  structure: accountAndcenter.structure,
  keywords_part: accountAndcenter.keywords_part,
}))(SavedJobs);
