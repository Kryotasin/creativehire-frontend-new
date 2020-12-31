import { Avatar, Card, Dropdown, List, Menu, Tooltip, Spin } from 'antd';
import useSelection from 'antd/lib/table/hooks/useSelection';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';

import JobsList from '../../../../../homepage/components/jobslist';

const Applications = (props) => {
  const { dispatch, applied_jobs, structure, keywords_part } = props;
  // Object.keys(appliedJobs).length === 0

  useEffect(() => {
    // if(applied_jobs===undefined){
    const userID = btoa(JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id);
    dispatch({
      type: 'user/fetchAppliedJobs',
      payload: { userID },
    });
    // }
  }, []);

  useEffect(() => {
  }, [applied_jobs]);

  return (
    <>
      {!(applied_jobs === undefined) ? (
        <JobsList
          title="Applied"
          structure={structure}
          keywords_part={keywords_part}
          job_list={applied_jobs}
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
  applied_jobs: user.applied_jobs,
  structure: accountAndcenter.structure,
  keywords_part: accountAndcenter.keywords_part,
}))(Applications);
