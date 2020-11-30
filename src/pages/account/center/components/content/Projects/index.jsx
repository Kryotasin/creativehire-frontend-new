import { List, Card, Pagination, Row, Col, Space, Typography  } from 'antd';
import React, { useEffect } from 'react';
import { connect, Link } from 'umi';
// import moment from 'moment';
// import AvatarList from '../AvatarList';
import styles from './index.less';

const { Title, Text } = Typography;

const Projects = props => {
  const { projectList } = props;

  useEffect(() => {
    // console.log(projectList)
  })

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
      renderItem={item => (
        <List.Item>
          <Link to={`/project/${item.pk}`}>
            {/* <Card className={styles.card} hoverable cover={<img alt={item.fields.project_title} src={item.fields.project_img} />}>
              <Card.Meta title={item.fields.project_title} description={new Date(item.fields.project_post_date).toDateString()} />
            </Card> */}
            <Card>
              <Row gutter={[0, 16]}>
                <Col span={12}>
                  <img width={150} alt={item.fields.project_title} src={item.fields.project_img} />
                </Col>
                <Col span={12}>
                  <Space size='large' direction='vertical'>
                    <Space size='large' direction='horizontal'>
                      <Text strong>Name: </Text>
                      {item.fields.project_title}
                    </Space>
                    <Space size='large' direction='horizontal'>
                      <Text strong>Name: </Text>
                      <Text type="secondary">{item.fields.project_title}</Text>
                    </Space>
                    <Space size='large' direction='horizontal'>
                      <Title level={4}>Name: </Title>
                      {item.fields.project_title}
                    </Space>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Link>
        </List.Item>
      )}
    />
  );
};

export default connect(({ accountAndcenter }) => ({
  projectList: accountAndcenter.projectList,
}))(Projects);
