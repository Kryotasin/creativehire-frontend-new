import { HomeOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Row, Select, Spin } from 'antd';
import React, { Component } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'umi';

import csc from 'country-state-city';
import styles from './Center.less';


import Projects from './components/Projects';
import Articles from './components/Articles';
import Applications from './components/Applications';
import TagList from './components/TagList';

import axios from '../../../umiRequestConfig';

const { Option } = Select;



const operationTabList = [
  {
    key: 'profile',
    tab: (
      <span>
        Profile{' '}
        <span
          style={{
            fontSize: 14,
          }}
        >
          {/* (8) */}
        </span>
      </span>
    ),
  },
  {
    key: 'portfolio',
    tab: (
      <span>
        Portfolio{' '}
        <span
          style={{
            fontSize: 14,
          }}
        >
          {/* (8) */}
        </span>
      </span>
    ),
  },
  {
    key: 'savedjobs',
    tab: (
      <span>
        Saved Jobs{' '}
        <span
          style={{
            fontSize: 14,
          }}
        >
          {/* (8) */}
        </span>
      </span>
    ),
  },
  {
    key: 'appliedjobs',
    tab: (
      <span>
        Applied Jobs{' '}
        <span
          style={{
            fontSize: 14,
          }}
        >
          {/* (8) */}
        </span>
      </span>
    ),
  },
];


class Center extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      structure: undefined,
    }
  }

  static getDerivedStateFromProps(
    props,
    state
  ) {
    const { match, location } = props;
    const { tabKey } = state;
    const path = match && match.path;
    const urlTabKey = location.pathname.replace(`${path}/`, '');
    if (urlTabKey && urlTabKey !== '/' && tabKey !== urlTabKey) {
      return {
        tabKey: urlTabKey,
      };
    }
    return null;
  }

  state = {
    tabKey: 'articles',
  };

  input = undefined;

  componentDidMount() {
    const { dispatch } = this.props;
    let userID = 16;
    if (localStorage.getItem('accessTokenDecoded')){
      userID = JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id;
    }

    dispatch({
      type: 'accountAndcenter/fetchCurrent',
      payload: {userID}
    });

    if(this.state.structure ===  undefined){
      axios.get(REACT_APP_AXIOS_API_V1.concat('metrics-structure/'))
      .then(res => {
        if(res.status === 200){
          this.setState({structure: res.data})
        }
      })
    }

  }

  onTabChange = key => {
    // If you need to sync state to url
    // const { match } = this.props;
    // router.push(`${match.url}/${key}`);
    this.setState({
      tabKey: key,
    });
  };

  renderChildrenByTabKey = tabKey => {
    if (tabKey === 'profile') {
      return <Projects />;
    }

    if (tabKey === 'portfolio') {
      return <Projects />;
    }

    if (tabKey === 'savedjobs') {
      return <Applications />;
    }

    if (tabKey === 'appliedjobs') {
      return <Articles />;
    }

    return null;
  };

  onChange = value => {
    console.log(`selected ${value}`);
  }

  renderUserInfo = currentUser => (
    <div className={styles.detail}>
      {/* <div className={styles.supplement}>
      <Title level={4}>{(currentUser && currentUser !== undefined && currentUser !== null) ? currentUser.entity.first_name + " " + currentUser.entity.last_name : 'No Name'}</Title>
        
      </div> */}

      <div className={styles.supplement}>
        <HomeOutlined
          style={{
            marginRight: 8,
          }}
        />
        { currentUser.entity.user_location ? currentUser.entity.user_location :
          <>
            <Select
              showSearch
              style={{ width: 70 }}
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={this.onChange}
              optionLabelProp="label"
              // onFocus={onFocus}
              // onBlur={onBlur}
              // onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {csc.getAllCountries().map(item => (
                <Option key={item.id} value={item.sortname} label={item.name}>
                  <div>
                    {item.name}
                  </div>
                </Option>
              ))}
            </Select>
              <Select
              showSearch
              style={{ width: 70 }}
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={this.onChange}
              optionLabelProp="label"
              // onFocus={onFocus}
              // onBlur={onBlur}
              // onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {csc.getAllCountries().map(item => (
                <Option key={item.id} value={item.sortname} label={item.name}>
                  <div>
                    {item.name}
                  </div>
                </Option>
              ))}
            </Select>
          </>
        }
      </div>
      
      <div className={styles.supplement}>
        { currentUser.entity.user_summary }
      </div>

    </div>
  );


  render() {  
    const { tabKey } = this.state;
    const { currentUser = {}, currentUserLoading } = this.props;
    const dataLoading = currentUserLoading || !(currentUser && Object.keys(currentUser).length);
    
    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card
              bordered={false}
              style={{
                marginBottom: 24,
              }}
              loading={dataLoading}
            >
              {!dataLoading && (
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="" src={currentUser.avatar} />
                    <div className={styles.name}>{currentUser.entity.first_name + " " + currentUser.entity.last_name }</div>
                    <div>{currentUser.signature}</div>
                  </div>
                  {this.renderUserInfo(currentUser)}
                  <Divider dashed />
                  {
                    currentUser && this.state.structure ? 
                    <TagList tagsInput={JSON.parse(JSON.stringify(currentUser.keywords.ck_keywords)) || []} structure={this.state.structure || []}/>
                    :
                    <Spin />
                  }
                  <Divider
                    style={{
                      marginTop: 16,
                    }}
                    dashed
                  />
                  {/* <div className={styles.team}>
                    <div className={styles.teamTitle}>Team</div>
                    <Row gutter={36}>
                      {currentUser.notice &&
                        currentUser.notice.map(item => (
                          <Col key={item.id} lg={24} xl={12}>
                            <Link to={item.href}>
                              <Avatar size="small" src={item.logo} />
                              {item.member}
                            </Link>
                          </Col>
                        ))}
                    </Row>
                  </div> */}
                </div>
              )}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={tabKey}
              onTabChange={this.onTabChange}
            >
              {this.renderChildrenByTabKey(tabKey)}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default connect(({ loading, accountAndcenter }) => ({
  currentUser: accountAndcenter.currentUser,
  currentUserLoading: loading.effects['accountAndcenter/fetchCurrent'],
}))(Center);
