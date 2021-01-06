import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Space, Card, Typography, Button } from 'antd';
import { Link } from 'umi';


const button = {
  height: "3rem",
  width: "9rem",
};

const decription = {
  fontSize: "1.4em",
  lineHeight: "1.5em",
};


export default () => (
  <PageHeaderWrapper>
    <Card>
      <Space size='large' direction='vertical'>
        <Typography.Title level={2}>
          How Creative Hire Works
        </Typography.Title>

        <Typography.Text strong         
          style={{
            marginBottom: 12,
          }}>
            <ol style={decription}>
              <li>Sign up on Creative Hire and create your profile by uploading your resume and your projects.</li>

              <li>Check your keywords and optimize them on your projects as required.</li>

              <li>Start matching with jobs instantly!</li>

              <li>For more jobs, use our <Link to='/search-jobs'>Job Search Tool</Link> and find much more!</li>
            </ol>
        </Typography.Text>

        <p>
          <Button type="primary" shape="round" style={button}> 
            <Link to="/scan/new" style={{ fontSize: "17px" }}>
              Scan Now
            </Link>
          </Button>
        </p>
      </Space>



    </Card>

  </PageHeaderWrapper>
);
