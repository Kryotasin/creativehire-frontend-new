import React, { useState } from 'react';
import { Select, Form, Input, Button, Tooltip, message, Typography, DatePicker } from 'antd';
import { HomeOutlined, EnvironmentTwoTone } from '@ant-design/icons';
import moment from 'moment';
import jwt_decode from 'jwt-decode';

import styles from '../Center.less';
import axios from '../../../../umiRequestConfig';
import { useEffect } from 'react';


const dateFormat = 'YYYY/MM/DD';

const { Text } = Typography;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };


function BasicDetails(props) {

    const { currentUser, editMode, action } = props;
    const [ first_name, setFirstName ] = useState(currentUser.entity.first_name);
    const [ last_name, setLastName ] = useState(currentUser.entity.last_name);
    const [ user_location, setLocation ] = useState(currentUser.entity.user_location);
    const [ user_summary, setSummary ] = useState(currentUser.entity.user_summary);
    const [ user_dob, setDob ] = useState(currentUser.entity.user_dob);

    const handleUpdate = (values) => {

        if(user_location){
            console.log("here")
            values.user_location = user_location;
        }

        if(values.user_dob){
            values.user_dob = values.user_dob._d.toString().replace('(Pacific Daylight Time)', '');
        }

        console.log(values);
        console.log(currentUser)
        // dt = datetime.strptime('Tue Sep 08 2020 23:35:02 GMT-0700', '%a %b %d %Y %X %Z%z')  
        axios.put(REACT_APP_AXIOS_API_V1.concat('entities/update-personal-details/').concat(btoa(jwt_decode(localStorage.getItem('accessToken')).user_id)),{
            'email': currentUser.entity.email,
            'first_name': values.first_name,
            'last_name': values.last_name,
            'user_location': values.user_location,
            'user_summary': values.user_summary,
            'user_dob': values.user_dob
        })
        .then((res) => {
            setFirstName(res.data.first_name);
            setLastName(res.data.last_name);
            setLocation(res.data.user_location);
            setSummary(res.data.user_summary);
            setDob(res.data.user_dob);
            action();
            console.log(res)
        });
    }

    const getLocation = () =>{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((e) => {

                fetch('http://www.mapquestapi.com/geocoding/v1/reverse?key='.concat(REACT_APP_GEOCODE_REVERSE).concat('&location=').concat(e.coords.latitude.toString()).concat(',').concat(e.coords.longitude.toString()).concat('&thumbMaps=false'))
                .then(res => {
                    return res.json();
                })
                .then(res => {
                    setLocation(res.results[0].locations[0])
                })
            }, 
            ()=>message.error('Failed to get location'));
        } else { 
            message.error('Failed to get location')
        }
    }

    const suffix = (
        <Tooltip title="Locate me">
            <Button onClick={getLocation} type="link" icon={<EnvironmentTwoTone />} size="small" />
        </Tooltip>
    );
    
    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current > moment().endOf('day');
    }

    useEffect(()=>{
        // let formBaseData = {
        //     user_dob: currentUser.entity.user_dob ? moment(currentUser.entity.user_dob) : null
        //   }
        // formBaseData = { ...currentUser.entity, ...formBaseData };
        currentUser.entity.user_dob = currentUser.entity.user_dob ? moment(currentUser.entity.user_dob) : null;
    })

    return(
        <>
            <div className={styles.avatarHolder}>
                <img alt="" src={currentUser.avatar} />
            {
                editMode ?
                <Form initialValues={ currentUser.entity } onFinish={handleUpdate}>
                    <Form.Item name={['first_name']} label="First Name">
                        <Input />
                    </Form.Item>

                    <Form.Item name={['last_name']} label="Last Name">
                        <Input />
                    </Form.Item>

                    <Form.Item label="Location">
                        {user_location ? user_location.adminArea5.concat(', ').concat(user_location.adminArea3).concat(', ').concat(user_location.adminArea1) : 'Location not set'} {suffix}
                    </Form.Item>

                    <Form.Item name={['user_dob']} label="Date of Birth">
                        <DatePicker format={dateFormat} disabledDate={disabledDate} />
                    </Form.Item>

                    <Form.Item name={['user_summary']} label="Summary">
                        <Input.TextArea />
                    </Form.Item>

                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                        <Button type="primary" htmlType="submit">
                        Update
                        </Button>
                    </Form.Item>
                </Form>
                :
                <>
                    <div className={styles.name}>{first_name + " " + last_name }</div>
                </>
            }
            
            </div>


            <div className={styles.detail}>
    
            <div className={styles.supplement}>
            { editMode ? '':    
                <>        
                    <HomeOutlined
                        style={{
                        marginRight: 8,
                        }}
                    />
                    { currentUser && user_location ? user_location.adminArea5.concat(', ').concat(user_location.adminArea3).concat(', ').concat(user_location.adminArea1) :
                        <Text strong>Location not set</Text>
                    }
                </>
            }

            </div>
            
            <div className={styles.supplement}>
            { editMode ? '': user_summary }
            </div>
    
        </div>
        </>
    )
}

export default BasicDetails;