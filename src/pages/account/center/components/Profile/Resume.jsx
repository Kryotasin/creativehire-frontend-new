import { Upload, message, Button, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import React, { useEffect } from 'react';
import { connect, Link } from 'umi';


import styles from './index.less';

const Resume = props => {
  const { currentUser } = props;

  useEffect(() => {
    // console.log(currentUser)
    // console.log()
  })

  const config = {
    name: 'resume',
    method: 'put',
    data: {"type": "resume"},
    action: `http://localhost:3001/api/v1/entities/candidate-complete-details/${btoa(JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id)}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: percent => `${parseFloat(percent.toFixed(2))}%`,
    },
    accept: ".pdf"
  };
  
  return (
    <div className="parts">
        <div className={styles.name}>
        Resume
        </div>    
        <Space size="large">
            <Upload {...config}>
                <Button icon={<UploadOutlined />}>Upload Resume</Button>
            </Upload>
            
            

        </Space>
    </div>
  );
};

export default connect(({ accountAndcenter }) => ({
    currentUser: accountAndcenter.currentUser,
  }))(Resume);
