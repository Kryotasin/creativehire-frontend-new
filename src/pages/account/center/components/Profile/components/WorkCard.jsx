import React, { useState, useEffect } from 'react';
import { List, Typography, Button, Modal, Form, DatePicker, Input, Select } from 'antd';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/en_US';
import axios from '../../../../../../umiRequestConfig';

import styles from '../index.less';


const { Paragraph, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;


const WorkCard = props => {

    const { workList, titles, types, projectList, test, setWorkList } = props;
    const [ titlesList, setTitleList ] = useState(undefined);
    const [ typesList, setTypesList ] = useState(undefined);
    const [ confirmLoading, setConfirmLoading ] = useState(false);
  

    const [ visible, setVisible ] = useState(false);
    
    const [ projectChoices, setProjectChoices ] = useState(undefined);

    const [ workMod, setWorkMod ] = useState(undefined);
    const [ work_id, setWorkID ] = useState(-1);
    const [form] = Form.useForm();

    const rangeConfig = {
        rules: [{ type: 'array', required: true, message: 'Please select date!' }],
      };
    
    useEffect(() => {
    if(workMod){
        form.resetFields();
    }
    Modal.destroyAll();
    setWorkMod(workMod);
    
    }, [workMod]);


    const handleCancel = () => {
        form.resetFields();
        setVisible(false);
        Modal.destroyAll();
      };
    

    const descriptionBuilder = (start, end, company, type) => {
        const s = moment(start);
        const e = moment(end);
  
        return (
          <div>
              <div className={styles.test}>{s.locale("en").format('MMMM YYYY')} - {e.locale("en").format('MMMM YYYY')} ({moment.duration(e.diff(s)).asMonths().toFixed(1)} months)</div>
              {company.concat(" - ").concat((types[type]))}
          </div>
        );
    }

    const setModalData = (data, key) => {
        
        data.startend = [moment(data.startend[0]), moment(data.startend[1])];

        const children = [];
        Object.keys(types).forEach( (k) => {
            children.push(<Option key={k}>{types[k]}</Option>);
        });
        
        const c2 = [];

        Object.keys(titles).forEach( (k) => {
            c2.push(<Option key={k}>{titles[k]}</Option>);
        });  

        const c3 = [];
        Object.keys(projectList).forEach( (k) => {
            c3.push(<Option key={projectList[k].pk}>{projectList[k].fields.project_title}</Option>);
        });  

        setTypesList(children);
        setProjectChoices(c3);
        setTitleList(c2);
        
        setWorkMod(data);
        setWorkID(key);
        setVisible(true);
  }


    return(
        <div>
            <List
            itemLayout="vertical"
            size="large"
            dataSource={workList}
            renderItem={(item, k) => (
            <List.Item 
            key={item.company.concat("__").concat(titles[item.title])}
                actions={[<Button onClick={() => {
                    setModalData(item, k);
                }}>Edit</Button>, <Button ><Text type="danger">Delete</Text></Button>]}
                
            >
                <List.Item.Meta
                    title={titles[item.title]}
                    description={descriptionBuilder(item.startend[0], item.startend[1], item.company, item.type)}
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
                values.yoe = moment.duration(values.startend[1].diff(values.startend[0])).asHours();
          
                  
                const out = {
                    "type": "work_exp",
                    "data": values,
                    "work_id": work_id,
                    };
                    
                axios.put(REACT_APP_AXIOS_API_V1.concat(`entities/candidate-complete-details/${btoa(JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id)}`), out)
                .then((res => {
                    const x = test(res.data);
                    
                    x.then((e) =>{
                        setWorkList(e.payload.candidate_work_exp);
                        setConfirmLoading(false);
                        form.resetFields();
                        setVisible(false);
                    });
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
                initialValues={workMod}
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
                    <Select>
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
                    <Select>
                        {typesList}
                    </Select>
                </Form.Item>
                

                <Form.Item
                name="projects"
                label="Link Projects"
                >
                    <Select mode="multiple">
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
    )
}

export default WorkCard;