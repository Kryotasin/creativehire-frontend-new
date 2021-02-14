import React, { useEffect, useState } from 'react';
import { Row, Col, Space, Typography, Tag, Button, Popconfirm } from 'antd';

import {
  CloseCircleTwoTone,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CheckCircleTwoTone
} from '@ant-design/icons';
import styles from '../index.less';

const { Paragraph, Title, Text } = Typography;

const colors = new Map();
  
colors.set('custom', '#f50');
colors.set('resume', '#87d068');
colors.set('projects', '#108ee9');


const JobCardData = (props) => {
  const { jobData, structure, keywords_part, updateJobMatchItem, title } = props;

  const [jobKeys, setJobKeys] = useState(undefined);
  
  const [ applied, setApplied ] = useState(undefined);
  const [ saved, setSaved ] = useState(undefined);
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  
  useEffect(() => {
    if (jobKeys === undefined) {
      const temp = [];
      jobData.jobpost_data.jobpost_keywords.forEach((e, v) => {
        temp.push(e.split(',')[0]);
      });
      setJobKeys(uniqueItems(temp));
    }

    if(applied === undefined) {
      setApplied(jobData.jm_data.jm_applied_by_candidate);
    }

    if(saved === undefined) {
      setSaved(jobData.jm_data.jm_saved_by_candidate);
    }

  }, [jobData]);

  const uniqueItems = (arr) => {
    return arr.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  };

  function cancel(e) {
    console.log(e);
  }

  const printProjectTags = () => {
    const output = [];
    if (jobKeys !== undefined) {
      jobKeys.forEach((e) => {
        if (keywords_part.ck_keywords.projects.includes(parseInt(e, 10))) {
          output.push(
            <Tag className={styles.tags} color={colors.get('projects')} key={e}>
              {structure[3][e]}
            </Tag>,
          );
        } else {
          output.push(
            <Tag className={styles.tags} color="grey" key={e}>
              {structure[3][e]}
            </Tag>,
          );
        }
      });
    }
    return output;
  };

  const printResumeTags = () => {
    const output = [];
    if (jobKeys !== undefined) {
      jobKeys.forEach((e) => {
        if (keywords_part.ck_keywords.resume.includes(parseInt(e, 10))) {
          output.push(
            <Tag className={styles.tags} color={colors.get('resume')} key={'project-'.concat(e)}>
              {structure[3][e]}
            </Tag>,
          );
        } else {
          output.push(
            <Tag className={styles.tags} color="grey" key={'resume-'.concat(e)}>
              {structure[3][e]}
            </Tag>,
          );
        }
      });
    }
    return output;
  };
  
  function createMarkup(text) {
    return {__html: text};
  }

  return (
    <>
      {jobData && structure ? (
        <>
          <Row>
            <Col xs={2} sm={4} md={6} lg={6} xl={8}>
              <img src={jobData.jobpost_data.jobpost_img} width={100} alt="Tes" />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <Space direction="vertical" size={0}>
                <Title level={2}>{jobData.jobpost_data.jobpost_company}</Title>
                <Title level={4}>{jobData.jobpost_data.jobpost_title}</Title>
                <Text strong>{jobData.jobpost_data.jobpost_company}</Text>
              </Space>
            </Col>
          </Row>
          <Row gutter={[16, 36]} align="top">
            <Col xs={8} sm={8} md={4} lg={6} xl={8}>
              <div className={styles.conditions}>
                {
                  jobData.jobpost_data.jobpost_sponsors_h1b === '1' ? 
                    <>
                      <CheckCircleTwoTone twoToneColor="#52c41a"/>
                      <Text strong className={styles.visa_remote}>H1B</Text>
                    </>
                  : jobData.jobpost_data.jobpost_sponsors_h1b === '0' ?
                  <>
                    <CloseCircleTwoTone twoToneColor="#ff4d4f" />
                    <Text strong className={styles.visa_remote}>H1B</Text>
                  </>
                  : ''
                }
              </div>

              <div className={styles.conditions}>
                {
                  jobData.jobpost_data.jobpost_opt === '1' ? 
                    <>
                      <CheckCircleTwoTone twoToneColor="#52c41a"/>
                      <Text strong className={styles.visa_remote}>OPT</Text>
                    </>
                  : jobData.jobpost_data.jobpost_opt === '0' ?
                  <>
                    <CloseCircleTwoTone twoToneColor="#ff4d4f" />
                    <Text strong className={styles.visa_remote}>OPT</Text>
                  </>
                  : ''
                }
              </div>

              <div className={styles.conditions}>
                {
                  jobData.jobpost_data.jobpost_stem_opt === '1' ? 
                    <>
                      <CheckCircleTwoTone twoToneColor="#52c41a"/>
                      <Text strong className={styles.visa_remote}>STEM OPT</Text>
                    </>
                  : jobData.jobpost_data.jobpost_stem_opt === '0' ?
                  <>
                    <CloseCircleTwoTone twoToneColor="#ff4d4f" />
                    <Text strong className={styles.visa_remote}>STEM OPT</Text>
                  </>
                  : ''
                }
              </div>

              <div className={styles.conditions}>
                {
                  jobData.jobpost_data.jobpost_remote === '1' ? 
                    <>
                      <CheckCircleTwoTone twoToneColor="#52c41a"/>
                      <Text strong className={styles.visa_remote}>Remote</Text>
                    </>
                  : jobData.jobpost_data.jobpost_remote === '0' ?
                  <>
                    <CloseCircleTwoTone twoToneColor="#ff4d4f" />
                    <Text strong className={styles.visa_remote}>Remote</Text>
                  </>
                  : ''
                }
              </div>
            </Col>

            <Col
              // push={8}
              xs={{ span: 6 }}
              sm={{ span: 6 }}
              md={{ span: 6, push:6 }}
              lg={{ span: 6, push:8 }}
              xl={{ span: 6, push:8 }}
            >
              <Space size="large">
                
                  {applied ? (
                      <a
                      href={jobData.jobpost_data.jobpost_application_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        type="primary"
                        style={{
                          background: 'white',
                          color: '#52c41a',
                          borderColor: '#52c41a',
                        }}
                        icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                      >
                        Applied
                      </Button>
                    </a>
                  ) : (
                    <Popconfirm
                      title="Did you apply for this job?"
                      onConfirm={() => {
                        setApplied(true);
                        updateJobMatchItem(jobData.jm_data.id, title, 'apply');
                      }}
                      onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button type="primary" onClick={() => window.open(jobData.jobpost_data.jobpost_application_link)}>Apply</Button>
                    </Popconfirm>
                    
                  )}

                {saved ? (
                  <Button
                    onClick={() => {
                      setSaved(false);
                      updateJobMatchItem(jobData.jm_data.id, title, 'save');
                    }}
                    style={{backgroundColor: 'white', color: '#091b7b', borderColor: '#091b7b' }}
                  >
                    Unsave
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setSaved(true);
                      updateJobMatchItem(jobData.jm_data.id, title, 'save');
                    }}
                    style={{backgroundColor: '#091b7b', color: 'white' }}
                  >
                    Save
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
          <Row gutter={[72, 36]}>
            <Col xs={24} sm={24} md={10} lg={10} xl={14}>
              <Paragraph ellipsis={{ rows: 20, expandable: true, symbol: 'more' }}>{console.log(jobData.jobpost_data)}
                {/* {jobData.jobpost_data.jobpost_description} */}
                <div dangerouslySetInnerHTML={createMarkup(jobData.jobpost_data.jobpost_description)} />
              </Paragraph>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={10}>
              <div className={styles.projectTags}>
                <Title level={3}>Projects</Title>
                {printProjectTags()}
              </div>
              <div className={styles.resumeTags}>
                <Title level={3}>Resume</Title>
                {printResumeTags()}
              </div>
            </Col>
          </Row>
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default JobCardData;
