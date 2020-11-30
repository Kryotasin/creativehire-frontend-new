import React, { useEffect, useState } from 'react';
import { Row, Col, Space, Typography, Tag, Button } from 'antd';
import { CheckOutlined, CloseCircleTwoTone, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import styles from '../index.less';

const { Paragraph, Title, Text } = Typography;

const JobCardData = (props) => {

      const { jobData, printJobTitle, structure, keywords_part } = props;

      const [ jobKeys, setJobKeys ] = useState(undefined);

      const uniqueItems = arr => {
            return arr.filter((value, index, self) => {
              return self.indexOf(value) === index;
            });
          };

      useEffect(() => {
            if(jobKeys === undefined){
                  const temp = [];
                  jobData.jobpost_data.jobpost_keywords.forEach((e,v) => {
                        temp.push(e.split(',')[0]);
                  })
                  setJobKeys(uniqueItems(temp));
            }
      }, [jobData]);

      const printProjectTags = () => {
            const output = [];
            if(jobKeys !== undefined){
                  jobKeys.forEach((e) => {
                        if(keywords_part.ck_keywords.projects.includes(parseInt(e, 10))){
                              output.push(<Tag icon={<CheckCircleOutlined />} color="success" key={e} >{structure[3][e]}</Tag>);
                        }
                        else{
                              output.push(<Tag icon={<CloseCircleOutlined />} color="error" key={e} >{structure[3][e]}</Tag>);
                        }
                  })
            }
            return output;
      }

      const printResumeTags = () => {
            const output = [];
            if(jobKeys !== undefined){
                  jobKeys.forEach((e) => {
                        if(keywords_part.ck_keywords.resume.includes(parseInt(e, 10))){
                              output.push(<Tag icon={<CheckCircleOutlined />} color="success" key={'project-'.concat(e)} >{structure[3][e]}</Tag>);
                        }
                        else{
                              output.push(<Tag icon={<CloseCircleOutlined />} color="error" key={'resume-'.concat(e)} >{structure[3][e]}</Tag>);
                        }
                  })
            }
            return output;
      }


    return (
          <>
            {
                  jobData && structure ?
                  <>
                  <Row>
                        <Col xs={2} sm={4} md={6} lg={6} xl={8}><img src={jobData.jobpost_data.jobpost_img} width={100} alt="Tes"/></Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                              <Space direction='vertical' size={0}>                        
                                    <Title level={2}>{jobData.jobpost_data.jobpost_company}</Title>
                                    <Title level={4}>{printJobTitle(jobData.jobpost_data.jobpost_title)}</Title>
                                    <Text strong>{jobData.jobpost_data.jobpost_company}</Text>
                              </Space>
                        </Col>
                  </Row>
                  <Row gutter={[16, 36]} align="top" >
                        <Col xs={2} sm={2} md={4} lg={6} xl={8}>
                              <div className={styles.conditions}>
                                    <Text strong>H1B</Text>
                                    {
                                          jobData.jobpost_data.jobpost_sponsors_h1b ?
                                          <CheckOutlined />
                                          :
                                          <CloseCircleTwoTone twoToneColor="#ff4d4f"/>
                                    }
                              </div>

                              <div className={styles.conditions}>
                                    <Text strong>OPT</Text>
                                    {
                                          jobData.jobpost_data.jobpost_opt ?
                                          <CheckOutlined />
                                          :
                                          <CloseCircleTwoTone twoToneColor="#ff4d4f"/>
                                    }
                              </div>

                              <div className={styles.conditions}>
                                    <Text strong>STEM OPT</Text>
                                    {
                                          jobData.jobpost_data.jobpost_stem_opt ?
                                          <CheckOutlined />
                                          :
                                          <CloseCircleTwoTone twoToneColor="#ff4d4f"/>
                                    }
                              </div>

                              <div className={styles.conditions}>
                                    <Text strong>Remote</Text>
                                    {
                                          jobData.jobpost_data.jobpost_remote ?
                                          <CheckOutlined />
                                          :
                                          <CloseCircleTwoTone twoToneColor="#ff4d4f"/>
                                    }
                              </div>
                        </Col>
                  
                        <Col push={8} xs={{ span: 6}} sm={{ span: 6}} md={{ span: 6}} lg={{ span: 6}} xl={{ span: 6}}>
                              <Space size='large'>
                                    <a href={jobData.jobpost_data.jobpost_application_link} target="_blank" rel="noopener noreferrer"><Button type="primary" size="large">Apply</Button></a>
                                    <Button size="large">Save</Button>
                              </Space>
                        </Col>
                  </Row>
                  <Row gutter={[72, 36]}>
                        <Col xs={24} sm={24} md={10} lg={10} xl={14}>
                              <Paragraph ellipsis={{ rows: 20, expandable: true, symbol: 'more' }}>
                                    {jobData.jobpost_data.jobpost_description}
                              </Paragraph>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={10}>
                                          <div className={styles.projectTags}>
                                                <Title level={3}>
                                                      Projects
                                                </Title>
                                                {
                                                      printProjectTags()
                                                }
                                          </div>
                                          <div className={styles.resumeTags}>
                                                <Title level={3}>
                                                      Resume
                                                </Title>
                                                {
                                                      printResumeTags()
                                                }
                                          </div>
                        </Col>
                  </Row>
                  </>
                  :
                  ''
            } 
          </>
    )
}

export default JobCardData;