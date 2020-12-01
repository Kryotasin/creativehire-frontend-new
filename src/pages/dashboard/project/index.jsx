import React, { Suspense, useEffect, useState } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Helmet, connect } from 'umi';
import axios from '../../../umiRequestConfig';

import PageLoading from './components/PageLoading';

// import axios from '../../../umiRequestConfig';

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));
const SkillList = React.lazy(() => import('./components/SkillList/index.jsx'));

const Analysis = props => {
  // reqRef = 0;

  // timeoutId = 0;

  const { dispatch, structure } = props;
  const [ loading, setLoading ] = useState(false);
  const [ project, setProject ] = useState(undefined);


  useEffect(() => {
    if(Object.keys(structure).length === 0){
      dispatch({
        type: 'accountAndcenter/fetchStructure',
      });
    }
  }, [structure]);

  useEffect(() => {
    if(project === undefined){
      const { matchID } = props.match.params;
      axios
      .get(REACT_APP_AXIOS_API_V1.concat('project/').concat(matchID).concat('/'))
      .then((res) => {
        if (res.status === 200) {
          setProject(res.data);
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          // this.props.history.push('/my-scans/');
          console.log(err)
        }
      });
    }
  }, [project]);


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
          {project && (
            <IntroduceRow project={project} loading={loading} />
          )}
        </Suspense>

        <Suspense fallback={<PageLoading />}>
          {structure && (
            <SkillList
              structure={structure}
              project={project}
              loading={loading}
            />
          )}
        </Suspense>
      </React.Fragment>
    </GridContent>
  );
  
}

export default connect(({ accountAndcenter }) => ({
  structure: accountAndcenter.structure,
}))(Analysis);
