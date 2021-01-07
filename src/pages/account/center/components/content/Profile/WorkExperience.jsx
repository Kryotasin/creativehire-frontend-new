import {
  List,
  Divider,
  Button,
  Modal,
  Form,
  InputNumber,
  Input,
  Select,
  Spin,
  Typography,
  Space,
  Checkbox 
} from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import locale from 'antd/es/date-picker/locale/en_US';
import moment from 'moment';
import styles from './index.less';
import axios from '../../../../../../umiRequestConfig';
import WorkCard from './components/WorkCard';
import { entries } from 'lodash';

const { Text } = Typography;

const { Option } = Select;
const { TextArea } = Input;

const WorkExperience = (props) => {
  const { dispatch, projectList, candidate_part, employmentTypes, titleTypes, months, currentYear, defaultDate, saving } = props;

  const [initLoading, setInitLoading] = useState(true);
  const [workList, setWorkList] = useState(undefined);

  const [visible, setVisible] = useState(false);
  const [projectChoices, setProjectChoices] = useState(undefined);
  const [yoe, setYoe] = useState(0);

  const [form] = Form.useForm();

  const [work_id, setWorkID] = useState(-1);

  const [ startMonth, setStartMonth ] = useState(undefined);
  const [ startYear, setStartYear ] = useState(undefined);

  const [ endMonth, setEndMonth ] = useState(undefined);
  const [ endYear, setEndYear ] = useState(undefined);

  const [ currentWork, setCurrentWork ] = useState(undefined);

  useEffect(() => {
    if (Object.keys(candidate_part).length !== 0 && workList === undefined) {
      const temp = [];

      if (candidate_part.candidate_work_exp) {
        Object.entries(candidate_part.candidate_work_exp).forEach((e) => {
          temp.push(e[1]);
        });
      }
      
      setWorkList(temp);
      setYoe((candidate_part.candidate_yoe).toFixed(2));
    }
  }, [candidate_part]);

  useEffect(() => {
    if (Object.keys(employmentTypes).length === 0) {
      dispatch({
        type: 'accountAndcenter/fetchEmploymentTypes',
      });
    }
  }, [employmentTypes]);

  useEffect(() => {
    if (Object.keys(titleTypes).length === 0) {
      dispatch({
        type: 'accountAndcenter/fetchTitleTypes',
      });
    }
  }, [titleTypes]);

  useEffect(() => {
    if (
      Object.keys(titleTypes).length !== 0 &&
      Object.keys(employmentTypes).length !== 0 &&
      Object.keys(candidate_part).length !== 0 &&
      workList !== undefined
    ) {
      setInitLoading(false);
    }
  }, [titleTypes, employmentTypes, candidate_part, workList]);

  const handleCancel = () => {
    setVisible(false);
  };

  async function saveCandidate (e) {
    return dispatch({
      type: 'accountAndcenter/saveNewState',
      payload: { candidate_part: e },
    });
  }

  return (
    <div className="parts">
      <Divider />
      <div className={styles.name}>Work History</div>

      {initLoading ? (
        <Spin />
      ) : (
        <>
          <Text strong>Total Years of Experience (YoE):</Text> <Text underline>{Math.floor(Number(yoe/12))} y {Math.floor((Number(yoe%12)))} m </Text>
          
          <WorkCard
            setWorkList={(e) => {
              const temp = [];
              Object.entries(e).forEach((x) => {
                temp.push(x[1]);
              });
              setWorkList(temp);
            }}
            workList={workList}
            titleTypes={titleTypes}
            employmentTypes={employmentTypes}
            projectList={projectList}
            candidate_part={candidate_part}
            saveCandidate={saveCandidate}
            
            months={months}
            currentYear={currentYear}
            defaultDate={defaultDate}
            dispatch={dispatch}
            saving={saving}
            setYoe={setYoe}
          />
          <Button
            type="link"
            onClick={() => {
              setVisible(true);
            }}
            icon={<PlusOutlined />}
          >
            Add new
          </Button>
        </>
      )}

      <Modal
        title="Add Work Experience"
        visible={visible}
        okText="Add"
        onCancel={handleCancel}
        destroyOnClose="true"
        onOk={() => {
          form
            .validateFields()
            .then((values) => {             

              const startDate = moment().set({'year': startYear, 'month': startMonth, 'date': defaultDate});
              let endDate = undefined;

              if(currentWork) {
                endDate = moment();
                values.current = currentWork;
              }
              else{
                endDate = moment().set({'year': endYear, 'month': endMonth, 'date': defaultDate});
              }
              

              values.startend = [startDate, endDate];

              values.yoe = moment.duration(values.startend[1].diff(values.startend[0])).asMonths();
              
              delete values.start;
              delete values.end;
              

              const out = {
                type: 'work_exp',
                data: values,
                work_id: work_id,
              };
              
              axios
                .post(
                  REACT_APP_AXIOS_API_V1.concat(
                    `entities/candidate-complete-details/${btoa(
                      JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id,
                    )}`,
                  ),
                  out,
                )
                .then((res) => {

                  const updatedCandidatePart = Object.assign({}, res.data);
                  const x = saveCandidate(updatedCandidatePart);

                  x.then((e) => {

                    const temp = [];
                    let newYoe = 0;

                    Object.entries(e.payload.candidate_part.candidate_work_exp).forEach((entry) => {
                      temp.push(entry[1]);
                      newYoe += entry[1].yoe;
                    });
                    
                    setYoe(newYoe.toFixed(2));
                    setWorkList(temp);
                    form.resetFields();
                    setVisible(false);
                  });
                });
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        {
          // title, type, company, location, start, end
        }
        <Form form={form} layout="vertical" name="new_work_exp" preserve="false">
          <Form.Item
            name="title"
            label="Title"
            rules={[
              {
                required: true,
                message: 'Please select one!',
              },
            ]}
          >
            <Select>
            {
              Object.keys(titleTypes).map((k) => (
                <Option key={k}>{titleTypes[k]}</Option>
              ))
            }
            </Select>
          </Form.Item>

          <Form.Item
            name="type"
            label="Type of Employment"
            rules={[
              {
                required: true,
                message: 'Please select one!',
              },
            ]}
          >
            <Select>
              {
                Object.keys(employmentTypes).map((k) => (
                  <Option key={k}>{employmentTypes[k]}</Option>
                ))
              }
            </Select>
          </Form.Item>

          <Form.Item name="projects" label="Link Projects">
            <Select
              mode="multiple"
              onFocus={() => {
                const children = [];
                Object.keys(projectList).forEach((k) => {
                  children.push(
                    <Option key={projectList[k].pk}>{projectList[k].fields.project_title}</Option>,
                  );
                });

                setProjectChoices(children);
              }}
              onBlur={() => {
                setProjectChoices(undefined);
              }}
            >
              {projectChoices}
            </Select>
          </Form.Item>

          <Form.Item
            name="company"
            label="Company"
            rules={[
              {
                required: true,
                message: 'Please input the company name!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="location"
            label="Location"
            rules={[
              {
                required: true,
                message: 'Please input the location!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="start"
            label="Start month and year"
            rules={[
              {
                required: true,
                message: 'Please choose month and year!',
              },
              () => ({
                validator(rule, value) {
                  if((startMonth === undefined || startMonth === null) || (startYear === undefined || startYear === null || startYear === "")){
                    return Promise.reject('')
                  }
                  else{
                    return Promise.resolve();
                  }
                }
              }),
            ]}
          >
            <Space direction='horizontal' size='middle'>
              <Select onChange={(e) => setStartMonth(e)} style={{width:'90px'}}>
                {months.map((v, k) => (
                  <Option key={k}>{v}</Option>
                ))}
              </Select>
              
              <InputNumber onChange={(e) => setStartYear(e)} min={currentYear - 50} max={currentYear} type='number' style={{width:'70px'}} ></InputNumber >
            </Space>
          </Form.Item>

          <Form.Item
            name="end"
            label="End Month and Year "
            rules={[
              {
                message: 'Please choose end month and year!',
              },
              () => ({
                validator(rule, value) {
                  if(endMonth === undefined && endYear === undefined && currentWork === undefined){
                    return Promise.reject('Please choose end date or check the box')
                  }
                  else{
                    return Promise.resolve();
                  }
                }
              }),
            ]}
          >
            <Space direction='vertical' size='middle'>
              <Space direction='horizontal' size='middle'>
                <Select onChange={(e) => setEndMonth(e)} style={{width:'90px'}} disabled={currentWork}>
                  {months.map((v, k) => (
                    <Option key={k}>{v}</Option>
                  ))}
                </Select>
                
                <InputNumber onChange={(e) => setEndYear(e)} min={currentYear - 50} max={currentYear} disabled={currentWork} type='number' style={{width:'70px'}}></InputNumber >
              </Space>
            
            
              <Checkbox onChange={(e) => setCurrentWork(e.target.checked)}>I currently work here</Checkbox>
            </Space>
          </Form.Item>

          <Form.Item name="summary" label="Summary">
            <TextArea
              placeholder="1. Reduced task completion time by 30% via new user flows."
              allowClear
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default connect(({ accountAndcenter }) => ({
  candidate_part: accountAndcenter.candidate_part,
  projectList: accountAndcenter.projectList,
  titleTypes: accountAndcenter.titleTypes,
  employmentTypes: accountAndcenter.employmentTypes,
  saving: accountAndcenter.saving,
}))(WorkExperience);
