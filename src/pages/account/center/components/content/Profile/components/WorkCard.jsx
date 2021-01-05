import React, { useState, useEffect } from 'react';
import { List, Typography, Button, Modal, Form, DatePicker, Input, Select, Spin, Space, InputNumber, Checkbox, Popconfirm, message } from 'antd';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/en_US';
import axios from '../../../../../../../umiRequestConfig';

import styles from '../index.less';

const { Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const WorkCard = (props) => {
  const { workList, titleTypes, employmentTypes, projectList, saveCandidate, setWorkList, months, currentYear, defaultDate, setYoe } = props;
  const [titlesList, setTitleList] = useState(undefined);
  const [typesList, setTypesList] = useState(undefined);

  const [workListLoaded, setWorkListLoaded] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [visible, setVisible] = useState(false);

  const [projectChoices, setProjectChoices] = useState(undefined);

  const [workMod, setWorkMod] = useState(undefined);
  const [work_id, setWorkID] = useState(-1);
  const [form] = Form.useForm();


  const [ startMonth, setStartMonth ] = useState(undefined);
  const [ startYear, setStartYear ] = useState(undefined);

  const [ endMonth, setEndMonth ] = useState(undefined);
  const [ endYear, setEndYear ] = useState(undefined);

  const [ currentWork, setCurrentWork ] = useState(undefined);

  const rangeConfig = {
    rules: [{ type: 'array', required: true, message: 'Please select date!' }],
  };

  useEffect(() => {
    if (workMod) {
      form.resetFields();
    }
    Modal.destroyAll();
    setWorkMod(workMod);
  }, [workMod]);

  useEffect(() => {
    if (titleTypes !== undefined && employmentTypes !== undefined) {
      setWorkListLoaded(true);
    }
  });

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
    Modal.destroyAll();
  };

  const descriptionBuilder = (startend, company, type, current) => {
    
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
          {s.locale('en').format('MMM YYYY')} - {current ? 'Now ' : e.locale('en').format('MMMM YYYY')} 
          {'('.concat(String((theDiffObject.years))).concat('y ').concat(String(theDiffObject.months)).concat('m').concat(')')}
        </div>
        {company.concat(' - ').concat(employmentTypes[type])}
      </div>
    );
  };


  const deleteWorkExpHandler = (workExpItemKey) => {

    const out ={
      type: 'deletion',
      deletion_type: 'work_exp',
      key: workExpItemKey
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

          setYoe(newYoe.toFixed());
          setWorkList(temp);
          message.success('Succesfully deleted');
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

    setCurrentWork(data.current);

    const children = [];
    Object.keys(employmentTypes).forEach((k) => {
      children.push(<Option key={k}>{employmentTypes[k]}</Option>);
    });

    const c2 = [];

    Object.keys(titleTypes).forEach((k) => {
      c2.push(<Option key={k}>{titleTypes[k]}</Option>);
    });

    const c3 = [];
    Object.keys(projectList).forEach((k) => {
      c3.push(<Option key={projectList[k].pk}>{projectList[k].fields.project_title}</Option>);
    });

    setTypesList(children);
    setProjectChoices(c3);
    setTitleList(c2);

    setWorkMod(data);
    setWorkID(key);
    setVisible(true);
  };

  return (
    <div>
      {workListLoaded ? (
        <div>
          <List
            itemLayout="vertical"
            size="large"
            dataSource={workList}
            renderItem={(item, k) => (
              <List.Item
                key={item.company.concat('__').concat(item.title).concat('__').concat(item.type)}
                actions={[
                  <Button
                    onClick={() => {
                      setModalData(item, k);
                    }}
                  >
                    Edit
                  </Button>,
                  <Popconfirm
                    title="Are you sure to delete this Work Experience?"
                    onConfirm={() => deleteWorkExpHandler(k)}
                    onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button>
                      <Text type="danger">Delete</Text>
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={titleTypes[item.title]}
                  description={descriptionBuilder(
                    item.startend,
                    item.company,
                    item.type,
                    item.current || false
                  )}
                />
                {/* <div>{moment(item.startend[0]).format('DD-MM-YYYY').concat(" to ").concat(moment(item.startend[1]).format('DD-MM-YYYY'))}</div> */}
                <Paragraph ellipsis={{ rows: 3, expandable: true }}>{item.summary}</Paragraph>
              </List.Item>
            )}
          />
          <Modal
            title="Update Work Experience"
            visible={visible}
            okText="Update"
            onCancel={handleCancel}
            confirmLoading={confirmLoading}
            destroyOnClose="true"
            onOk={() => {
              form
                .validateFields()
                .then((values) => {

                  setConfirmLoading(true);

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
    
                        setYoe(newYoe.toFixed());
                        setWorkList(temp);
                        form.resetFields();
                        setVisible(false);
                        message.success('Succesfully added');
                        setConfirmLoading(false);
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
            <Form form={form} layout="vertical" name="new_work_exp" initialValues={workMod}>
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
                  {titleTypes.map((v, k) => (
                    <Option key={k}>{v}</Option>
                  ))}
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
                <Select>{typesList}</Select>
              </Form.Item>

              <Form.Item name="projects" label="Link Projects">
                <Select mode="multiple">{projectChoices}</Select>
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
                <Select defaultValue={months[endMonth]} onChange={(e) => setEndMonth(e)} style={{width:'90px'}} disabled={currentWork}>
                  {months.map((v, k) => (
                    <Option key={k}>{v}</Option>
                  ))}
                </Select>
                
                <InputNumber defaultValue={endYear} onChange={(e) => setEndYear(e)} min={currentYear - 50} max={currentYear} disabled={currentWork} type='number' style={{width:'70px'}}></InputNumber >
              </Space>
            
            
              <Checkbox defaultChecked={currentWork} onChange={(e) => setCurrentWork(e.target.checked)}>I currently work here</Checkbox>
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
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      ) : (
        'Loading'
      )}
    </div>
  );
};

export default WorkCard;
