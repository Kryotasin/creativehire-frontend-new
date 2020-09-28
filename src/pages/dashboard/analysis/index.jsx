import React, { Component, Suspense } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Helmet } from 'umi';

import PageLoading from './components/PageLoading';

import axios from '../../../umiRequestConfig';

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));
const TopSearch = React.lazy(() => import('./components/TopSearch'));

class Analysis extends Component {

  reqRef = 0;

  timeoutId = 0;

  cat = null;

  subcat = null;

  label = null;

  loading = false;

  constructor(props) {
      super(props);
      this.state = {
          match: {},
          structure: null,
          job: null,
          project: null,
      }
  }

  componentDidMount() {

    const { matchID } = this.props.match.params;

    axios.get('scans/'.concat(matchID).concat('/'))
        .then(scanRes => {
            if(scanRes.status === 200){
                this.setState({
                    match: scanRes.data
                });
                
                axios.get('/metrics-structure/')
                .then(msRes => {
                    if(msRes.status === 200){
                        this.setState({structure: msRes.data});
                    }
                })

                const project = 'project/'.concat(scanRes.data.projectid);

                const job = 'jobpost/'.concat(scanRes.data.jobid);

                
                axios.get(project)
                .then(projectRes => {
                    this.setState({
                        project: projectRes.data
                    });
                })


                axios.get(job)
                .then(jobRes => {
                    this.setState({
                        job: jobRes.data
                    })
                })

            }

        })
        .catch(err => {
            if(err.response.status === 404){
                // this.props.history.push('/my-scans/')
            } 
        })

  }

  componentWillUnmount() {

    cancelAnimationFrame(this.reqRef);
    clearTimeout(this.timeoutId);
  }


  render() {

    return (
      <GridContent>
      <Helmet>
          <meta charSet="utf-8" />
    <title>Scan - {this.props.match.params.matchID}</title>
      </Helmet> 
        <React.Fragment>
          <Suspense fallback={<PageLoading />}>
            <IntroduceRow project={this.state.project} job={this.state.job} />
          </Suspense>


              <Suspense fallback={null}>
                {
                  this.state.match && this.state.structure && (<TopSearch 
                  match={this.state.match}
                  structure={this.state.structure}
                />)
                }
              </Suspense>

        </React.Fragment>
      </GridContent>
    );
  }
}

export default Analysis;