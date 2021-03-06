import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Space, Card, Typography, Button } from 'antd';
import styles from './Welcome.less';
import { Link } from 'umi';



const button = {
  height: "3rem",
  width: "9rem",
};


export default () => (
  <PageHeaderWrapper>
    <Card>
      <Space size='large' direction='vertical'>
        <Typography.Title level={2}>
            Welcome to Creative Hire
        </Typography.Title>

        <Typography.Text strong         
          style={{
            marginBottom: 12,
          }}>
          Make Smart Decisions in your UX job applications
        </Typography.Text>

        <p>
          <Button type="primary" shape="round" style={button}> 
            <Link to="scan/new" style={{ fontSize: "17px" }}>
              Scan Now
            </Link>
          </Button>
        </p>
      </Space>



    </Card>

  </PageHeaderWrapper>
);
