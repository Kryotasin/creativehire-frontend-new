import React, { useState, useEffect } from 'react';
import { Spin, Form, Button, Tooltip, Divider, Statistic, Input, Typography, message } from 'antd';
import {
  ArrowRightOutlined,
  ArrowLeftOutlined,
  InfoCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';

import {history} from 'umi';

const { Title, Text } = Typography;

import { connect } from 'umi';
import styles from './index.less';

const Step2 = (props) => {
  const [form] = Form.useForm();
  const { project, dispatch, loading, structure } = props;

  const [skills, updateSkills] = useState(project.skills);

  if (!project) {
    return <Spin />;
  }

  const { validateFields } = form;

  const [catNum, subcatNum, labelNum, _] = skills[0].split(',');
  let cat = structure[0][catNum];
  let subcat = structure[1][subcatNum];
  let label = structure[3][catNum];

  const onDeleteButtonClick = ([cn, scn]) => {
    message.warn(`${structure[3][cn]} has been removed`)
    updateSkills((prev) => {
      return prev.filter((item) => {
        const [prevcn, prevscn, ..._] = item.split(',');
        return prevcn !== cn || prevscn !== scn;
      });
    });
  };

  const renderSkills = () => {
    return (
      <>
        <Title level={4}>{cat}</Title>
        <Text strong>{subcat}</Text>
        <p>
          {label}
          <Button
            danger
            type='link'
            style={{ float: 'right' }}
            size='small'
            icon={<CloseOutlined />}
            onClick={() => {
              onDeleteButtonClick([catNum, subcatNum]);
            }}
          ></Button>
        </p>
        {skills.map((skill) => {
          const [cn, scn, ln, _] = skill.split(',');
          if (subcat === structure[1][scn]) {
            if (label !== structure[3][cn]) {
              label = structure[3][cn];
              return (
                <p key={cn}>
                  {structure[3][cn]}{' '}
                  <Button
                    danger
                    type='link'
                    style={{ float: 'right' }}
                    size='small'
                    icon={<CloseOutlined />}
                    onClick={() => {
                      onDeleteButtonClick([cn, scn]);
                    }}
                  ></Button>
                </p>
              );
            }
          } else {
            subcat = structure[1][scn];
            label = structure[3][cn];
            return (
              <React.Fragment key={cn}>
                <Title level={4}>{cat === structure[0][cn] ? '' : (cat = structure[0][cn])}</Title>
                <Text strong>{structure[1][scn]}</Text>
                <p>
                  {structure[3][cn]}{' '}
                  <Button
                    danger
                    type='link'
                    icon={<CloseOutlined />}
                    size='small'
                    style={{ float: 'right' }}
                    onClick={() => {
                      onDeleteButtonClick([cn, scn]);
                    }}
                  ></Button>
                </p>
              </React.Fragment>
            );
          }
        })}
      </>
    );
  };

  const onPrev = () => {
    if (dispatch) {
      dispatch({
        type: 'formAndstepForm/saveCurrentStep',
        payload: 'basic',
      });
    }
  };

  const onValidateForm = async () => {
    const values = {skills};

    if (dispatch) {
      dispatch({
        type: 'formAndstepForm/submitNewProjectSkills',
        payload: { ...values },
      });
      history.push(`project/${project.id}`)
    }
  };

  // const onSelect = (value, option) => {
  //   console.log({value});
  //   console.log(structure[1])
  //   const cn = structure[3].indexOf(value);
  //   console.log({cn})
  //   console.log(skills[0])
  // }
  //
  // const autoCompleteValues = structure[3].filter(item => item.length > 0).map(value => {
  //   return {value}
  // })

  return (
    <div className={styles.stepForm}>
      {/**<AutoComplete
        placeholder="Add a skill!"
        options={autoCompleteValues}
        filterOption={(inputValue, option) => option.value.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1}
        style={{width: 200}}
        notFoundContent="No Skills Found"
        onSelect={onSelect}
      />**/}
      <div className={styles.result}>
        <ul>{structure !== null && project.skills ? <>{renderSkills()}</> : null}</ul>
      </div>

      <Button
        onClick={onPrev}
        style={{
          marginLeft: 164,
        }}
      >
        Previous
      </Button>

      <Button
        type="primary"
        onClick={onValidateForm}
        loading={props.loading}
        size="large"
        style={{
          marginLeft: 16,
        }}
      >
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
          Here are all the relavant skills we could find on the page. If there are any skills you
          want to add manually, you can.
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
