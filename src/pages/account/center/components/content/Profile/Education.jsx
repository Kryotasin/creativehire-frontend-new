import {
  List,
  Divider,
  Button,
  Modal,
  Form,
  DatePicker,
  Input,
  Select,
  Spin,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import locale from 'antd/es/date-picker/locale/en_US';
import moment from 'moment';
import styles from './index.less';
import axios from '../../../../../../umiRequestConfig';
import EducationCard from './components/EducationCard';

const { Text } = Typography;

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const Education = (props) => {
  const { dispatch, projectList, candidate_part, degreeTypes } = props;

  const [initLoading, setInitLoading] = useState(false);
  const [educationList, setEducationList] = useState(undefined);

  const [visible, setVisible] = useState(false);
  const [projectChoices, setProjectChoices] = useState(undefined);

  const [form] = Form.useForm();

  const [edu_id, setEduID] = useState(-1);

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

  const rangeConfig = {
    rules: [{ type: 'array', required: true, message: 'Please select time!' }],
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
        title="Add Work Experience"
        visible={visible}
        okText="Add"
        onCancel={handleCancel}
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

export default connect(({ accountAndcenter }) => ({
  currentUser: accountAndcenter.currentUser,
  candidate_part: accountAndcenter.candidate_part,
  projectList: accountAndcenter.projectList,
  degreeTypes: accountAndcenter.degreeTypes,
}))(Education);
