import { EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip, Space } from 'antd';
import React from 'react';
import { ChartCard } from './Charts';

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
  <Row gutter={24} type="flex">
    <Col {...topColResponsiveProps} xl={{ span: 7 }}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="Cover Image"
        action={
          <Tooltip title="Change the cover image">
            <EditOutlined />
          </Tooltip>
        }
      >
        <Space size="middle" direction="vertical">
          <Space size="large" direction="horizontal">
            <img src={project.img} style={{maxWidth: '100%', maxHeight: '100%', width: 'auto', marginTop: '1rem'}}/>
          </Space>
        </Space>
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps} xl={{ span: 7, offset: 5 }}>
      <ChartCard
        bordered={false}
        title="Project Details"
        action={
          <Tooltip title="Details about the project you entered">
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={loading}
      >
        <Space size="middle" direction="vertical">
          <Space size="large" direction="horizontal">
            <div>Project Title:</div>
            <div>{project.title}</div>
          </Space>
          <Space size="large" direction="horizontal">
            <div>Project Link:</div>
            <div>
                <a style={{ color: '#FF7A40' }} target="_blank" href={project.url}>
                  {extractHostname(project.url)}
                </a>

            </div>
          </Space>
          <Space size='large' direction='horizontal'>
            <div>Project Summary:</div>
            <div>{project.summary}</div>
          </Space>
        </Space>
      </ChartCard>
    </Col>
  </Row>
);

export default IntroduceRow;
