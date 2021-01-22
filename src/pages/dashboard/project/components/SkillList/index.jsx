import React, { useState, useEffect } from 'react';
import { Button, Divider, Card, Typography, Tabs, AutoComplete, message, Row, Col, Popconfirm, Spin } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { PieChart } from 'react-charts-d3';
import axios from '../../../../../umiRequestConfig';
import styles from './index.less';
import { history } from 'umi';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const SkillList = (props) => {
  const { dispatch, project, structure } = props;

  const [keywords, setKeywords] = useState(undefined);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(undefined);
  const [sortedSkills, setSortedSkills] = useState(undefined);

  const [ loaded, setLoaded ] = useState(false);

  let cat;
  let subcat;
  let label;
  let catNum;

  useEffect(() => {
    if (Object.keys(structure).length === 0) {
      dispatch({
        type: 'accountAndcenter/fetchStructure',
      });
    }
  }, [structure]);

  useEffect(() => {
    if (project !== undefined && keywords === undefined) {
      setKeywords(project.project_keywords);
    }
  }, [project]);

  useEffect(() => {
    if (keywords !== undefined) {
      setSortedSkills(keywords.sort((a, b) => a.split(',')[0] - b.split(',')[0]));
    }
  }, [keywords]);

  useEffect(() => {
    // if (sortedSkills !== undefined && Object.keys(sortedSkills).length !== 0) {
    //   catNum = sortedSkills[0].split(',');
    //   cat = structure[0][catNum];
    //   subcat = structure[1][catNum];
    //   label = structure[3][catNum];

    //   const counts = {};
    //   let total = 0;
    //   let prevIndex = -1;
    //   let prevCat = '';
    //   if (keywords) {
    //     for (let i = 0; i < keywords.length; ++i) {
    //       const [index, ..._] = keywords[i].split(',');
    //       if (index != prevIndex) {
    //         if (structure[0][index] === prevCat) {
    //           counts[prevCat]++;
    //         } else {
    //           prevCat = structure[0][index];
    //           counts[prevCat] = 1;
    //         }
    //         total++;
    //         prevIndex = index;
    //       }
    //     }
    //   }

    //   const tempData = [];
    //   for (let k in counts) {
    //     tempData.push({ label: k, value: (counts[k] * 100) / total });
    //   }
    //   setChartData(tempData);
    // }
    if (sortedSkills !== undefined && Object.keys(sortedSkills).length === 0) {
      message.warn('No skills found!')
    }
  }, [sortedSkills]);

  useEffect(() =>{
    if(structure && Object.keys(structure).length > 0 && sortedSkills !== undefined && Object.keys(sortedSkills).length > 0){
      setLoaded(true);
    }

    return () => { setLoaded(false)}
  }, [structure, sortedSkills]);

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
    const { id, project_img, summary, project_title, project_author, project_url } = project;

    if (dispatch) {
      dispatch({
        type: 'formAndstepForm/submitNewProjectSkills',
        payload: { ...values },
      });
      history.push(`/project/${project.id}`);
    }
    setLoading(true);

    axios
      .post(REACT_APP_AXIOS_API_V1.concat(`project-keywords/`), {
        id: id,
        // 'project_img': project_img,
        // 'project_title': project_title,
        // 'project_author': project_author,
        // 'project_url': project_url,
        // 'project_summary': summary,
        project_keywords: keywords,
      })
      .then((response) => {
        console.log(response);
        setLoading(false);
        message.success('Keywords have been saved.');
      })
      .catch((e) => {
        console.log(e);
        message.error('Something went wrong. Try again later.');
        setLoading(false);
      });
  };

  const renderSkills = () => {
    return (
      <div className={styles.keywordItem}>
        <Title level={4}>{cat}</Title>
        <div className={styles.subcat}>{subcat}</div>
        {/* <p>
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
        </p> */}
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
                <div className={styles.subcat}>{structure[1][cn]}</div>
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
      </div>
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
      <span key={item.concat(cat)} style={{ fontSize: '0.8em' }}>
        {cat}
      </span>
    </div>
  );


  function confirm(e) {
    axios.delete(REACT_APP_AXIOS_API_V1.concat('project/'.concat(project.id)))
    .then((res) => { 
      
      if(res.status === 204){    
        message.success('Successfully deleted project')
        history.push(`/account/center`);
      }    
    });
  }
  
  function cancel(e) {
    console.log(e);
  }


  const autoCompleteValues = structure[3]
    .filter((item) => item.length > 0)
    .map((item) => {
      const index = structure[3].indexOf(item);
      const category = structure[0][index];
      const subcategory = structure[1][index];
      const key = String(index).concat(category).concat(subcategory);

      return {
        value: renderItem(item, category),
        label: renderItem(item, category),
        item,
        category,
        subcategory,
        index,
        key: key,
      };
    });

  return (
    <>
      {
      loaded ? 
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
                    {structure !== null && sortedSkills ? <>{renderSkills()}</> : null}
                    <Button
                      type="primary"
                      onClick={onSave}
                      loading={loading}
                      size="middle"
                      style={{
                        marginLeft: 16,
                        marginTop: 20,
                      }}
                    >
                      Save keywords
                    </Button>

                    <Popconfirm
                      title="Are you sure to delete this project?"
                      onConfirm={confirm}
                      onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        type="danger"
                        size="middle"
                        style={{
                          marginLeft: 16,
                          marginTop: 20,
                        }}
                      >
                        Delete project
                      </Button>
                    </Popconfirm>

                    
                  </div>

                  <Divider
                    style={{
                      margin: '40px 0 24px',
                    }}
                  />
                </div>
              </TabPane>
              {/* <TabPane tab="Charts" key="charts">
                <PieChart data={chartData} />
              </TabPane> */}
            </Tabs>
          </Card>
        </Col>
      </Row>
      :
      <Spin />
      }
    </>
  );
};

export default SkillList;
