import { EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip, Space, Card } from 'antd';
import React from 'react';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: {
    marginBottom: 24,
  },
};

const extractHostname = (url) => {
  let hostname;

  // find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }

  // find & remove port number
  hostname = hostname.split(':')[0];

  // find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
};

const IntroduceRow = ({ loading, project }) => (
  <Row gutter={[16, 32]} type="flex">
    <Col xs={{ span: 24 }} lg={{ span: 6, offset: 2 }}>
      <Card
        bordered={false}
        loading={loading}
        title="Cover Image"
        extra={
          <Tooltip title="Change the cover image">
            <EditOutlined />
          </Tooltip>
        }
      >
            <img alt={project.project_title} src={project.project_img} style={{maxWidth: '100%', maxHeight: '100%', width: 'auto'}}/>
      </Card>
    </Col>

    <Col xs={{ span: 24 }} lg={{ span: 10, offset: 6 }}>
      <Card
        bordered={false}
        title="Project Details"
        extra={
          <Tooltip title="Change project details">
            <EditOutlined />
          </Tooltip>
        }
        loading={loading}
      >
        <Space size="middle" direction="vertical">
          <Space size="large" direction="horizontal">
            <div>Project Title:</div>
            <div>{project.project_title}</div>
          </Space>
          <Space size="large" direction="horizontal">
            <div>Project Link:</div>
            <div>
                <a style={{ color: '#FF7A40' }} target="_blank" rel="noreferrer" href={project.project_url}>
                  {extractHostname(project.project_url)}
                </a>

            </div>
          </Space>
          <Space size='large' direction='horizontal'>
            <div>Project Summary:</div>
            <div>{project.project_summary}</div>
          </Space>
        </Space>
      </Card>
    </Col>
  </Row>
);

export default IntroduceRow;
