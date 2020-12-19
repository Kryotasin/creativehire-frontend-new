import { Avatar, Card, Dropdown, List, Menu, Tooltip, Spin } from 'antd';
import useSelection from 'antd/lib/table/hooks/useSelection';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';

import JobsList from '../../../../../homepage/components/jobslist';

const SavedJobs = (props) => {
  const { dispatch, savedJobs, structure, keywords_part } = props;
  // Object.keys(savedJobs).length === 0 &&
  useEffect(() => {
    // if(savedJobs===undefined){
    const userID = btoa(JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id);
    dispatch({
      type: 'accountAndcenter/fetchSavedJobs',
      payload: { userID },
    });
    // }
  }, []);

  return (
    <>
      {!(savedJobs === undefined) ? (
        <JobsList
          title=""
          structure={structure}
          keywords_part={keywords_part}
          job_list={savedJobs}
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
  savedJobs: accountAndcenter.savedJobs,
  structure: accountAndcenter.structure,
  keywords_part: accountAndcenter.keywords_part,
}))(SavedJobs);
