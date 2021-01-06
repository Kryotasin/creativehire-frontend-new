import { connect } from 'umi';
import React, { useState, useEffect } from 'react';
import { Spin, Form, Button, Tooltip, Divider, Checkbox, Input, Typography, message, Progress } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import axios from '../../../../../umiRequestConfig';
import styles from './index.less';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 12 },
    lg: { span: 12 },
    xl: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10, offset: 2 },
    lg: { span: 10, offset: 2 },
    xl: { span: 16, offset: 2 },
  },
};

const Step2 = (props) => {
  const [form] = Form.useForm();
  const { dispatch, portfolio, project_links_list } = props;

  const [processing, setProcessing] = useState(false);
  const [total, setTotal] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [failed, setFailed] = useState(0);

  // const [ progressArray, setProgressArray ] = useState([]);

  useEffect(() => {
    if (project_links_list.length === 0) {
      dispatch({
        type: 'userAndregister/setCompletion',
        payload: {
          type: 'warning',
          message: `We couldn't fetch any projects. You can add projects later from your account center. If you face any issues, contact us at admin@creativehire.co`,
        },
      });

      dispatch({
        type: 'userAndregister/saveCurrentStep',
        payload: 'confirmation',
      });
    }
  });

  useEffect(() => {
    if (completed + failed === total && total > 0) {
      if (failed > 0) {
        dispatch({
          type: 'userAndregister/setCompletion',
          payload: {
            type: 'warning',
            message: `Failed to process ${failed}/${total} projects. You can add them later from your account center. If problem persists, contact us at admin@creativehire.co`,
          },
        });
      }else{
        dispatch({
          type: 'userAndregister/setCompletion',
          payload: {
            type: 'success',
            message: `All ${total} projects uploaded successfully! You can add more later from your account center. If you face any issues, contact us at admin@creativehire.co`,
          },
        });
      }
      dispatch({
        type: 'userAndregister/saveCurrentStep',
        payload: 'confirmation',
      });

      setTimeout(() => {setProcessing(false);}, 2500);
  
    }
      
    
  }, [completed, failed]);

  if (!project_links_list) {
    return <Spin />;
  }

  const { validateFields } = form;

  const onPrev = () => {
    if (dispatch) {
      dispatch({
        type: 'userAndregister/saveCurrentStep',
        payload: 'info',
      });
    }
  };

  // Function to post the project to database
  const postProjectToDB = async(projectLink, basicDetails) => {

    if(basicDetails.title === undefined || basicDetails.title === null || basicDetails.title === ''){
      basicDetails.title = 'Untitled Project'
    }

    if(basicDetails.description === undefined || basicDetails.description === null || basicDetails.description === ''){
      basicDetails.description = 'This is an amazing project by me!'
    }
    console.log(projectLink, basicDetails);

    return axios
      .post(REACT_APP_AXIOS_API_V1.concat('project/'), {
        project_url: projectLink,
        project_title: basicDetails.title,
        project_summary: basicDetails.description,
        project_author: JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id,
        project_img: Object.keys(basicDetails.img_list).length !== 0 ? basicDetails.img_list[0] : 'https://picsum.photos/400',
      })
      .then((res) => {
        
        if (res.status === 201) {
          // progressArrayTemp.push(true);
          setCompleted((prevstate) => prevstate + 1);
        } else {
          // progressArrayTemp.push(false);
          setFailed((prevstate) => prevstate + 1);
        }
        // setProgressArray(progressArrayTemp)
      })
      .catch((err) => {
        console.log(err);        
        setFailed((prevstate) => prevstate + 1);
      })
  }

  // Function to wait for ms milliseconds
  const waitFor = (ms) => new Promise(r => setTimeout(r, ms));

  const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) { // start the loop
      const projectBasicDetails = await axios.post(REACT_APP_AXIOS_API_V1.concat('project/basicdetails/'), {
        url: array[index],
        img_only: 0,
      })
      .then((res) => {
        if(res.status === 200){
          return res.data;        
        }
      })
      .catch((err) => {
        console.log(err)
      })
      
      await callback(array[index], projectBasicDetails);
    }
  }

  // Validation function that checks, fetches basic project details and then uploads it to the database one by one
  async function onValidateForm () {
    setProcessing(true);
    const values = await validateFields();

    if (values.links !== undefined) {
      message.loading({
        content: 'Please wait while we create your projects. It takes a while...',
        key: 'processing',
        duration: 1500,
      });

      setTotal(values.links.length);
      
      await asyncForEach(values.links, async (projectLink, basicDetails) => {await waitFor(500); await postProjectToDB(projectLink, basicDetails)});

    } 
    else {
      dispatch({
        type: 'userAndregister/setCompletion',
        payload: {
          type: 'success',
          message: `No projects were selected. You can them later from your account command center. If you face any issues, contact us at admin@creativehire.co`,
        },
      });

      dispatch({
        type: 'userAndregister/saveCurrentStep',
        payload: 'confirmation',
      });
    }
  }

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        layout="horizontal"
        className={styles.stepForm}
        size="large"
        colon={false}
      >
        <Divider
          style={{
            margin: '24px 0',
          }}
        />

          {processing ? 
            <>
              {'Completed: '.concat(String(completed + failed)).concat('/').concat(String(total))}
              <Progress percent={Number(((completed + failed)/ total) * 100).toFixed(0)} status="active" />
            </>
          :''}

        <Form.Item
          name="links"
          label="Select projects"
          tooltip={{
            title: 'Do not choose password protected projects.',
            icon: <QuestionCircleOutlined />,
          }}
        >
          <Checkbox.Group options={project_links_list} />          
        </Form.Item>
        

        <Form.Item
          // label={
          //   <Button
          //     onClick={onPrev}
          //     style={{
          //       marginLeft: 8,
          //     }}
          //   >
          //     Previous
          //   </Button>
          // }
        >
          <Button type="primary" onClick={onValidateForm} loading={processing}>
            Next
          </Button>
        </Form.Item>
      </Form>

      <Divider
        style={{
          margin: '40px 0 24px',
        }}
      />
      <div className={styles.desc}>
        <h3>Help</h3>
        <h4>What is Project Image?</h4>
        <p>
          Project images are images we could retrieve from the link you provided. Pick 3-4. You can
          add more later.
        </p>
        <p>
          <Typography.Text strong>Note: </Typography.Text>The images are fetched directly from the
          original source. We currently do not support uploading project cover images.
        </p>
      </div>
    </>
  );
};

export default connect(({ userAndregister }) => ({
  loading: userAndregister.loading,
  portfolio: userAndregister.portfolio,
  project_links_list: userAndregister.project_links_list,
}))(Step2);
