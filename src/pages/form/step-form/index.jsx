import React, { useState, useEffect } from 'react';
import { Card, Steps } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'umi';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import styles from './style.less';

const { Step } = Steps;

const getCurrentStepAndComponent = current => {
  switch (current) {
    case 'job':
      return {
        step: 1,
        component: <Step2 />,
      };

    case 'result':
      return {
        step: 2,
        component: <Step3 />,
      };

    case 'project':
    default:
      return {
        step: 0,
        component: <Step1 />,
      };
  }
};

const StepForm = ({ current }) => {
  const [stepComponent, setStepComponent] = useState(<Step1 />);
  const [currentStep, setCurrentStep] = useState(0);
  useEffect(() => {
    const { step, component } = getCurrentStepAndComponent(current);
    setCurrentStep(step);
    setStepComponent(component);
  }, [current]);
  return (
    <PageHeaderWrapper content="Divide a long or unfamiliar form task into multiple steps to guide the user through it.">
      <Card bordered={false}>
        <>
          <Steps current={currentStep} className={styles.steps}>
            <Step title="Project Details" />
            <Step title="Job Details" />
            <Step title="Results" />
          </Steps>
          {stepComponent}
        </>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ formAndstepForm }) => ({
  current: formAndstepForm.current,
}))(StepForm);
