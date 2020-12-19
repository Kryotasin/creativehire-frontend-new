import { Avatar, Card, Dropdown, List, Menu, Tooltip, Spin } from 'antd';
import useSelection from 'antd/lib/table/hooks/useSelection';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';

import JobsList from '../../../../../homepage/components/jobslist';

const Applications = (props) => {
  const { dispatch, appliedJobs, structure, keywords_part } = props;
  // Object.keys(appliedJobs).length === 0

  useEffect(() => {
    // if(appliedJobs===undefined){
    const userID = btoa(JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id);
    dispatch({
      type: 'accountAndcenter/fetchAppliedJobs',
      payload: { userID },
    });
    // }
  }, []);

  return (
    <>
      {!(appliedJobs === undefined) ? (
        <JobsList
          title=""
          structure={structure}
          keywords_part={keywords_part}
          job_list={appliedJobs}
          maxGridSize={2}
          pageSize={6}
          // updateJobMatchItem={updateJobMatchItem}
        />
      ) : (
        <Spin />
      )}
    </>
  );
};

export default connect(({ accountAndcenter }) => ({
  appliedJobs: accountAndcenter.appliedJobs,
  structure: accountAndcenter.structure,
  keywords_part: accountAndcenter.keywords_part,
}))(Applications);
