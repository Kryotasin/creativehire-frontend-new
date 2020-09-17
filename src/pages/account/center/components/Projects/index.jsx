import { List, Card, Pagination  } from 'antd';
import React, { useEffect } from 'react';
import { connect, Link } from 'umi';
// import moment from 'moment';
// import AvatarList from '../AvatarList';
import styles from './index.less';

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
        xxl: 3,
        xl: 2,
        lg: 2,
        md: 2,
        sm: 2,
        xs: 1,
      }}
      // pagination={(()=>{<Pagination defaultCurrent={1} total={50} />})}
      dataSource={projectList}
      renderItem={item => (
        <List.Item>
          <Link to={`/portfolio/project/${item.pk}`}>
            <Card className={styles.card} hoverable cover={<img alt={item.fields.project_title} src={item.fields.project_img} />}>
              <Card.Meta title={item.fields.project_title} description={new Date(item.fields.project_post_date).toDateString()} />
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
