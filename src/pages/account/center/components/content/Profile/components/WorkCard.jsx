import React, { useState, useEffect } from 'react';
import { List, Typography, Button, Modal, Form, DatePicker, Input, Select, Spin } from 'antd';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/en_US';
import axios from '../../../../../../../umiRequestConfig';

import styles from '../index.less';

const { Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const WorkCard = (props) => {
  const { workList, titleTypes, employmentTypes, projectList, saveCandidate, setWorkList } = props;
  const [titlesList, setTitleList] = useState(undefined);
  const [typesList, setTypesList] = useState(undefined);

  const [workListLoaded, setWorkListLoaded] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [visible, setVisible] = useState(false);

  const [projectChoices, setProjectChoices] = useState(undefined);

  const [workMod, setWorkMod] = useState(undefined);
  const [work_id, setWorkID] = useState(-1);
  const [form] = Form.useForm();

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

  const descriptionBuilder = (start, end, company, type, current) => {
    const s = moment(start);
    let e;

    if(current){
      e = moment();
    }
    else{
      e = moment(end);
    }

    return (
      <div>
        <div className={styles.test}>
          {s.locale('en').format('MMMM YYYY')} - {current ? 'Present' : e.locale('en').format('MMMM YYYY')} 
          ({moment.duration(e.diff(s)).asMonths().toFixed(1)} months)
        </div>
        {company.concat(' - ').concat(employmentTypes[type])}
      </div>
    );
  };

  const setModalData = (data, key) => {
    data.startend = [moment(data.startend[0]), moment(data.startend[1])];

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
                key={item.company.concat('__').concat(item.title)}
                actions={[
                  <Button
                    onClick={() => {
                      setModalData(item, k);
                    }}
                  >
                    Edit
                  </Button>,
                  <Button>
                    <Text type="danger">Delete</Text>
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={titleTypes[item.title]}
                  description={descriptionBuilder(
                    item.startend[0],
                    item.startend[1],
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
                  values.yoe = moment
                    .duration(values.startend[1].diff(values.startend[0]))
                    .asHours();

                  const out = {
                    type: 'work_exp',
                    data: values,
                    work_id: work_id,
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
                      const x = saveCandidate(res.data);

                      x.then((e) => {
                        setWorkList(e.payload.candidate_work_exp);
                        setConfirmLoading(false);
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
                name="startend"
                label="Start & End Date (Approx. dates are ok)"
                {...rangeConfig}
              >
                <RangePicker locale={locale} />
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
