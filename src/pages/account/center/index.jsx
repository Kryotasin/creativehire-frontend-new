import { Card, Col, Divider, Row, Spin, Button, Space } from 'antd';
import React, { Component } from 'react';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'umi';

import { EditOutlined, EditTwoTone, LoadingOutlined } from '@ant-design/icons';
import styles from './Center.less';

import TagList from './components/sidebar/TagList';
import BasicDetails from './components/sidebar/BasicDetails';
import ProfileTabPane from './components/content/ProfileTabPane';
import FileUploader from './components/sidebar/FileUploader';



class Center extends Component {
  constructor(props) {
    super(props)

    // Bind the this context to the handler function
    this.handler = this.handler.bind(this);

    // Set some state
    this.state = {
        editMode: false,
    };
}

  // static getDerivedStateFromProps(
  //   props,
  //   state
  // ) {
  //   const { match, location } = props;
  //   const { tabKey } = state;
  //   const path = match && match.path;
  //   const urlTabKey = location.pathname.replace(`${path}/`, '');
  //   if (urlTabKey && urlTabKey !== '/' && tabKey !== urlTabKey) {
  //     return {
  //       tabKey: urlTabKey,
  //     };
  //   }
  //   return null;
  // }

  componentDidMount() {
    const { dispatch } = this.props;
    let userID;

    if (localStorage.getItem('accessTokenDecoded')){
      userID = JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id;
    }
    
    dispatch({
      type: 'accountAndcenter/fetchProjects',
      payload: {userID}
    });

  }

  handler() {
    this.setState({
        editMode: false
    });
  }

  render() { 
    const { currentUser = {}, entity_part = {}, keywords_part = {}, currentUserLoading, structure = {}, projectList = {}, fileuploading } = this.props;
    const dataLoading = currentUserLoading || !(currentUser && Object.keys(currentUser).length);
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    
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
              extra={<Button type="link" icon={this.state.editMode?<EditOutlined />:<EditTwoTone />} onClick={() => {
                this.setState((prevState) => ({editMode: !prevState.editMode}))
              }}/>}
              title="Basic Details"
            >
              {!dataLoading && (
                <div>
                  <BasicDetails entity={entity_part} editMode={this.state.editMode} action={this.handler}/>
                  <Divider />
                  
                  <Space size="large" direction="vertical">
                    <Space size="large">
                      <FileUploader />
                      {/* {fileuploading ? 
                          <Spin />
                      :
                      ''
                      } */}
                    </Space>
                    {
                      currentUser && structure ? 
                      <TagList keywords_part_input={keywords_part || []} structure={structure || []} />
                      :
                      <Spin />
                    }
                  </Space>

                  <Divider
                    style={{
                      marginTop: 16,
                    }}
                    
                  />

                </div>
              )}
            </Card>
          </Col>
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
          <Col lg={17} md={24}>
          {
            currentUser && structure ? 
            <ProfileTabPane /> : <Spin />
          }
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default connect(({ loading, accountAndcenter }) => ({
  currentUser: accountAndcenter.currentUser,
  entity_part: accountAndcenter.entity_part,
  keywords_part: accountAndcenter.keywords_part,
  candidate_part: accountAndcenter.candidate_part,
  structure: accountAndcenter.structure,
  projectList: accountAndcenter.projectList,
  currentUserLoading: loading.effects['accountAndcenter/fetchCurrent'],
  fileuploading: accountAndcenter.fileuploading
}))(Center);
