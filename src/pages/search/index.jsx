import React, { useEffect, useState } from 'react';
// import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'umi';
import {
  Collapse,
  Typography,
  Row,
  Col,
  Button,
  Checkbox,
  Space,
  Menu,
  Dropdown,
  Slider,
  Divider,
} from 'antd';
import JobsList from '../homepage/components/jobslist';
import { DownOutlined } from '@ant-design/icons';

import styles from './index.less';
import asyncLocalStorage from '../../asyncLocalStorage';
import jwt_decode from 'jwt-decode';

const { Panel } = Collapse;
const { Title } = Typography;

const Search = (props) => {
  const { dispatch, structure, keywords_part, employmentTypes, titleTypes, companies, search_all, searching } = props;

  const [remoteQuery, setRemoteQuery] = useState(false);
  const [h1bQuery, setH1BQuery] = useState(false);
  const [optQuery, setOptQuery] = useState(false);
  const [stemOptQuery, setStemOptQuery] = useState(false);
  const [employmentTypesQuery, setEmploymentTypesQuery] = useState([]);
  const [jobTitleQuery, setJobTitleQuery] = useState([]);
  const [companyQuery, setCompanyQuery] = useState([]);
  const [savedQuery, setSavedQuery] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState(false);

  const [viewedQuery, setViewedQuery] = useState(false);
  const [newQuery, setNewQuery] = useState(false);
  const [tracker, setTracker] = useState(undefined);
  
  const [matchPercentRangeQuery, setMatchPercentRangeQuery] = useState([]);
  const [matchPercentSortQuery, setMatchPercentSortQuery] = useState(2);

  const [ userID, setUserID ] = useState(undefined);

  const[tooltipVisible, setTooltipVisible] = useState(true);

  // const [disabled, setDisabled] = useState(false);

  // const [queryResults, setQueryResults] = useState([]);

  const matchPercentSortItem = ['Sorting by ascending order', 'Sorting by descending order', 'Sort by Match Percent'];

  useEffect(() => {
    if(props.location.query.visited && atob(props.location.query.visited) === 'True'){
      setViewedQuery(true);
    }

    if(props.location.query.posted_today && atob(props.location.query.posted_today) === 'True'){
      setNewQuery(true);
    }

    if(props.location.query.tracker && props.location.query.tracker !== undefined){
      setTracker(props.location.query.tracker);
    }

  }, []);

  
  useEffect(() => {

    asyncLocalStorage.getItem('accessToken')
    .then((token) => {
      return JSON.parse(JSON.stringify(jwt_decode(token)))
    })
    .then((token) => {
      setUserID(btoa(token.user_id))
    })
    
  }, []);

  
  useEffect(() => {

    if (Object.keys(structure).length === 0) {
      dispatch({
        type: 'accountAndcenter/fetchStructure',
      });
    }

    if (Object.keys(keywords_part).length === 0 && userID !== undefined) {
      dispatch({
        type: 'accountAndcenter/fetchCurrent',
        payload: { userID },
      });
    }
  }, [userID]);

  useEffect(() => {
    if (Object.keys(employmentTypes).length === 0) {
      dispatch({
        type: 'accountAndcenter/fetchEmploymentTypes',
      });
    }
  }, [employmentTypes]);

  useEffect(() => {
    if (Object.keys(titleTypes).length === 0) {
      dispatch({
        type: 'accountAndcenter/fetchTitleTypes',
      });
    }
  }, [titleTypes]);

  useEffect(() => {
    if (Object.keys(companies).length === 0) {
      dispatch({
        type: 'accountAndcenter/fetchCompanies',
      });
    }
  }, [companies]);

  useEffect(() => {
    if(userID !== undefined){runSearchQuery();}
  }, [
    remoteQuery,
    h1bQuery,
    optQuery,
    stemOptQuery,
    employmentTypesQuery,
    jobTitleQuery,
    companyQuery,
    savedQuery,
    appliedQuery,
    viewedQuery,
    newQuery,
    tracker,
    userID,
    matchPercentRangeQuery
  ]);

  useEffect(() => {

  }, [searching]);

  useEffect(() => {
    if (matchPercentSortQuery === 0 || matchPercentSortQuery === 1) {
      runSearchQuery();
    }
  }, [matchPercentSortQuery]);

  const runSearchQuery = () => {

    const data = {
      id: userID,
      type: props.location.query.type,
      remote: remoteQuery,
      h1b: h1bQuery,
      opt: optQuery,
      stem_opt: stemOptQuery,
      employment_types: employmentTypesQuery,
      job_title_types: jobTitleQuery,
      company: companyQuery,
      saved: savedQuery,
      applied: appliedQuery,
      viewed: viewedQuery,
      new: newQuery,
      tracker: tracker,
      match_percent_range_query: matchPercentRangeQuery,
      match_percent_sort_query: matchPercentSortQuery,
    };

    dispatch({
      type: 'user/fetchSearchJobs',
      payload: data
    });
    
  };

  const menu = (
    <Menu onClick={(e) => setMatchPercentSortQuery(Number(e.key))}>
      <Menu.Item key="0">Ascending</Menu.Item>
      <Menu.Item key="1">Descending</Menu.Item>
      <Menu.Item key="2">None</Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.holder}>
      <Row gutter={[16, 32]}>
        <Col xs={{ span: 24, offset: 0 }} lg={{ span: 5, offset: 0 }}>
          <Space direction="vertical" size="middle">
            <Title level={3}>Filters</Title>
            <Button type="primary" onClick={runSearchQuery}>
              Apply filters
            </Button>
            <Collapse
              defaultActiveKey={['0', '1', '2', '3', '4', '5', '6', '7', '8']}
              expandIconPosition="right"
              className={styles.sitecollapsecustomcollapse}
              onChange={(e) => {
                if(e.includes('0')){
                  setTooltipVisible(true);
                }
                else{
                  setTooltipVisible(false);
                }
              }}
            >
              <Panel header="Match Percent" key="0" className={styles.sitecollapsecustompanel}>
                <Slider disabled={searching} range={{ draggableTrack: true }} defaultValue={[20, 90]} tooltipVisible={tooltipVisible} className={styles.match_percent} 
                // step={10} 
                  onChange={(value) =>{
                  }}

                  onAfterChange={(value) =>{
                    setMatchPercentRangeQuery(value);
                  }}
                />
              </Panel>
              <Panel header="Benefits" key="1" className={styles.sitecollapsecustompanel}>
                <Checkbox disabled={searching} onChange={(e) => setRemoteQuery(e.target.checked)}>
                  Remote work
                </Checkbox>
                <Divider />
                <Checkbox disabled={searching} onChange={(e) => setH1BQuery(e.target.checked)}>
                  Sponsors H1B
                </Checkbox>
                <br />
                <Checkbox disabled={searching} onChange={(e) => setOptQuery(e.target.checked)}>
                  Sponsors OPT 
                </Checkbox>
                <br />
                <Checkbox disabled={searching} onChange={(e) => setStemOptQuery(e.target.checked)}>
                  Sponsors STEM-OPT 
                </Checkbox>
              </Panel>
              <Panel header="Employment Type" key="2" className={styles.sitecollapsecustompanel}>
                <Checkbox.Group
                  disabled={searching}
                  onChange={(checkedValues) => setEmploymentTypesQuery(checkedValues)}
                >
                  <Row gutter={[0, 8]}>
                    {
                      Object.keys(employmentTypes).map((k) => (
                        <Col key={k} span={24}>
                          <Checkbox value={k}>{employmentTypes[k]}</Checkbox>
                        </Col>
                      ))
                    }
                  </Row>
                </Checkbox.Group>
              </Panel>
              <Panel header="Job Title" key="3" className={styles.sitecollapsecustompanel}>
                <Checkbox.Group
                  disabled={searching}
                  onChange={(checkedValues) => setJobTitleQuery(checkedValues)}
                >
                  <Row gutter={[0, 8]}>
                    {
                      Object.keys(titleTypes).map((k) => (
                        <Col key={k} span={24}>
                          <Checkbox value={k}>{titleTypes[k]}</Checkbox>
                        </Col>
                      ))
                    }
                  </Row>
                </Checkbox.Group>
              </Panel>
              <Panel header="Company" key="4" className={styles.sitecollapsecustompanel}>
                <Checkbox.Group
                  disabled={searching}
                  onChange={(checkedValues) => setCompanyQuery(checkedValues)}
                >
                  <Row gutter={[0, 8]}>
                    {
                      Object.keys(companies).map((k) => (
                        <Col key={k} span={24}>
                          <Checkbox value={k}>{companies[k]}</Checkbox>
                        </Col>
                      ))
                    }
                  </Row>
                </Checkbox.Group>
              </Panel>
              <Panel header="Saved" key="5" className={styles.sitecollapsecustompanel}>
                <Checkbox disabled={searching} onChange={(e) => setSavedQuery(e.target.checked)}>
                  Show saved jobs
                </Checkbox>
              </Panel>
              <Panel header="Applied" key="6" className={styles.sitecollapsecustompanel}>
                <Checkbox disabled={searching} onChange={(e) => setAppliedQuery(e.target.checked)}>
                  Show jobs I applied to
                </Checkbox>
              </Panel>
              <Panel header="Not yet seen" key="7" className={styles.sitecollapsecustompanel}>
                <Checkbox disabled={searching} checked={viewedQuery} onChange={(e) => setViewedQuery(e.target.checked)}>
                  Show jobs I haven't seen
                </Checkbox>
              </Panel>
              <Panel header="New" key="8" className={styles.sitecollapsecustompanel}>
                <Checkbox disabled={searching} checked={newQuery} onChange={(e) => setNewQuery(e.target.checked)}>
                  Show jobs posted today
                </Checkbox>
              </Panel>
            </Collapse>
          </Space>
        </Col>

        <Col xs={{ span: 24, offset: 0 }} lg={{ span: 18, offset: 1 }}>
          <Title level={4}>Results {search_all ? '(Showing '.concat(String(Object.keys(search_all).length)).concat(' results)') : ''} </Title>
          <Space direction="horizontal" size="middle">
            <Dropdown overlay={menu} placement="bottomRight" arrow trigger={['click']}>
              <Button>
                {matchPercentSortItem[matchPercentSortQuery]} <DownOutlined />
              </Button>
            </Dropdown>
          </Space>
          <div className={styles.mainCard}>
            <JobsList
              // title={props.location.query.type.charAt(0).toUpperCase().concat(props.location.query.type.slice(1))}
              title="Search all"
              structure={structure}
              keywords_part={keywords_part}
              job_list={search_all}
              showExtra={false}
              maxGridSize={2}
              pageSize={10}
              dispatch={dispatch}
              runSearchQuery={runSearchQuery}
              savedQuery={savedQuery}
              // updateJobMatchItem={updateJobMatchItem}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default connect(({ user, accountAndcenter }) => ({
  structure: accountAndcenter.structure,
  keywords_part: accountAndcenter.keywords_part,
  employmentTypes: accountAndcenter.employmentTypes,
  titleTypes: accountAndcenter.titleTypes,
  companies: accountAndcenter.companies,
  search_all: user.search_all,
  searching: user.searching
}))(Search);
