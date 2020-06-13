import React,  { useState }  from 'react';
import { Spin, Form, Button, Tooltip, Divider, Statistic, Input, Typography } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined, InfoCircleOutlined } from '@ant-design/icons';

import { connect } from 'umi';
import styles from './index.less';


const Step2 = props => {
  const [form] = Form.useForm();
  const { project, dispatch, loading, structure } = props;

  const [skills, updateSkills] = useState(project.skills);

  let cat = structure[0][skills[0][0]];
  let subcat = structure[1][skills[0][1]];
  let label = structure[2][skills[0][0]];

  if (!project) {
    return <Spin />;
  }

  const { validateFields } = form;

  const onPrev = () => {
    if (dispatch) {
      dispatch({
        type: 'formAndstepForm/saveCurrentStep',
        payload: 'basic',
      });
    }
  };


  const onValidateForm = async () => {
    const values = await validateFields();


    if (dispatch) {
      dispatch({
        type: 'formAndstepForm/submitNewProject',
        payload: { ...values },
      });
    }
  };



  return (
    <div className={styles.stepForm}>

    <div className={styles.result}>
      {cat}
    </div>


      <Button
        onClick={onPrev}
        style={{
          marginLeft: 164,
        }}
      >
        Previous
      </Button>

      <Button type="primary" onClick={onValidateForm} loading={props.loading} size='large'
              style={{
                marginLeft: 16,
              }}>
        Add Project
      </Button>

      <Divider
        style={{
          margin: '40px 0 24px',
        }}
      />
      <div className={styles.desc}>
        <h3>Help</h3>
        <h4>What is this page?</h4>
        <p>
          Here are all the relavant skills we could find on the page. If there are any skills you want to add manually, you can.
        </p>
      </div>
    </div>
  );
};

export default connect(({ formAndstepForm }) => ({
  loading: formAndstepForm.loading,
  project: formAndstepForm.project,
  structure: formAndstepForm.structure.payload,
}))(Step2);
