import React, { useState, useEffect } from 'react';
import { Button, Divider, Card, Typography, Tabs, AutoComplete, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import axios from '../../../../umiRequestConfig';
import styles from './SkillList.less';
import { PieChart } from 'react-charts-d3';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function SkillList(props) {
  const { project, structure } = props;

  const [skills, updateSkills] = useState(project.skills);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);

  const sortedSkills = skills.sort((a, b) => a.split(',')[0] - b.split(',')[0]);
  const [catNum, ..._] = sortedSkills[0].split(',');
  let cat = structure[0][catNum];
  let subcat = structure[1][catNum];
  let label = structure[3][catNum];

  let counts = {};
  let total = 0;
  let prevIndex = -1;
  let prevCat = '';
  if (skills) {
    for (let i = 0; i < skills.length; ++i) {
      const [index, ..._] = skills[i].split(',');
      if (index != prevIndex) {
        console.log({ index, prevIndex });
        if (structure[0][index] === prevCat) {
          counts[prevCat]++;
        } else {
          prevCat = structure[0][index];
          counts[prevCat] = 1;
        }
        total++;
        prevIndex = index;
      }
    }
  }
  console.log({ total });
  let chartData = [];
  for (let k in counts) {
    chartData.push({ label: k, value: (counts[k] * 100) / total });
  }
  console.log(chartData);

  const onDeleteButtonClick = (cn) => {
    message.warn(`${structure[3][cn]} has been removed`);
    updateSkills((prev) => {
      return prev.filter((item) => {
        const [prevcn, ..._] = item.split(',');
        return prevcn !== cn;
      });
    });
  };

  const onSave = () => {
    const { id, img, summary, title, author, url } = project;
    setLoading(true);
    axios
      .put(`project/${project.id}/`, {
        id,
        img,
        title,
        author,
        url,
        summary,
        skills,
      })
      .then((response) => {
        console.log(response);
        setLoading(false);
        message.success('Skills have been saved.');
      })
      .catch((e) => {
        console.error(e);
        message.error('Something went wrong. Try again later.');
        setLoading(false);
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

  const renderItem = (item, cat) => (
    <div
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
    <Card>
      <Tabs defaultActiveKey="skills">
        <TabPane tab="Skills" key="skills">
          <div className={styles.stepForm}>
            <div class={styles.inputContainer}>
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
              <ul>{structure !== null && sortedSkills ? <>{renderSkills()}</> : null}</ul>
            </div>

            <Button
              type="primary"
              onClick={onSave}
              loading={loading}
              size="large"
              style={{
                marginLeft: 16,
              }}
            >
              Save Changes
            </Button>

            <Divider
              style={{
                margin: '40px 0 24px',
              }}
            />
          </div>
        </TabPane>
        <TabPane tab="Charts" key="charts">
          <PieChart data={chartData} />
        </TabPane>
      </Tabs>
    </Card>
  );
}
