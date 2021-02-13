import React, { Suspense, useEffect, useState } from 'react';
import { message } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import { Helmet, connect } from 'umi';
import axios from '../../../umiRequestConfig';

import PageLoading from './components/PageLoading';

import asyncLocalStorage from '../../../asyncLocalStorage';

import jwt_decode from 'jwt-decode';
import { history } from 'umi';

// import axios from '../../../umiRequestConfig';

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));
const SkillList = React.lazy(() => import('./components/SkillList/index.jsx'));

const ProjectMain = (props) => {
  // reqRef = 0;

  // timeoutId = 0;

  const { dispatch, structure, currentUser } = props;
  // const [ loading, setLoading ] = useState(false);
  const [project, setProject] = useState(undefined);
  const [ userID, setUserID ] = useState(undefined);

  
  useEffect(() => {

    asyncLocalStorage.getItem('accessToken')
    .then((token) => {
      return JSON.parse(JSON.stringify(jwt_decode(token)))
    })
    .then((token) => {
      setUserID(token.user_id)
    })
    
  }, []);
  
  useEffect(() => {
      if(userID !== undefined && Object.keys(currentUser).length === 0){
        dispatch({
          type: 'accountAndcenter/fetchCurrent',
          payload: { userID: btoa(userID) },
        });
      }
  }, [userID]);

  useEffect(() => {
    if (Object.keys(structure).length === 0) {
      dispatch({
        type: 'accountAndcenter/fetchStructure',
      });
    }
  }, [structure]);

  useEffect(() => {
    if (project === undefined && userID !== undefined) {
      const { projectID } = props.match.params;
      axios
        .post(REACT_APP_AXIOS_API_V1.concat('project-fetch/'),{
          project_id: projectID,
          user_id: btoa(userID)
        })
        .then((res) => {
          if (res.status === 200) {
            setProject(res.data);
          }
          if(res.status === 204){
            message.error('You do not own this project!');
            setTimeout(() => history.push(`/account/center`), 1500);
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 404) {
            // this.props.history.push('/my-scans/');
            console.log(err);
          }
        });
    }
  }, [project, userID]);

  // componentWillUnmount() {
  //   cancelAnimationFrame(this.reqRef);
  //   clearTimeout(this.timeoutId);
  // }

  return (
    <GridContent>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{project ? project.project_title : 'Loading...'}</title>
      </Helmet>
      <React.Fragment>
        <Suspense fallback={<PageLoading />}>
          {project && <IntroduceRow project={project} />}
        </Suspense>

        <Suspense fallback={<PageLoading />}>
          {(Object.keys(structure).length > 0) && (
            <SkillList
              structure={structure}
              project={project}
              // loading={loading}
            />
          )}
        </Suspense>
      </React.Fragment>
    </GridContent>
  );
};

export default connect(({ accountAndcenter }) => ({
  structure: accountAndcenter.structure,
  currentUser: accountAndcenter.currentUser
}))(ProjectMain);
