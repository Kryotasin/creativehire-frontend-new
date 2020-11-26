import React, { useEffect, useState } from 'react';

import { List, Typography, Card, Row, Col, Space, Progress, Button, Spin, Modal } from 'antd';
import { CheckOutlined, CloseCircleTwoTone } from '@ant-design/icons';
import { connect } from 'umi';
import moment from 'moment';

import JobCardData from './jobcard';

import styles from '../index.less';


const { Text, Title, Paragraph } = Typography;

const Saved = props => {

    const { dispatch, currentUser, saved_jobs, structure } = props;
    const [ data, setData ] = useState(undefined);
    const [ showModal, setShowModal ] = useState(false);
    const [ modalData, setModalData ] = useState(undefined);

    useEffect(() => {
    if(currentUser){console.log(saved_jobs)
      dispatch({
        type: 'user/fetchSavedJobs',
      });
    }
  }, [currentUser]);
    
    useEffect(() => {
        if(saved_jobs){
          setData(saved_jobs);
        }
      }, [saved_jobs]);
    
    
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
        <Card title="Saved jobs" extra={<a href="#">See all</a>}>
        {
          data ?
          <List
           grid={{ gutter: 16, column: 3 }}
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
                        <img src={item.jobpost_data.jobpost_img} width={30} alt="Tes"/>
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
                             <CloseCircleTwoTone twoToneColor="#ff4d4f"/>
                           }                            
                           <Text>Remote</Text>
                         </Space>

                         <Space size='small'>
                           { item.jobpost_data.jobpost_type }
                           <Text>Full-Time</Text>
                         </Space>
                       </Space>

                       <Space size='large'>
                         <a href={item.jobpost_data.jobpost_application_link}><Button type="primary">Apply</Button></a>
                         <Button>Save</Button>
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
      >
        <JobCardData jobData={modalData} printJobTitle={printJobTitle} structure={structure}/>
      </Modal>
    </>
    )
}

export default connect(({ user }) => ({
    currentUser: user.currentUser,
    saved_jobs: user.saved_jobs,
  }))(Saved);
  