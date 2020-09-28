import { Upload, message, Button, Typography } from 'antd';
import { UploadOutlined  } from '@ant-design/icons';

import React, { useEffect } from 'react';
import { connect } from 'umi';


const { Title } = Typography;


const FileUploader = props => {
  const { dispatch, fileuploading, currentUser } = props;
  

  useEffect(() => {
    // console.log(currentUser)
    // console.log()
  })
  // http://localhost:3001/api/v1/entities/candidate-complete-details/${btoa(JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id)}
  const config = {
    name: 'file',
    method: 'post',
    data: {"type": "resume"},
    action: 'http://localhost:8080/uploadFile',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    onChange(info) {
      // if (info.file.status !== 'uploading') {        
      // }
      
      if (info.file.status === 'done') {
        dispatch({
          type: 'accountAndcenter/setfileuploading',
          payload: true
        });

        dispatch({
          type: 'accountAndcenter/uploadResumeKeywords',
          payload: {
            "type": "resume",
            "text": info.file.response,
            "filename": info.file.name
          }
        });

        dispatch({
          type: 'accountAndcenter/setfileuploading',
          payload: false
        });
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        console.log(info)
        message.error(`${info.file.name} file upload failed.`, 3);
      }

    },
    beforeUpload(fileList) {
      delete fileList[0];

      console.log(fileList)
    },
    defaultFileList: [
      {
        uid: '1',
        name: currentUser.keywords.ck_resume_filename,
        status: 'done',
        response: 'Last uplaoded', // custom error message to show
        url: REACT_APP_S3_RESUME_BASE_URL_HOME.concat(currentUser.keywords.ck_resume_filename),
      }
    ],
    // progress: {
    //   strokeColor: {
    //     '0%': '#108ee9',
    //     '100%': '#87d068',
    //   },
    //   strokeWidth: 0,
    //   format: percent => `${parseFloat(percent.toFixed(2)/2)}%`,
    // },
    accept: ".pdf"
  };
  
  return (
    <div className="parts">
        <Title level={4}>Resume</Title>
        <Upload {...config}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
        
    </div>
  );
};

export default connect(({ accountAndcenter }) => ({
    currentUser: accountAndcenter.currentUser,
    fileuploading: accountAndcenter.fileuploading
  }))(FileUploader);