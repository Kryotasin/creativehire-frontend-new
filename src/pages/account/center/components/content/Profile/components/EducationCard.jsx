import React, { useState, useEffect } from 'react';
import { List, Typography, Button, Modal, Form, DatePicker, Input, Select } from 'antd';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/en_US';
import axios from '../../../../../../../umiRequestConfig';

import styles from '../index.less';

const { Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const EducationCard = (props) => {
  const { educationList, projectList, setEducationList, degreeTypes } = props;

  const [confirmLoading, setConfirmLoading] = useState(false);

  const [educationLoaded, setEducationListLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  const [projectChoices, setProjectChoices] = useState(undefined);

  const [educationMod, setEducationMod] = useState(undefined);
  const [edu_id, setEduID] = useState(-1);
  const [form] = Form.useForm();

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
          {s.locale('en').format('MMMM YYYY')} - {current ? 'Present' : e.locale('en').format('MMMM YYYY')} (
          {moment.duration(e.diff(s)).asMonths().toFixed(1)} months)
        </div>
        {company.concat(' - ').concat(degreeTypes[type])}
      </div>
    );
  };

  const setModalData = (data, key) => {
    data.startend = [moment(data.startend[0]), moment(data.startend[1])];

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
              <Button>
                <Text type="danger">Delete</Text>
              </Button>,
            ]}
          >
            <List.Item.Meta
              title={degreeTypes[item.degree]}
              description={descriptionBuilder(
                item.startend[0],
                item.startend[1],
                item.school,
                item.degree,
                item.current || false
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
        {
          // title, type, company, location, start, end
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
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EducationCard;
