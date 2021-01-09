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
} from 'antd';
import JobsList from '../homepage/components/jobslist';
import { DownOutlined } from '@ant-design/icons';

import styles from './index.less';

const { Panel } = Collapse;
const { Title } = Typography;

const Search = (props) => {
  const { dispatch, structure, keywords_part, employmentTypes, titleTypes, companies, search_all, searching } = props;

  const [remoteQuery, setRemoteQuery] = useState(false);
  const [employmentTypesQuery, setEmploymentTypesQuery] = useState([]);
  const [jobTitleQuery, setJobTitleQuery] = useState([]);
  const [companyQuery, setCompanyQuery] = useState([]);
  const [savedQuery, setSavedQuery] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState(false);
  const [matchPercentSortQuery, setMatchPercentSortQuery] = useState(2);

  const [ userID, setUserID ] = useState(undefined);

  // const [disabled, setDisabled] = useState(false);

  // const [queryResults, setQueryResults] = useState([]);

  const matchPercentSortItem = ['Sorting by ascending order', 'Sorting by descending order', 'Sort by Match Percent'];

  
  useEffect(() => {
    if(userID === undefined){
      setUserID(btoa(JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id));
    }
  }, [userID]);

  
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
    employmentTypesQuery,
    jobTitleQuery,
    companyQuery,
    savedQuery,
    appliedQuery,
    userID
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
      employment_types: employmentTypesQuery,
      job_title_types: jobTitleQuery,
      company: companyQuery,
      saved: savedQuery,
      applied: appliedQuery,
      match_percent_sort_query: matchPercentSortQuery,
    }

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
              defaultActiveKey={['1', '2', '3', '4', '5', '6']}
              expandIconPosition="right"
              className={styles.sitecollapsecustomcollapse}
            >
              <Panel header="Remote" key="1" className={styles.sitecollapsecustompanel}>
                <Checkbox disabled={searching} onChange={(e) => setRemoteQuery(e.target.checked)}>
                  Show remote jobs
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
            </Collapse>
          </Space>
        </Col>

        <Col xs={{ span: 24, offset: 0 }} lg={{ span: 18, offset: 1 }}>
          <Title level={4}>Results</Title>
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
