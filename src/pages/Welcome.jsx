import React, { useEffect, useState } from 'react';
// import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'umi';
import moment from 'moment';

import Homepage from './homepage';

const Welcome = () => {

  // const { dispatch, currentUser, reccommended_jobs } = props;

  // const [ data, setData ] = useState(undefined);

  // useEffect(() => {
  //   if(currentUser){
  //     dispatch({
  //       type: 'user/fetchMinJobs',
  //     });
  //     console.log(currentUser)
  //   }
  // }, [currentUser]);

  // useEffect(() => {
  //   if(reccommended_jobs){
  //     console.log(reccommended_jobs);
      
  //     setData(reccommended_jobs);
  //   }
  // }, [reccommended_jobs]);


  // const getPostedTime = (input) => {
  //   const temp = moment.duration(moment(input).diff(moment()));
  //   return temp.asDays();
  // }

  // const setProgressColor = matchPercent => {
  //   if(matchPercent > 50){
  //     return '#52c41a';
  //   }
  //   if(matchPercent < 20 ){
  //     return '#ff4d4f';
  //   }
  //   return '#1890ff';
  // }


  // const printJobTitle = title => {
  //   const parts = title.split(' ');
  //   return parts[0].concat(' ').concat(parts[1]).concat(parts[2] ? ' ...' : '');
  // }

  return (
    <Homepage />
  )
}
  // <PageHeaderWrapper>
    

  // </PageHeaderWrapper>


export default connect(({ user, accountAndcenter }) => ({
  // currentUser: user.currentUser,
  currentUser: accountAndcenter.currentUser,
}))(Welcome);
