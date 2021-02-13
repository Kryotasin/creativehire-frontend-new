import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Tooltip, message, Typography, DatePicker, Space, Upload, Select } from 'antd';
import {
  EnvironmentOutlined,
  EnvironmentTwoTone,
  BehanceCircleFilled,
  LinkedinFilled,
  DribbbleCircleFilled,
  CameraOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

import styles from '../../Center.less';
import axios from '../../../../../umiRequestConfig';
import temp from '../../../../../assets/anony.png';
import { isNumber } from 'lodash';

// const dateFormat = 'YYYY/MM/DD';

const { Text } = Typography;
const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const extractHostname = (url) => {
  let hostname;

  // find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }

  // find & remove port number
  hostname = hostname.split(':')[0];

  // find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
};

function BasicDetails(props) {
  const { entity, editMode, action, titleTypes, userID, dispatch, profile_picture } = props;

  
  const [first_name, setFirstName] = useState(entity.first_name);
  const [last_name, setLastName] = useState(entity.last_name);
  const [user_location, setLocation] = useState(entity.user_location);
  const [user_summary, setSummary] = useState(entity.user_summary);
  const [user_title, setTitle] = useState(entity.user_title);

  const [portfolio_link, setPortfolio] = useState(undefined);
  const [behance_link, setBehance] = useState(undefined);
  const [linkedin_link, setLinkedin] = useState(undefined);
  const [dribble_link, setDribble] = useState(undefined);

  const [profilepic, setProfilepic] = useState(undefined);
  // const [ user_dob, setDob ] = useState(entity.user_dob);

  const [candidate_processed, setCP] = useState(undefined);

  // useEffect(() => {
  //     if(entity){
  //         console.log(typeof(entity))
  //     }
  // }, [entity])

  const typeOfImage = (proc) => {
    return { type: 'profile_pic', process: proc, fileName: entity.user_img_salt };
  };

  // const reloadProfilePicture = () => {
  //   // if(REACT_APP_ENV !== 'dev'){
  //     axios
  //       .post('api/v1/file-handler/', {
  //         ...typeOfImage('fetch'),
  //       })
  //       .then((res) => {
  //         if (res.status === 404) {
  //           // Set something to show lack of profile picture.
  //           setTimeout(() => message.warning('Profile picture not found.'), 100);
  //         } else if (res.status === 200 && res.data !== 'ErrorResponseMetadata') {
  //           setProfilepic(res.data);
  //         } else if (res.status === 200 && res.data === 'ErrorResponseMetadata') {
  //           // Set something to show lack of profile picture.
  //           setTimeout(() => message.warning('Profile picture not found.'), 100);
  //         }
  //       });
  //   // }
  //   // else{
  //   //   console.log('dev mode, skipping s3 image fetch')
  //   // }
  // };

  useEffect(() => {
    // let formBaseData = {
    //     user_dob: entity.user_dob ? moment(entity.user_dob) : null
    //   }
    // formBaseData = { ...entity, ...formBaseData };
    // entity.user_dob = entity.user_dob ? moment(entity.user_dob) : null;

    if (entity.user_external_links) {
      setPortfolio(entity.user_external_links.portfolio_link);
      setBehance(entity.user_external_links.behance_link);
      setLinkedin(entity.user_external_links.linkedin_link);
      setDribble(entity.user_external_links.dribble_link);
      

      const cu = entity;
      cu.behance_link = entity.user_external_links.behance_link;
      cu.portfolio_link = entity.user_external_links.portfolio_link;
      cu.linkedin_link = entity.user_external_links.linkedin_link;
      cu.dribble_link = entity.user_external_links.dribble_link;

      if(entity.user_title){
        cu.user_title = titleTypes[entity.user_title];
      }

      setCP(cu);
    } 
    else {
      const cu = entity;
      
      if(entity.user_title){
        cu.user_title = titleTypes[entity.user_title];
      }

      setCP(entity);
    }
  }, []);

  useEffect(() => {
    // reloadProfilePicture();
  }, []);

  // https://api.creativehire.co/api/v1/

  const entityPictureUploadProps = {
    name: 'file',
    acceptedFiles: '.png',
    multiple: false,
    method: 'post',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
    data: typeOfImage('upload'),
    action: `${REACT_APP_AXIOS_BASEURL}/${REACT_APP_AXIOS_API_V1}file-handler/`,
    onRemove(file) {
      axios.post('file-handler/', {
        file: file.name,
        ...typeOfImage('remove'),
      });
    },

    onChange(info) {
      const { status } = info.file;

      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        
        dispatch({
          type: 'accountAndcenter/fetchProfilePicture',
          payload: userID
        });

      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`.concat(info));
      }
    },
    beforeUpload(file) {
      const isImage = file.type === 'image/png' || file.type === 'image/jpeg';
      
      if(!isImage){
        message.error('Upload only png or jpeg files < 5 MB', 5);
      }

      const isLt5M = file.size / 1024 / 1024 < 5;

      if(!isLt5M){
        message.error('File should be smaller than 5 MB.', 5);
      }

      return isImage && isLt5M;
    },
  };

  const handleUpdate = (values) => {
    if (user_location) {
      values.user_location = user_location;
    } else {
      values.user_location = null;
    }

    const user_external_links = {
      portfolio_link: values.portfolio_link,
      behance_link: values.behance_link,
      linkedin_link: values.linkedin_link,
      dribble_link: values.dribble_link,
    };
    
    // if(values.user_dob){
    //     values.user_dob = values.user_dob._d.toString().replace('(Pacific Daylight Time)', '');
    // }

    // dt = datetime.strptime('Tue Sep 08 2020 23:35:02 GMT-0700', '%a %b %d %Y %X %Z%z')

    let user_title_id;

    if(Number.isInteger(Number(values.user_title))){
      user_title_id = values.user_title;
    }
    else{
      Object.keys(titleTypes).find(index => {if(titleTypes[index] === values.user_title) user_title_id = index});
    }


    const data = {
      email: entity.email,
      first_name: values.first_name,
      last_name: values.last_name,
      user_location: values.user_location,
      user_summary: values.user_summary,
      user_title: user_title_id,
      // 'user_dob': values.user_dob
      user_external_links: user_external_links,
      // user_title: user_title_id
    };

    axios
      .put(
        REACT_APP_AXIOS_API_V1.concat('entities/update-personal-details/').concat(
          btoa(userID),
        ),
        data,
      )
      .then((res) => {
        setFirstName(res.data.first_name);
        setLastName(res.data.last_name);
        setLocation(res.data.user_location);
        setSummary(res.data.user_summary);
        setTitle(res.data.user_title);
        setPortfolio(res.data.user_external_links.portfolio_link);
        setBehance(res.data.user_external_links.behance_link);
        setLinkedin(res.data.user_external_links.linkedin_link);
        setDribble(res.data.user_external_links.dribble_link);

        dispatch({
          type: 'accountAndcenter/saveNewState',
          payload: { entity_part: res.data },
        });

        const cu = res.data;
        cu.portfolio_link = res.data.user_external_links.portfolio_link;
        cu.behance_link = res.data.user_external_links.behance_link;
        cu.linkedin_link = res.data.user_external_links.linkedin_link;
        cu.dribble_link = res.data.user_external_links.dribble_link;
        
        cu.user_title = titleTypes[res.data.user_title];
        
        setCP(cu);
        // setDob(res.data.user_dob);
        action();
      });
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (e) => {
          fetch(
            'https://www.mapquestapi.com/geocoding/v1/reverse?key='
              .concat(REACT_APP_GEOCODE_REVERSE)
              .concat('&location=')
              .concat(e.coords.latitude.toString())
              .concat(',')
              .concat(e.coords.longitude.toString())
              .concat('&thumbMaps=false'),
          )
            .then((res) => {
              return res.json();
            })
            .then((res) => {
              setLocation(res.results[0].locations[0]);
            });
        },
        (err) => {
          if(err.code === 1){
            message.error('Location access is blocked. Please check browser permissions.', 4)
          }
        },
      );
    } else {
      message.error('Cannot find location.');
    }
  };

  const suffix = (
    <Tooltip title="Locate me">
      <Button onClick={getLocation} type="link" icon={<EnvironmentTwoTone />} size="small" >Locate me</Button>
    </Tooltip>
  );

  // const disabledDate = (current) => {
  //     // Can not select days before today and today
  //     return current && current > moment().endOf('day');
  // }

  return (
    <>
      <div className={styles.avatarHolder}>
        {editMode ? (
          ''
        ) : (
          <>
            {profile_picture ? (
              <img src={`data:image/png;base64,${profile_picture}`} alt="avatar" />
            ) : (
              <img alt={profile_picture || 'Default pic'} src={profile_picture || temp} />
            )}

            <div className={styles.overlay} />
            <Upload {...entityPictureUploadProps} showUploadList={false}>
              <div className={styles.button_view}>
                <Button shape="round" icon={<CameraOutlined />} />
              </div>
            </Upload>
          </>
        )}

        {editMode ? (
          <Form initialValues={candidate_processed} onFinish={handleUpdate}>
            <Form.Item name={['first_name']} label="First Name">
              <Input />
            </Form.Item>

            <Form.Item name={['last_name']} label="Last Name">
              <Input />
            </Form.Item>

            <Form.Item label="Location">
              {user_location
                ? user_location.adminArea5
                    .concat(', ')
                    .concat(user_location.adminArea3)
                    .concat(', ')
                    .concat(user_location.adminArea1)
                : 'Location not set'}{' '}
              {suffix}
            </Form.Item>

            {/* <Form.Item name={['user_dob']} label="Date of Birth">
                        <DatePicker format={dateFormat} disabledDate={disabledDate} />
                    </Form.Item> */}

            <Form.Item name={['portfolio_link']} label="Portfolio">
              <Input type="url" />
            </Form.Item>

            <Form.Item name={['behance_link']} label="Behance">
              <Input type="url" />
            </Form.Item>

            <Form.Item name={['linkedin_link']} label="Linkedin">
              <Input type="url" />
            </Form.Item>

            <Form.Item name={['dribble_link']} label="Dribbble">
              <Input type="url" />
            </Form.Item>

            <Form.Item name={['user_summary']} label="Summary">
              <Input.TextArea maxLength={200} showCount={true} />
            </Form.Item>

            <Form.Item
              name={['user_title']}
              label="Title"
              rules={[
                {
                  required: true,
                  message: 'Please select title!',
                },
              ]}>
               <Select
                  // style={{ width: 200 }}
                  // onChange={onChange}
                  // disabled={saving}
                >
                  {Object.keys(titleTypes).map((k) => (
                    <Option key={k}>{titleTypes[k]}</Option>
                  ))}
                </Select>
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <>
            <div className={styles.name}>{first_name.concat(' ').concat(last_name)}</div>
          </>
        )}

        {editMode ? (
          ''
        ) : (
          <Space style={{ marginTop: '5%' }} size="large">
            {behance_link ? (
              <a href={entity.user_external_links.behance_link} target='_blank'>
                <BehanceCircleFilled style={{ fontSize: '2.3em', color: '#000' }} />
              </a>
            ) : (
              <BehanceCircleFilled style={{ fontSize: '2.3em' }} />
            )}

            {linkedin_link ? (
              <a href={entity.user_external_links.linkedin_link} target='_blank'>
                <LinkedinFilled style={{ fontSize: '2.3em', color: '#0072b1' }} />
              </a>
            ) : (
              <LinkedinFilled style={{ fontSize: '2.3em' }} />
            )}

            {dribble_link ? (
              <a href={entity.user_external_links.dribble_link} target='_blank'>
                <DribbbleCircleFilled style={{ fontSize: '2.3em', color: '#ea4c89' }} />
              </a>
            ) : (
              <DribbbleCircleFilled style={{ fontSize: '2.3em' }} />
            )}
          </Space>
        )}
      </div>

      <div className={styles.detail}>
        <div className={styles.supplement}>
          {editMode ? (
            ''
          ) : (
            <>
              <EnvironmentOutlined
                style={{
                  marginRight: 8,
                }}
              />
              {entity && user_location ? (
                user_location.adminArea5
                  .concat(', ')
                  .concat(user_location.adminArea3)
                  .concat(', ')
                  .concat(user_location.adminArea1)
              ) : (
                <Text strong>Location not set</Text>
              )}
            </>
          )}
        </div>

        <div className={styles.supplement}>
          {editMode ? (
            ''
          ) : (
            <>
              <AppstoreOutlined
                style={{
                  marginRight: 8,
                }}
              />
              {portfolio_link ? (
                <a
                  style={{ color: '#FF7A40' }}
                  target="_blank"
                  rel="noreferrer"
                  href={portfolio_link}
                >
                  {extractHostname(portfolio_link)}
                </a>
              ) : (
                <Text strong>No portfolio url set</Text>
              )}
            </>
          )}
        </div>

        <div className={styles.supplement}>{editMode ? '' : user_summary}</div>
        
        <div className={styles.supplement}>{editMode ? '' : titleTypes[user_title]}</div>
      </div>
    </>
  );
}

export default BasicDetails;
