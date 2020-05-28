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
          How Creativehire Works
        </Typography.Title>

        <Typography.Text strong         
          style={{
            marginBottom: 12,
          }}>
            <ol style={decription}>
              <li>Paste a job description from any job portal.</li>

              <li>Upload a link to a portfolio project.</li>

              <li>Enter the Project Name, Company Name, and Position Advertised.</li>

              <li>Scan and check the compatibility score between your portfolio project and the job description's requirements.</li>
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
