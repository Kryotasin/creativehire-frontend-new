import {
  Divider,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Spin,
  Typography,
  Space,
  InputNumber,
  Checkbox
} from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './index.less';
import axios from '../../../../../../umiRequestConfig';
import EducationCard from './components/EducationCard';

const { Text } = Typography;

const { Option } = Select;
const { TextArea } = Input;


const Education = (props) => {
  const { dispatch, projectList, candidate_part, degreeTypes, months, currentYear, defaultDate } = props;

  const [initLoading, setInitLoading] = useState(false);
  const [educationList, setEducationList] = useState(undefined);

  const [visible, setVisible] = useState(false);
  const [projectChoices, setProjectChoices] = useState(undefined);

  const [form] = Form.useForm();

  const [edu_id, setEduID] = useState(-1);

  const [ startMonth, setStartMonth ] = useState(undefined);
  const [ startYear, setStartYear ] = useState(undefined);

  const [ endMonth, setEndMonth ] = useState(undefined);
  const [ endYear, setEndYear ] = useState(undefined);

  const[ currentEducation, setCurrentEducation ] = useState(undefined);

  useEffect(() => {
    if (Object.keys(candidate_part).length !== 0 && educationList === undefined) {
      const temp = [];

      if (candidate_part.candidate_education_history) {
        Object.entries(candidate_part.candidate_education_history).forEach((e) => {
          temp.push(e[1]);
        });
      }

      setEducationList(temp);
    }
  }, [candidate_part]);

  useEffect(() => {
    if (Object.keys(degreeTypes).length === 0) {
      dispatch({
        type: 'accountAndcenter/fetchDegreeTypes',
      });
    }
  }, [degreeTypes]);

  useEffect(() => {
    if (
      degreeTypes !== undefined &&
      educationList !== undefined &&
      Object.keys(candidate_part).length !== 0
    ) {
      setInitLoading(true);
    }
  }, [candidate_part, educationList, degreeTypes]);

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div className="parts">
      <Divider />
      <div className={styles.name}>Education</div>

      {initLoading ? (
        <>
          <EducationCard
            degreeTypes={degreeTypes}
            educationList={educationList}
            projectList={projectList}
            setEducationList={setEducationList}
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
      ) : (
        <Spin />
      )}

      <Modal
        title="Add Education"
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

              if(currentEducation) {
                endDate = moment();
                values.current = currentEducation;
              }
              else{
                endDate = moment().set({'year': endYear, 'month': endMonth, 'date': defaultDate});
              }
              

              values.startend = [startDate, endDate];

              const out = {
                type: 'education',
                data: values,
                edu_id: edu_id,
              };

              axios
                .put(
                  REACT_APP_AXIOS_API_V1.concat(
                    `entities/candidate-complete-details/${btoa(
                      JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id,
                    )}`,
                  ),
                  out,
                )
                .then((res) => {
                  console.log(res);
                  const temp = [];

                  Object.entries(res.data.candidate_education_history).forEach((e) => {
                    temp.push(e[1]);
                  });

                  setEducationList(temp);
                  form.resetFields();
                  setVisible(false);
                });
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="new_education"
          // initialValues={workMod}
          preserve="false"
        >
          <Form.Item
            name="school"
            label="School"
            rules={[
              {
                required: true,
                message: 'Please Enter School name!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="degree"
            label="Degree"
            placeholder="Ex: Bachelor's Degreee"
            rules={[
              {
                required: true,
                message: 'Please enter degree type!',
              },
            ]}
          >
            <Select>
              {degreeTypes.map((v, k) => (
                <Option key={k}>{v}</Option>
              ))}
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
                  if(endMonth === undefined && endYear === undefined && currentEducation === undefined){
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
                <Select onChange={(e) => setEndMonth(e)} style={{width:'90px'}} disabled={currentEducation}>
                  {months.map((v, k) => (
                    <Option key={k}>{v}</Option>
                  ))}
                </Select>
                
                <InputNumber onChange={(e) => setEndYear(e)} min={currentYear - 50} max={currentYear} disabled={currentEducation} type='number' style={{width:'70px'}}></InputNumber >
              </Space>
            
            
              <Checkbox onChange={(e) => setCurrentEducation(e.target.checked)}>I'm a current student</Checkbox>
            </Space>
          </Form.Item>

          <Form.Item
            name="summary"
            label="Summary"
            // rules={[
            //     {
            //     required: true,
            //     message: 'Please input the company name!',
            //     },
            // ]}
          >
            <TextArea
              placeholder="1. Reduced task completion time by 30% via new user flows."
              allowClear
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default connect(({ accountAndcenter }) => ({
  currentUser: accountAndcenter.currentUser,
  candidate_part: accountAndcenter.candidate_part,
  projectList: accountAndcenter.projectList,
  degreeTypes: accountAndcenter.degreeTypes,
}))(Education);
