import React, { Component, Suspense } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { Helmet } from 'umi';

import PageLoading from './components/PageLoading';

import axios from '../../../umiRequestConfig';

const IntroduceRow = React.lazy(() => import('./components/IntroduceRow'));
const SkillList = React.lazy(() => import('./components/SkillList'));

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
      structure: null,
      project: null,
    };
  }

  async componentDidMount() {
    const { matchID } = this.props.match.params;
    axios
      .get('project/'.concat(matchID).concat('/'))
      .then((scanRes) => {
        if (scanRes.status === 200) {
          this.setState({
            project: scanRes.data,
          });

          axios.get('/metrics-structure/').then((msRes) => {
            if (msRes.status === 200) {
              this.setState({ structure: msRes.data });
            }
          });
        }
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          // this.props.history.push('/my-scans/')
        }
      });
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
            {this.state.project && (
              <IntroduceRow project={this.state.project} loading={this.loading} />
            )}
          </Suspense>

          <Suspense fallback={null}>
            {this.state.structure && (
              <SkillList
                structure={this.state.structure}
                project={this.state.project}
                loading={this.loading}
              />
            )}
          </Suspense>
        </React.Fragment>
      </GridContent>
    );
  }
}

export default Analysis;
