import React, { useEffect, useState } from 'react';
// import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'umi';

import { Button, Spin } from 'antd';
// import Recommended from './components/recommended';
// import Saved from './components/saved';
import JobsList from './components/jobslist';

import styles from './index.less';
import Recommended from './components/recommended';

import asyncLocalStorage from '../../asyncLocalStorage';
import jwt_decode from 'jwt-decode';
import { Link } from 'umi';

const Homepage = (props) => {
  const {
    dispatch,
    structure,
    currentUser,
    keywords_part,
    reccommended_jobs,
    random_jobs,
    candidate_part
  } = props;

  //----------------------------------------USER ID HANDLING--------------------------------------------------------------------
  const [ userID, setUserID ] = useState(undefined);

  // const [ userIDInterval, setUserIDInterval ] = useState(undefined);

  useEffect(() => {

    asyncLocalStorage.getItem('accessToken')
    .then((token) => {
      return JSON.parse(JSON.stringify(jwt_decode(token)))
    })
    .then((token) => {
      setUserID(token.user_id)
    })
    
  }, []);

  // useEffect(() =>{
  //   setUserIDInterval(setInterval(()=>{
  //     try{
  //       setUserID(JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id);
  //     }
  //     catch(err){
  //       console.log(err);
  //     }
  //   }, 100));

  //   return () => clearInterval(userIDInterval);
  // }, []);

  // useEffect(() => {
  //   if(userID !== undefined){
  //     clearInterval(userIDInterval);
  //   }
  // }, [userID, userIDInterval]);
  
  //------------------------------------------------------------------------------------------------------------

  
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

  useEffect(() => {
    
    if (currentUser && userID !== undefined) {
      // if(random_jobs === null || random_jobs === undefined){
      dispatch({
        type: 'user/fetchRandomJobs',
        payload: { userID: userID },
      });
      // }

      // if(reccommended_jobs === null || reccommended_jobs === undefined){
      dispatch({
        type: 'user/fetchRecommendedJobs',
        payload: { userID: userID },
      });
      // }

      if (Object.keys(structure).length === 0) {
        dispatch({
          type: 'accountAndcenter/fetchStructure',
        });
      }
    }
  }, [userID]);


  useEffect(() => {}, [structure, keywords_part, reccommended_jobs, random_jobs]);

  return (
    <div className={styles.main}>
      {structure ? (
        <>
        <JobsList
            title="Recommended"
            structure={structure}
            keywords_part={keywords_part}
            job_list={reccommended_jobs}
            showExtra={true}
            dispatch={dispatch}
            pageSize={6}
            // updateJobMatchItem={updateJobMatchItem}
          />
          <JobsList
            title="All"
            structure={structure}
            keywords_part={keywords_part}
            job_list={random_jobs}
            showExtra={true}
            dispatch={dispatch}
            pageSize={6}
            // updateJobMatchItem={updateJobMatchItem}
          />
          
        </>
      ) : (
        <Spin />
      )}
    </div>
  );
};
// <PageHeaderWrapper>

// </PageHeaderWrapper>

export default connect(({ user, accountAndcenter }) => ({
  // currentUser: user.currentUser,
  currentUser: accountAndcenter.currentUser,
  structure: accountAndcenter.structure,
  keywords_part: accountAndcenter.keywords_part,
  candidate_part: accountAndcenter.candidate_part,
  reccommended_jobs: user.reccommended_jobs,
  random_jobs: user.random_jobs,
}))(Homepage);
