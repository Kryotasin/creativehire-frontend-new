import React, { useEffect, useState } from 'react';

import { List, Typography, Card, Row, Col, Space, Progress, Button, Spin, Modal } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';

import JobCardData from './jobcard';
import styles from '../index.less';


const { Text, Title, Paragraph } = Typography;

const Recommended = props => {

    const { reccommended_jobs, structure, keywords_part, saveUnsave, saveUnsaveTogglerForRecommendedJobs } = props;
    const [ data, setData ] = useState(undefined);
    const [ showModal, setShowModal ] = useState(false);
    const [ modalData, setModalData ] = useState(undefined);
    
    useEffect(() => {
        if(reccommended_jobs){
          setData(reccommended_jobs);
        }
      }, [reccommended_jobs]);
    
      const getPostedTime = (input) => {
        const temp = moment.duration(moment(input).diff(moment()));
        return temp.asDays();
      }
    
      const setProgressColor = matchPercent => {
        if(matchPercent > 50){
          return '#52c41a';
        }
        if(matchPercent < 20 ){
          return '#ff4d4f';
        }
        return '#1890ff';
      }
    
    
      const printJobTitle = title => {
        const parts = title.split(' ');
        return parts[0].concat(' ').concat(parts[1]).concat(parts[2] ? ' ...' : '');
      }
    
    return (
        <>
          <Card title="Recommended jobs" extra={<a href="#">See all</a>}>
            {
              data ?
              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 4,
                  lg: 4,
                  xl: 6,
                  xxl: 3,
                }}
              dataSource={data}
              pagination={{
                onChange: page => {
                  console.log(page);
                },
                pageSize: 3,
              }}
              renderItem={item => (
                <List.Item>
                  <Card>
                    <Row gutter={[0, 16]}>
                      <Col span={4}>
                        <div onClick={() => {
                            setShowModal(true);
                            setModalData(item);
                          }}
                          className={styles.jobTitle}
                          >
                            <img src={item.jobpost_data.jobpost_img} width={30} alt={item.jobpost_data.jobpost_img}/>
                        </div>
                      </Col>
                      <Col span={14}>
                        <Space direction='vertical' size={0}>                        
                        <Paragraph ellipsis={{ rows: 1, expandable: false }}>
                          <div onClick={(e) => {
                            setShowModal(true);
                            setModalData(item);
                          }}
                          className={styles.jobTitle}
                          >
                            <Title level={4} className={styles.jobTitle}>{printJobTitle(item.jobpost_data.jobpost_title)}</Title>
                          </div>
                        </Paragraph>
                          <Text strong>{item.jobpost_data.jobpost_company}</Text>
                          <Text strong>{item.jobpost_data.jobpost_company}</Text>
                        </Space>
                      </Col>
                      
                      <Col span={6}>
                        <Text type="secondary">{getPostedTime(item.jobpost_data.jobpost_post_date).toFixed(0)} {' days'}</Text>
                      </Col>
                    </Row>
                    
                    <Row gutter={[16, 16]}>
                      <Col span={16}>
                        <Space size='large' direction='vertical'>
                          <Space size='large'>
                            <Space size='small'>
                              {
                                item.jobpost_data.jobpost_remote ?
                                <CheckOutlined />
                                :
                                <CloseOutlined />
                              }                            
                              <Text>Remote</Text>
                            </Space>

                            <Space size='small'>
                              { item.jobpost_data.jobpost_type }
                              <Text>Full-Time</Text>
                            </Space>
                          </Space>

                          <Space size='large'>
                            <a href={item.jobpost_data.jobpost_application_link} target="_blank" rel="noopener noreferrer"><Button type="primary">Apply</Button></a>
                            
                            {
                              item.jm_data.jm_saved_by_candidate ?
                                <Button onClick={() => {
                                  saveUnsave(item.jm_data.id)
                                  .then(res => {
                                    console.log(res);
                                    saveUnsaveTogglerForRecommendedJobs();
                                  })
                                }}>Unsave</Button>
                                :
                                <Button onClick={() => {
                                  saveUnsave(item.jm_data.id)
                                  .then(res => {
                                    console.log(res);
                                    saveUnsaveTogglerForRecommendedJobs();
                                  })
                                }}>Save</Button>
                            }
                          </Space>
                        </Space>
                      </Col>
                      
                      <Col span={4}>
                        <Progress type="circle" percent={(item.jm_data.jm_match_percent*100).toFixed(0)} width={80} strokeColor={setProgressColor(item.jm_data.jm_match_percent*100)}/>
                      </Col>
                    </Row>
                  </Card>
                </List.Item>
              )}
            />
            :
            <Spin />
            }
      </Card>
      
      <Modal
        title=""
        // onOk={this.handleOk}
        onCancel={() => {
          setShowModal(false);
          setModalData(undefined);
        }}
        visible={showModal}
        width="50%"
        footer={null}
        style={{ top: 20 }}
        destroyOnClose="true"
      >
        <JobCardData jobData={modalData} printJobTitle={printJobTitle} structure={structure} keywords_part={keywords_part}/>
      </Modal>
    </>
    )
}

export default Recommended;
  