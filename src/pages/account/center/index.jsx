import React, { useEffect, useState } from 'react';
import { Card, Col, Divider, Row, Spin, Button, Space } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'umi';

import { EditOutlined, EditTwoTone, LoadingOutlined } from '@ant-design/icons';

import TagList from './components/sidebar/TagList';
import BasicDetails from './components/sidebar/BasicDetails';
import ProfileTabPane from './components/content/ProfileTabPane';
import FileUploader from './components/sidebar/FileUploader';
import asyncLocalStorage from '../../../asyncLocalStorage';
import jwt_decode from 'jwt-decode';

const Center = (props) => {

  const {
    dispatch,
    currentUser = {},
    entity_part = {},
    keywords_part = {},
    currentUserLoading,
    structure = {},
    titleTypes,
    projectList,
  } = props;

  const [ dataLoading, setDataLoading ] = useState(true);
  // const dataLoading = currentUserLoading || !(currentUser && Object.keys(currentUser).length && Object.keys(titleTypes).length > 0);

  const [ editMode, setEditMode ] = useState(false);

  //----------------------------------------USER ID HANDLING--------------------------------------------------------------------

  const[ userID, setUserID ] = useState(undefined);

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
    if(userID !== undefined){
      if(Object.keys(currentUser).length === 0){
        dispatch({
          type: 'accountAndcenter/fetchCurrent',
          payload: { userID: btoa(userID) },
        });
      }
  
      if(Object.keys(projectList).length === 0){
        dispatch({
          type: 'accountAndcenter/fetchProjects',
          payload: { userID },
        });
      }
  
      if(Object.keys(titleTypes).length === 0){
        dispatch({
          type: 'accountAndcenter/fetchTitleTypes',
        });
      }
    }

  }, [currentUser, userID]);

  useEffect(() => {
    if(currentUser && Object.keys(currentUser).length > 0 && Object.keys(titleTypes).length > 0 && Object.keys(keywords_part).length > 0 && Object.keys(structure).length > 0){
      setDataLoading(false);
    }
    
  }, [currentUser, titleTypes, keywords_part, structure]);

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


  const handler = () => {
    setEditMode(false);
  }
    // const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

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
              extra={
                <Button
                  type="link"
                  icon={editMode ? <EditOutlined /> : <EditTwoTone />}
                  onClick={() => {
                    setEditMode(!editMode);
                  }}
                />
              }
              title="Basic Details"
            >
              {!dataLoading && (
                <div>
                  <BasicDetails
                    entity={entity_part}
                    editMode={editMode}
                    action={handler}
                    currentUser={currentUser}
                    titleTypes={titleTypes}
                    userID={userID}
                    dispatch={dispatch}
                  />
                  <Divider />

                  <Space size="large" direction="vertical">
                    <Space size="large">
                      <FileUploader userID={userID} />
                      {/* {fileuploading ? 
                          <Spin />
                      :
                      ''
                      } */}
                    </Space>
                    {currentUser && structure ? (
                      <TagList
                        keywords_part_input={keywords_part || []}
                        structure={structure || []}
                      />
                    ) : (
                      <Spin />
                    )}
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
            {!dataLoading && (<ProfileTabPane userID={userID} />)}
          </Col>
        </Row>
      </GridContent>
    );
  
}

export default connect(({ loading, accountAndcenter }) => ({
  currentUser: accountAndcenter.currentUser,
  entity_part: accountAndcenter.entity_part,
  keywords_part: accountAndcenter.keywords_part,
  candidate_part: accountAndcenter.candidate_part,
  structure: accountAndcenter.structure,
  projectList: accountAndcenter.projectList,
  currentUserLoading: loading.effects['accountAndcenter/fetchCurrent'],
  fileuploading: accountAndcenter.fileuploading,
  titleTypes: accountAndcenter.titleTypes,
}))(Center);
