import { PlusOutlined } from '@ant-design/icons';
import { Card, List, Typography } from 'antd';
import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Link } from 'umi';
import axios from '../../../umiRequestConfig';

import styles from './style.less';

const { Text } = Typography;

const gaugeColor = (val) => {
  if (val >= 0 && val < 20) {
    return '#FF2600 ';
  }

  if (val >= 20 && val < 60) {
    return '#FF7A40';
  }

  if (val >= 60 && val <= 100) {
    return '#00A037';
  }
  return '';
};

function ProjectList() {
  const userID = localStorage.getItem('userID');
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      let data = await axios.post('portfolio/', {
        userID,
      });
      data = data.data;
      setProjects(data);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const nullData = { pk: -1 };
  const content = (
    <div className={styles.pageHeaderContent}>
      <p>All the projects you have completed.</p>
    </div>
  );

  return (
    <PageHeaderWrapper content={content}>
      <div className={styles.cardList}>
        <List
          rowKey="id"
          loading={loading}
          grid={{
            gutter: 24,
            xxl: 5,
            xl: 4,
            lg: 4,
            md: 4,
            sm: 1,
            xs: 1,
          }}
          dataSource={[nullData, ...projects]}
          renderItem={(item) => {
            if (item && item.pk !== -1) {
              return (
                <List.Item key={item.pk}>
                  <Link to={`/project/${item.pk}`}>
                    <Card
                      hoverable
                      className={styles.card}
                      cover={<img alt="cover" src={item.fields.img} />}
                    >
                      <Card.Meta
                        title={item.fields.title}
                        description={new Date(item.fields.posted_date).toDateString()}
                      />
                    </Card>
                  </Link>
                </List.Item>
              );
            }
          }}
        />
      </div>
    </PageHeaderWrapper>
  );
}

export default ProjectList;
