import { Avatar, Card, Dropdown, List, Menu, Tooltip, Spin } from 'antd';
import useSelection from 'antd/lib/table/hooks/useSelection';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';

import JobsList from '../../../../../homepage/components/jobslist';

const SavedJobs = (props) => {
  const { dispatch, saved_jobs, structure, keywords_part, userID } = props;

  useEffect(() => {
  }, [saved_jobs, userID]);

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
