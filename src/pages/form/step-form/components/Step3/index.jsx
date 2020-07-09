import React, { useState } from 'react';
import { Spin, Form, Button, Divider, Typography, AutoComplete, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import { history } from 'umi';

const { Title, Text } = Typography;

import { connect } from 'umi';
import styles from './index.less';

const Step3 = (props) => {
  const [form] = Form.useForm();
  const { project, dispatch, loading, structure } = props;

  const [skills, updateSkills] = useState(project.skills);
  const [selected, setSelected] = useState('');

  if (!project) {
    return <Spin />;
  }

  const onDeleteButtonClick = (cn) => {
    message.warn(`${structure[3][cn]} has been removed`);
    updateSkills((prev) => {
      return prev.filter((item) => {
        const [prevcn, ..._] = item.split(',');
        return prevcn !== cn;
      });
    });
  };

  const renderSkills = () => {
    if (skills.length == 0) {
      console.log('skills zero')
      return null
    }

    let cat, subcat, label;
    const sortedSkills = skills.sort((a, b) => a.split(',')[0] - b.split(',')[0]);
    const [catNum, ..._] = sortedSkills[0].split(',');
    cat = structure[0][catNum];
    subcat = structure[1][catNum];
    label = structure[3][catNum];

    return (
      <>
        <Title level={4}>{cat}</Title>
        <Text strong>{subcat}</Text>
        <p>
          {label}
          <Button
            danger
            type="link"
            style={{ float: 'right' }}
            size="small"
            icon={<CloseOutlined />}
            onClick={() => {
              onDeleteButtonClick(catNum);
            }}
          ></Button>
        </p>
        {sortedSkills.map((skill) => {
          const [cn, start, end] = skill.split(',');
          if (subcat === structure[1][cn]) {
            if (label !== structure[3][cn]) {
              label = structure[3][cn];
              return (
                <p key={cn}>
                  {structure[3][cn]}{' '}
                  <Button
                    danger
                    type="link"
                    style={{ float: 'right' }}
                    size="small"
                    icon={<CloseOutlined />}
                    onClick={() => {
                      onDeleteButtonClick(cn);
                    }}
                  ></Button>
                </p>
              );
            }
          } else {
            subcat = structure[1][cn];
            label = structure[3][cn];
            return (
              <React.Fragment key={cn}>
                <Title level={4}>{cat === structure[0][cn] ? '' : (cat = structure[0][cn])}</Title>
                <Text strong>{structure[1][cn]}</Text>
                <p>
                  {structure[3][cn]}{' '}
                  <Button
                    danger
                    type="link"
                    icon={<CloseOutlined />}
                    size="small"
                    style={{ float: 'right' }}
                    onClick={() => {
                      onDeleteButtonClick(cn);
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
    const values = { skills };

    if (dispatch) {
      dispatch({
        type: 'formAndstepForm/submitNewProjectSkills',
        payload: { ...values },
      });
      history.push(`project/${project.id}`);
    }
  };

  const renderItem = (item, cat) => (
    <div
      key={item}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {item}
      <span style={{ fontSize: '0.8em' }}>{cat}</span>
    </div>
  );

  const onSelect = (label, option) => {
    const { item, category, subcategory, index } = option;
    message.success(`${item} has been added!`);
    setSelected(item);
    updateSkills((prev) => [...prev, `${index},-1,-1`]);
  };

  const autoCompleteValues = structure[3]
    .filter((item) => item.length > 0)
    .map((item) => {
      const index = structure[3].indexOf(item);
      const category = structure[0][index];
      const subcategory = structure[1][index];
      return {
        value: renderItem(item, category),
        item,
        category,
        subcategory,
        index,
      };
    });

  return (
    <div className={styles.stepForm}>
      <div className={styles.inputContainer}>
        <label> Add skills: &nbsp; </label>
        <AutoComplete
          placeholder="Add a skill!"
          options={autoCompleteValues}
          filterOption={(inputValue, option) =>
            option.item.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
          }
          style={{ width: 350 }}
          notFoundContent="No Skills Found"
          onSelect={onSelect}
          onChange={(value) => {
            setSelected(value);
          }}
          value={selected}
        />
      </div>
      <div className={styles.result}>
        <ul>
          {structure !== null && skills.length > 0 ? (
            <>{renderSkills()}</>
          ) : null}
        </ul>
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
}))(Step3);
