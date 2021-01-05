import React, { useState, useEffect } from 'react';
import { List, Typography, Button, Modal, Form, DatePicker, Input, Select, Space, Checkbox, InputNumber, Popconfirm, message } from 'antd';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/en_US';
import axios from '../../../../../../../umiRequestConfig';

import styles from '../index.less';

const { Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const EducationCard = (props) => {
  const { educationList, projectList, setEducationList, degreeTypes, months, currentYear, defaultDate, saveCandidate, saving } = props;

  const [confirmLoading, setConfirmLoading] = useState(false);

  const [educationLoaded, setEducationListLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  const [projectChoices, setProjectChoices] = useState(undefined);

  const [educationMod, setEducationMod] = useState(undefined);
  const [edu_id, setEduID] = useState(-1);
  const [form] = Form.useForm();

  const [ startMonth, setStartMonth ] = useState(undefined);
  const [ startYear, setStartYear ] = useState(undefined);

  const [ endMonth, setEndMonth ] = useState(undefined);
  const [ endYear, setEndYear ] = useState(undefined);

  const[ currentEducation, setCurrentEducation ] = useState(undefined);

  const rangeConfig = {
    rules: [{ type: 'array', required: true, message: 'Please select date!' }],
  };

  useEffect(() => {
    if (educationMod) {
      form.resetFields();
    }
    Modal.destroyAll();
    setEducationMod(educationMod);
  }, [educationMod]);

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
    Modal.destroyAll();
  };

  const descriptionBuilder = (startend, type, current, major) => {
    const [ start, end ] = startend;

    const s = moment(start);
    let e;
    if(current){
      e = moment();
    }
    else{
      e = moment(end);
    }
    
    const timeDiff = moment.duration(e.diff(s));

    const theDiffObject = {
        years: moment.duration(timeDiff).years(),
        months: moment.duration(timeDiff).months(),
        // weeks: moment.duration(timeDiff).weeks(),
        // days: moment.duration(timeDiff).days()
    }

    return (
      <div style={{color: '#505050'}}>
        <div className={styles.dates}>
          {s.locale('en').format('MMMM YYYY')} - {current ? 'Present ' : e.locale('en').format('MMMM YYYY')} 
          {'('.concat(String((theDiffObject.years))).concat('y ').concat(String(theDiffObject.months)).concat('m').concat(')')}
        </div>
        {major.concat(' - ').concat(degreeTypes[type])}
      </div>
    );
  };

  const deleteEducationHandler = (educationItemKey) => {

    const out ={
      type: 'deletion',
      deletion_type: 'education',
      key: educationItemKey
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
        console.log(res.data)
        const updatedCandidatePart = Object.assign({}, res.data);
        const x = saveCandidate(updatedCandidatePart);

        x.then((e) => {

          const temp = [];

          Object.entries(e.payload.candidate_part.candidate_education_history).forEach((entry) => {
            temp.push(entry[1]);
          });
          
          setEducationList(temp);
          message.success('Succesfully deleted')
        });

      });
  }

  function cancel(e) {
    console.log('clicked no');
  }

  const setModalData = (data, key) => {
    const [ start, end ] = data.startend;
    const startDate = moment(start);

    setStartMonth(startDate.month());
    setStartYear(startDate.year());


    if(!data.current){
      const endDate = moment(end);

      setEndMonth(endDate.month());
      setEndYear(endDate.year());
    }

    setCurrentEducation(data.current);

    const children = [];
    Object.keys(degreeTypes).forEach((k) => {
      children.push(<Option key={k}>{degreeTypes[k]}</Option>);
    });

    const c3 = [];
    Object.keys(projectList).forEach((k) => {
      c3.push(<Option key={projectList[k].pk}>{projectList[k].fields.project_title}</Option>);
    });

    setProjectChoices(c3);
    setEducationMod(data);
    setVisible(true);
    setEduID(key);
  };

  return (
    <div>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={educationList}
        renderItem={(item, k) => (
          <List.Item
            key={item.school.concat('__').concat(item.degree)}
            actions={[
              <Button
                onClick={() => {
                  setModalData(item, k);
                }}
              >
                Edit
              </Button>,
              <Popconfirm
                title="Are you sure to delete this Education?"
                onConfirm={() => deleteEducationHandler(k)}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button>
                  <Text type="danger">Delete</Text>
                </Button>
            </Popconfirm>
              ,
            ]}
          >
            <List.Item.Meta
              title={item.school}
              description={descriptionBuilder(
                item.startend,
                item.degree,
                item.current || false,
                item.major
              )}
            />
            {/* <div>{moment(item.startend[0]).format('DD-MM-YYYY').concat(" to ").concat(moment(item.startend[1]).format('DD-MM-YYYY'))}</div> */}
            <Paragraph ellipsis={{ rows: 3, expandable: true }}>{item.summary}</Paragraph>
          </List.Item>
        )}
      />

      <Modal
        title="Update Education"
        visible={visible}
        okText="Update"
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
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

                    Object.entries(e.payload.candidate_part.candidate_education_history).forEach((entry) => {
                      temp.push(entry[1]);
                    });
                    
                    setEducationList(temp);
                    form.resetFields();
                    setVisible(false);
                    message.success('Succesfully added');
                    setConfirmLoading(true);
                  });

                });
            })
            .catch((info) => {
              console.log('Validate Failed:', info);
            });
        }}
      >
        {
          // title, type, school, location, start, end
        }
        <Form form={form} layout="vertical" name="new_work_exp" initialValues={educationMod}>
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
                message: 'Please select degree type!',
              },
            ]}
          >
            <Select>
              {degreeTypes.map((v, k) => (
                <Option key={k}>{v}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="major"
            label="Major"
            placeholder="Human-Computer Interaction"
            rules={[
              {
                required: true,
                message: 'Please enter your major!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="projects" label="Link Projects">
            <Select mode="multiple">{projectChoices}</Select>
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
              <Select defaultValue={months[startMonth]} onChange={(e) => setStartMonth(e)} style={{width:'90px'}}>
                {months.map((v, k) => (
                  <Option key={k}>{v}</Option>
                ))}
              </Select>
              
              <InputNumber defaultValue={startYear} onChange={(e) => setStartYear(e)} min={currentYear - 50} max={currentYear} type='number' style={{width:'70px'}} ></InputNumber >
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
                <Select defaultValue={currentEducation ? '' : months[endMonth]} onChange={(e) => setEndMonth(e)} style={{width:'90px'}} disabled={currentEducation}>
                  {months.map((v, k) => (
                    <Option key={k}>{v}</Option>
                  ))}
                </Select>
                
                <InputNumber defaultValue={currentEducation ? '' : endYear} onChange={(e) => setEndYear(e)} min={currentYear - 50} max={currentYear} disabled={currentEducation} type='number' style={{width:'70px'}}></InputNumber >
              </Space>
            
            
              <Checkbox defaultChecked={currentEducation} onChange={(e) => setCurrentEducation(e.target.checked)}>I'm a current student</Checkbox>
            </Space>
          </Form.Item>

          <Form.Item
            name="summary"
            label="Summary"
            // rules={[
            //     {
            //     required: true,
            //     message: 'Please input the school name!',
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

export default EducationCard;
