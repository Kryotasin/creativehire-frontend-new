import React, { useEffect, useState } from 'react';
// import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'umi';

import { Spin } from 'antd';
// import Recommended from './components/recommended';
// import Saved from './components/saved';
import JobsList from './components/jobslist';

import styles from './index.less';
import Recommended from './components/recommended';

const Homepage = (props) => {

  const { dispatch, structure, currentUser, keywords_part, reccommended_jobs, random_jobs } = props;


  useEffect(() => {
    if(currentUser){
      const userID = btoa(JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id);

      if(random_jobs === null || random_jobs === undefined){
        dispatch({
          type: 'user/fetchRandomJobs',
        });
      }

      if(reccommended_jobs === null || reccommended_jobs === undefined){
        dispatch({
          type: 'user/fetchRecommendedJobs',
        });
      }

      if(Object.keys(structure).length === 0){
        dispatch({
          type: 'accountAndcenter/fetchStructure',
        });
      }
    }
  }, [currentUser]);

  useEffect(() => {
    const userID = btoa(JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id);

    if(Object.keys(currentUser).length === 0){
      dispatch({
        type: 'accountAndcenter/fetchCurrent',
        payload: {userID}
      });
    }
  });

  useEffect(() => {
  }, [structure, keywords_part, reccommended_jobs, random_jobs]);
  

  const updateJobMatchItem = (jmID, joblistType, applyOrSave) => {
    dispatch({
      type: 'user/updateJobMatch',
      payload: {
        'jmID': jmID,
        'joblistType': joblistType,
        'applyOrSave': applyOrSave
      }
    })
  }
  
  return (
    <div className={styles.main}>
        {
          structure ?
            <>
              <JobsList 
                        title='All'
                        structure={structure} 
                        keywords_part={keywords_part} 
                        job_list={random_jobs} 
                        updateJobMatchItem={updateJobMatchItem}
                />
              <JobsList 
                      title='Recommended'
                      structure={structure} 
                      keywords_part={keywords_part} 
                      job_list={reccommended_jobs} 
                      updateJobMatchItem={updateJobMatchItem}
              />
            </>
          :
          <Spin />
        }
    </div>
  )
}
  // <PageHeaderWrapper>
    

  // </PageHeaderWrapper>


  export default connect(({ user, accountAndcenter }) => ({
    currentUser: user.currentUser,
    structure: accountAndcenter.structure,
    keywords_part: accountAndcenter.keywords_part,
    reccommended_jobs: user.reccommended_jobs,
    random_jobs: user.random_jobs
  }))(Homepage);
  
