import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Row, Tooltip, Space } from 'antd';
import React from 'react';
import { ChartCard} from './Charts';

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

  if (url.indexOf("//") > -1) {
      hostname = url.split('/')[2];
  }
  else {
      hostname = url.split('/')[0];
  }

  // find & remove port number
  hostname = hostname.split(':')[0];

  // find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}

const IntroduceRow = ({ loading, project, job }) => (
  <Row gutter={24} type="flex">
    <Col  {...topColResponsiveProps} xl={{ span: 7, offset: 5 }} > 
      <ChartCard
        bordered={false}
        title="Project Details"
        action={
          <Tooltip title="Details about the project you entered">
            <InfoCircleOutlined />
          </Tooltip>
        }
        loading={loading}
        contentHeight={120}
      >
      <Space size="middle" direction="vertical">
        <Space size="large" direction="horizontal">
          <div>
            Project Title:
          </div>
          <div>
            {project ? project.title : ''}
          </div>
        </Space>
        <Space size="large" direction="horizontal">
          <div>
            Project Link:
          </div>
          <div>
          {project ?
            <a style={{color: '#FF7A40'}} target="_blank" href={project.url}>{extractHostname(project.url)}</a>
            : ''
           }
          </div>
        </Space>
      </Space>
      </ChartCard>
    </Col>

    <Col {...topColResponsiveProps} xl={{ span: 7 }}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="Job Details"
        action={
          <Tooltip title="Job details you have entered">
            <InfoCircleOutlined />
          </Tooltip>
        }
        contentHeight={120}
      >
        <Space size="middle" direction="vertical">
          <Space size="large" direction="horizontal">
            <div>
              Job Title:
            </div>
            <div>
              {job ? job.title : ''}
            </div>
          </Space>
          <Space size="large" direction="horizontal">
            <div>
              Job Link:
            </div>
            <div>
              {job ?
                <a style={{color: '#FF7A40'}} href={job.link_jp}>{extractHostname(job.link_jp)}</a>
                  : ''
              }
            </div>
          </Space>
          <Space size="large" direction="horizontal">
            <div>
              Company/Org:
            </div>
            <div>
              {job ? job.org : ''}
            </div>
          </Space>
        </Space>      
      </ChartCard>
    </Col>
  </Row>
);

export default IntroduceRow;
