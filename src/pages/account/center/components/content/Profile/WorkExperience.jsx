import { List, Divider, Button, Modal, Form, DatePicker, Input, Select, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import locale from 'antd/es/date-picker/locale/en_US';
import moment from 'moment';
import styles from './index.less';
import axios from '../../../../../../umiRequestConfig';
import WorkCard from './components/WorkCard';

const { Text } = Typography;


const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

const titles = ["UX Designer", "UI Designer", "UX/UI Designer", "Interaction Designer", "Product Designer", "Visual Designer", "UX Researcher", "UX Writer", "Motion Designer"];
const types = ["Full-Time", "Part-Time", "Internship/Co-op", "Volunteer", "Pro Bono"]


const WorkExperience = props => {
  const { dispatch, projectList, candidate_part } = props;
  const [ titlesList, setTitleList ] = useState(undefined);
  const [ typesList, setTypesList ] = useState(undefined);

  const [ initLoading, setInitLoading ] = useState(true);
  const [ workList, setWorkList ] = useState(undefined);

  const [ visible, setVisible ] = useState(false);
  const [ projectChoices, setProjectChoices ] = useState(undefined);
  const [yoe, setYoe ] = useState(0);

  const [form] = Form.useForm();
//   const [ workMod, setWorkMod ] = useState(undefined);
  const [ work_id, setWorkID ] = useState(-1);

  useEffect(() => {
      
      if(Object.keys(candidate_part).length !== 0 && workList === undefined){
          
            const temp = [];

            if(candidate_part.candidate_work_exp){
                Object.entries(candidate_part.candidate_work_exp).forEach(e => {
                    temp.push(e[1]);
                })
            }
            setWorkList(temp);
            
            setYoe((candidate_part.candidate_yoe * 0.000114155).toFixed(2));
            setInitLoading(false);
      }    

  }, [candidate_part]);


  const handleCancel = () => {
    setVisible(false);
  };

  const rangeConfig = {
    rules: [{ type: 'array', required: true, message: 'Please select time!' }],
  };


  return (
    <div className="parts">
        <Divider />
      <div className={styles.name}>
        Work History
      </div>

      <Text strong>Total Years of Experience (YoE):</Text> <Text mark>{yoe} years</Text>

    {
        initLoading ? 
        <Spin />
        :
        <WorkCard setWorkList={(e) => {
            const temp = [];
            Object.entries(e).forEach(x => {
                temp.push(x[1]);
            })
            setWorkList(temp);
        }} workList={workList} titles={titles} types={types} projectList={projectList} candidate_part={candidate_part} test={async (e) => { 
            return dispatch({
                type: 'accountAndcenter/saveCandidatePart',
                payload: e
              });
              
        }} />
    }

      <Button type="link" onClick={() => {
          setVisible(true);
      }} icon={<PlusOutlined />}>Add new</Button>


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
                  values.yoe = moment.duration(values.startend[1].diff(values.startend[0])).asHours();
                  
                  const out = {
                    "type": "work_exp",
                    "data": values,
                    "work_id": work_id
                  };


                  axios.put(REACT_APP_AXIOS_API_V1.concat(`entities/candidate-complete-details/${btoa(JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id)}`), out)
                  .then((res => {
                      console.log(res)
                        const temp = [];
                        let newYoe = 0;

                        Object.entries(res.data.candidate_work_exp).forEach(e => {
                            temp.push(e[1]);
                            newYoe += e[1].yoe;
                        });
                        
                        
                        setYoe((newYoe * 0.000114155).toFixed(2));
                        setWorkList(temp);
                        form.resetFields();
                        setVisible(false);
                  }));
                
              })
              .catch((info) => {
                console.log('Validate Failed:', info);
              });
          }}
        >
            {
                // title, type, company, location, start, end
            }
            <Form
                form={form}
                layout="vertical"
                name="new_work_exp"
                // initialValues={workMod}
                preserve="false"
            >
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
                    <Select
                        onFocus={() =>  {
                            const children = [];
                            Object.keys(titles).forEach( (k) => {
                                children.push(<Option key={k}>{titles[k]}</Option>);
                            });
                    
                            setTitleList(children);
                        }}
                        onBlur={() => {
                            setTitleList(undefined);
                        }}
                    >
                        {titlesList}
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
                <Select
                    onFocus={() =>  {
                        const children = [];
                        Object.keys(types).forEach( (k) => {
                            children.push(<Option key={k}>{types[k]}</Option>);
                        })  
                
                        setTypesList(children);
                    }}
                    onBlur={() => {
                        setTypesList(undefined);
                    }}
                >
                    {typesList}
                </Select>
                </Form.Item>
                

                <Form.Item
                name="projects"
                label="Link Projects"
                >
                    <Select mode="multiple" 
                    onFocus={() =>  {
                        const children = [];
                        Object.keys(projectList).forEach( (k) => {
                            children.push(<Option key={projectList[k].pk}>{projectList[k].fields.project_title}</Option>);
                        })  
                
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

                <Form.Item name="startend" label="Start & End Date (Approx. dates are ok)" {...rangeConfig}>
                    <RangePicker locale={locale}/>
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
                    <TextArea placeholder="1. Reduced task completion time by 30% via new user flows." allowClear />
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
}))(WorkExperience);
