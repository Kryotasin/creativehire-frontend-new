import React, { useEffect, useState } from 'react';
// import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'umi';

import { Spin } from 'antd';
import Recommended from './components/recommended';
import Saved from './components/saved';
import Random from './components/random';

import styles from './index.less';

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

      if(Object.keys(structure).length === 0){
        dispatch({
          type: 'accountAndcenter/fetchCurrent',
          payload: {userID}
        });
      }
    }
  }, [currentUser]);

  useEffect(() => {
  }, [structure, keywords_part, reccommended_jobs, random_jobs]);

  return (
    <div className={styles.main}>
        {
          structure ?
            <>
              <Recommended structure={structure} keywords_part={keywords_part} reccommended_jobs={reccommended_jobs} />
              {/* <Saved structure={structure} keywords_part={keywords_part} /> */}
              <Random structure={structure} keywords_part={keywords_part} random_jobs={random_jobs} />
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
  
