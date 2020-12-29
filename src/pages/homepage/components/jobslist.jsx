import React, { useEffect, useState } from 'react';

import { List, Typography, Card, Row, Col, Space, Progress, Button, Spin, Modal } from 'antd';
import { CheckOutlined, CloseOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import moment from 'moment';

import JobCardData from './jobcard';
import styles from '../index.less';
import { Link } from 'umi';

const { Text, Title, Paragraph } = Typography;

const JobsList = (props) => {
  const {
    dispatch,
    title,
    job_list,
    structure,
    keywords_part,
    pageSize,
    showExtra,
    maxGridSize,
  } = props;
  const [data, setData] = useState(undefined);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(undefined);

  useEffect(() => {
    if (job_list) {
      setData(job_list);
    }
  }, [job_list]);

  const updateJobMatchItem = (jmID, joblistType, applyOrSave) => {
    dispatch({
      type: 'user/updateJobMatch',
      payload: {
        jmID: jmID,
        joblistType: joblistType,
        applyOrSave: applyOrSave,
      },
    });
  };

  const getPostedTime = (input) => {
    const temp = moment.duration(moment(input).diff(moment()));
    const splits = {
      // years: moment.duration(temp).years(),
      months: moment.duration(temp).months(),
      // weeks: moment.duration(temp).weeks(),
      days: moment.duration(temp).days()
    }
    
    if(Math.abs(splits.months) > 0){
      return String(Math.abs(splits.months)).concat(' months ago');
    }
    
    else{
      return String(Math.abs(splits.days)).concat(' days ago');
    }
    
  };

  const setProgressColor = (matchPercent) => {
    if (matchPercent > 50) {
      return '#52c41a';
    }
    if (matchPercent < 20) {
      return '#ff4d4f';
    }
    return '#1890ff';
  };

  return (
    <>
      <Card
        title={title !== '' ? title.concat(' jobs') : ''}
        extra={
          showExtra ? (
            <Link to={{ pathname: '/search-jobs', search: `?type=${title.toLowerCase()}` }}>
              See all
            </Link>
          ) : (
            ''
          )
        }
      >
        {data ? (
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 2,
              xl: 2,
              xxl: maxGridSize || 3,
            }}
            dataSource={data}
            pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: pageSize || 3,
            }}
            renderItem={(item) => (
              <List.Item>
                <Card>
                  <Row gutter={[0, 16]}>
                    <Col span={4}>
                      <div
                        onClick={() => {
                          setShowModal(true);
                          setModalData(item);
                        }}
                        className={styles.jobTitle}
                      >
                        <img
                          src={item.jobpost_data.jobpost_img}
                          width={30}
                          alt={item.jobpost_data.jobpost_img}
                        />
                      </div>
                    </Col>
                    <Col span={14} className={styles.textHolder}>
                      <Space direction="vertical" size={0}>
                        <Paragraph ellipsis={{ rows: 1, expandable: false }}>
                          <div
                            onClick={(e) => {
                              setShowModal(true);
                              setModalData(item);
                            }}
                            className={styles.jobTitle}
                          >
                            <Title level={4} ellipsis className={styles.jobTitle}>
                              {item.jobpost_data.jobpost_title}
                            </Title>
                          </div>
                        </Paragraph>
                        <Text strong>{item.jobpost_data.jobpost_company}</Text>
                        <Text strong>{item.jobpost_data.jobpost_company}</Text>
                      </Space>
                    </Col>

                    <Col span={6}>
                      <Text type="secondary">
                        {getPostedTime(item.jobpost_data.jobpost_post_date)}
                      </Text>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]}>
                    <Col span={16}>
                      <Space size="large" direction="vertical">
                        <Space size="large">
                          <Space size="small">
                            {item.jobpost_data.jobpost_remote ? (
                              <CheckOutlined />
                            ) : (
                              <CloseOutlined />
                            )}
                            <Text>Remote</Text>
                          </Space>

                          <Space size="small">
                            {item.jobpost_data.jobpost_type}
                            <Text>Full-Time</Text>
                          </Space>
                        </Space>

                        <Space size={item.jm_data.jm_applied_by_candidate ? 'small' : 'large'}>
                          <a
                            href={item.jobpost_data.jobpost_application_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.jm_data.jm_applied_by_candidate ? (
                              <>
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
                                {/* <Button type="link" style={{textDecoration: 'underline'}}>undo</Button> */}
                              </>
                            ) : (
                              <Button
                                type="primary"
                                onClick={() => {
                                  updateJobMatchItem(item.jm_data.id, title, 'apply');
                                }}
                              >
                                Apply
                              </Button>
                            )}
                          </a>

                          {item.jm_data.jm_saved_by_candidate ? (
                            <Button
                              onClick={() => {
                                updateJobMatchItem(item.jm_data.id, title, 'save');
                              }}
                            >
                              Unsave
                            </Button>
                          ) : (
                            <Button
                              onClick={() => {
                                updateJobMatchItem(item.jm_data.id, title, 'save');
                              }}
                            >
                              Save
                            </Button>
                          )}
                        </Space>
                      </Space>
                    </Col>

                    <Col span={4}>
                      <Progress
                        type="circle"
                        percent={(item.jm_data.jm_match_percent * 100).toFixed(0)}
                        width={80}
                        strokeColor={setProgressColor(item.jm_data.jm_match_percent * 100)}
                      />
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            )}
          />
        ) : (
          <Spin />
        )}
      </Card>

      <Modal
        title=""
        // onOk={this.handleOk}
        onCancel={() => {
          setShowModal(false);
          setModalData(undefined);
        }}
        visible={showModal}
        width="80%"
        footer={null}
        style={{ top: 20 }}
        destroyOnClose="true"
      >
        <JobCardData jobData={modalData} structure={structure} keywords_part={keywords_part} />
      </Modal>
    </>
  );
};

export default JobsList;
