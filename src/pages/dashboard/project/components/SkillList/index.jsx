import React, { useState, useEffect } from 'react';
import { Button, Divider, Card, Typography, Tabs, AutoComplete, message, Row, Col } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
// import { PieChart } from 'react-charts-d3';
import axios from '../../../../../umiRequestConfig';
import styles from './index.less';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const SkillList = props => {
  const { project, structure } = props;

  const [keywords, setKeywords] = useState(undefined);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);

  const [ sortedSkills, setSortedSkills ] = useState(undefined);

  let cat;
  let subcat;
  let label;
  let catNum;

  useEffect(() => {
    if(project !== undefined && keywords === undefined) {
      setKeywords(project.project_keywords);
    }
  }, [project]);


  useEffect(() => {
    if(keywords !== undefined){
      setSortedSkills(keywords.sort((a, b) => a.split(',')[0] - b.split(',')[0]));
    }
  }, [keywords]);


  useEffect(() => {
    if(sortedSkills){
      catNum = sortedSkills[0].split(',');
      cat = structure[0][catNum];
      subcat = structure[1][catNum];
      label = structure[3][catNum];

      const counts = {};
      let total = 0;
      let prevIndex = -1;
      let prevCat = '';
      if (keywords) {
        for (let i = 0; i < keywords.length; ++i) {
          const [index, ..._] = keywords[i].split(',');
          if (index != prevIndex) {
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
      
      const chartData = [];
      for (let k in counts) {
        chartData.push({ label: k, value: (counts[k] * 100) / total });
      }
    }
  }, [sortedSkills]);

  const onDeleteButtonClick = (cn) => {
    message.warn(`${structure[3][cn]} has been removed`);
    setKeywords((prev) => {
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
        keywords,
      })
      .then((response) => {
        setLoading(false);
        message.success('Keywords have been saved.');
      })
      .catch((e) => {
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
          />
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
                  />
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
                  />
                </p>
              </React.Fragment>
            );
          }
        })}
      </>
    );
  };


  const onSelect = (label, option) => {
    const { item, category, subcategory, index } = option;
    message.success(`${item} has been added!`);
    setSelected(item);
    setKeywords((prev) => [...prev, `${index},-1,-1`]);
  };

  const renderItem = (item, cat) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
      key={item.concat(cat)}
    >
      {item}
      <span 
      key={item.concat(cat)} style={{ fontSize: '0.8em' }}>{cat}</span>
    </div>
  );


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
    <Row>
      <Col xs={{ span: 24 }} lg={{ span: 22, offset: 2 }}>
        <Card>
          <Tabs defaultActiveKey="keywords">
            <TabPane tab="Keywords" key="keywords">
              <div className={styles.stepForm}>
                <div className={styles.inputContainer}>
                  <AutoComplete
                    placeholder="Add a skill!"
                    options={autoCompleteValues}
                    filterOption={(inputValue, option) =>
                      option.item.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
                    }
                    style={{ width: 350 }}
                    notFoundContent="No Keywords Found"
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
              {/* <PieChart data={chartData} /> */}
            </TabPane>
          </Tabs>
        </Card>
      </Col>
    </Row>
  );
}


export default SkillList;