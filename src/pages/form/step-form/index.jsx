import React, { useState, useEffect } from 'react';
import { Card, Steps } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'umi';

import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';


import styles from './style.less';

import jwt_decode from 'jwt-decode';

import asyncLocalStorage from '../../../asyncLocalStorage';

const { Step } = Steps;

const getCurrentStepAndComponent = (current) => {
  switch (current) {
    case 'basic':
      return {
        step: 1,
        component: <Step2 />,
      };

    case 'skills':
      return {
        step: 2,
        component: <Step3 />,
      };

    case 'link':
    default:
      return {
        step: 0,
        component: <Step1 />,
      };
  }
};

const StepForm = (props) => {

  const { dispatch, currentUser, current } = props;

  const [stepComponent, setStepComponent] = useState(<Step1 />);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if(Object.keys(currentUser).length === 0){
      asyncLocalStorage.getItem('accessToken')
      .then((token) => {
        return JSON.parse(JSON.stringify(jwt_decode(token)))
      })
      .then((token) => {
        dispatch({
          type: 'accountAndcenter/fetchCurrent',
          payload: { userID: btoa(token.user_id) },
        });
      });
    }
  }, []);

  useEffect(() => {
    const { step, component } = getCurrentStepAndComponent(current);
    setCurrentStep(step);
    setStepComponent(component);
  }, [current]);

  return (
    // <PageHeaderWrapper content="Upload your project.">
      <Card bordered={false}>
        <>
          <Steps current={currentStep} className={styles.steps}>
            <Step title="Project Link" />
            <Step title="Basic Details" />
            <Step title="Skills" />
          </Steps>
          {stepComponent}
        </>
      </Card>
    // </PageHeaderWrapper>
  );
};

export default connect(({ formAndstepForm, accountAndcenter }) => ({
  current: formAndstepForm.current,
  currentUser: accountAndcenter.currentUser
}))(StepForm);
