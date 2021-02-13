import { List, Card, Popconfirm, Row, Col, message, Typography, Button, Alert } from 'antd';
import React, { useEffect } from 'react';
import { connect, Link } from 'umi';
// import moment from 'moment';
// import AvatarList from '../AvatarList';
import styles from './index.less';
import { history } from 'umi';

import axios from '../../../../../../umiRequestConfig';

const { Title, Text, Paragraph } = Typography;

let editMsg = 'Click to change ';

const Projects = (props) => {
  const { dispatch, projectList, userID, keywords_part } = props;

  useEffect(() => {
  }, [projectList]);
  
  function cancel(e) {
    // console.log(e);
  }


  return (
    <List
      className={styles.coverCardList}
      rowKey="id"
      grid={{
        gutter: 24,
        xxl: 1,
        xl: 1,
        lg: 1,
        md: 1,
        sm: 1,
        xs: 1,
      }}
      // pagination={(()=>{<Pagination defaultCurrent={1} total={50} />})}
      dataSource={projectList}
      renderItem={(item) => (
        <List.Item>
          {/* <Card className={styles.card} hoverable cover={<img alt={item.fields.project_title} src={item.fields.project_img} />}>
              <Card.Meta title={item.fields.project_title} description={new Date(item.fields.project_post_date).toDateString()} />
            </Card> */}
            <Card title={<Link to={`/project/${item.pk}`}>{item.fields.project_title}</Link>} extra={
                    <Popconfirm
                      title="Are you sure to delete this project?"
                      onConfirm={() => {
                        axios.delete(REACT_APP_AXIOS_API_V1.concat('project/'.concat(item.pk)))
                        .then((res) => { 
                          
                          if(res.status === 204){    
                            message.success('Successfully deleted project');
                            dispatch({
                              type: 'accountAndcenter/fetchProjects',
                              payload: { userID }
                            });
                            dispatch({
                              type: 'accountAndcenter/fetchCurrent',
                              payload: { userID: btoa(userID) },
                            });
                          }    
                        });
                      }}
                      onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        danger 
                        type="text"
                        size="middle"
                      >
                        Delete project
                      </Button>
                    </Popconfirm>
          }>
            <Row gutter={[0, 16]}>
              <Col xs={{ span: 24, offset: 0 }} lg={{ span: 24, offset: 0 }}>
                <Link to={`/project/${item.pk}${item.fields.project_img === 'https://picsum.photos/400' ? '?edit=true' : ''}`}>
                  { 
                    item.fields.project_img === 'https://picsum.photos/400' ? 
                    // editMsg += ' project link'
                      <Alert message="Click to change the project image" type="info" showIcon />
                    :
                    ''
                  }
                  <img className={styles.projectCover} alt={item.fields.project_title} src={item.fields.project_img} />
                </Link>
              </Col>
              {/* <Col xs={{ span: 24, offset: 0 }} lg={{ span: 12, offset: 4 }}>
                <Space size="large" direction="vertical">
                  <Link to={`/project/${item.pk}`}>
                    <Space size="small" direction="vertical">
                      <div className={styles.cardTitles}>Name: </div>
                      <Text>{item.fields.project_title}</Text>
                    </Space>
                  </Link>
                  <Space size="small" direction="vertical">
                    <div className={styles.cardTitles}>Link: </div>
                    <a href={item.fields.project_url} target="_blank" rel="noopener noreferrer">
                      <Text underline className={styles.link}>
                        {item.fields.project_url}
                      </Text>
                    </a>
                  </Space>
                  <Space size="small" direction="vertical">
                    <div className={styles.cardTitles}>Summary: </div>
                    <Paragraph ellipsis={{ rows: 3, expandable: true }}>
                      {item.fields.project_summary}
                    </Paragraph>
                  </Space>
                </Space>
              </Col> */}
            </Row>

            <Row gutter={[0, 0]}>
                <Col flex="100px">
                  <div className={styles.cardTitles}>Summary: </div>
                </Col>
                <Col flex="auto" />
              </Row>

              <Row gutter={[0, 16]}>
                <Col span={24}>
                  <Paragraph ellipsis={{ rows: 2, expandable: true}}>{item.fields.project_summary}</Paragraph>
                </Col>
              </Row>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default connect(({ accountAndcenter }) => ({
  projectList: accountAndcenter.projectList,
  keywords_part: accountAndcenter.keywords_part
}))(Projects);
