import { UploadOutlined } from '@ant-design/icons';
import { Alert, Skeleton, Button, Input, Select, Upload, Form, message } from 'antd';
import { connect, Link, Helmet } from 'umi';
import React, { Component } from 'react';
import styles from './BaseView.less';
import axios from '../../../../umiRequestConfig';
import logo from '../../../../assets/default.png';

const { Option } = Select; // The avatar component is convenient for future independence, and adds functions such as cropping


class BaseView extends Component {
  view = undefined;

  email_verified = false;

  constructor(props){
    super(props);
    this.state = {
      img: undefined
    }
  }


  componentDidMount(){
    axios.get(REACT_APP_AXIOS_API_V1.concat('entities/').concat('email-verified/').concat(JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id))
    .then(res => {

      if(res.data === 'True'){
        this.email_verified = true;
      }
      if(res.data === 'False'){
        this.email_verified = false;
      }
    })
    .catch(err => {
      this.email_verified = false;
    })

  }

  
  getViewDom = (ref) => {
    this.view = ref;
  };

  handleFinish = (values) => {
    axios.put('entities/update-personal-details/'.concat(localStorage.getItem('userID')),{
      first_name: values.first_name,
      last_name: values.last_name,
      location: values.location
    })
    .then(res => {    

        setTimeout(() => message.success('Profile updated successfully!'), 100);
    })
    .catch(err => {
        message.error(`Your profile could not be updated due to `.concat(err.message));
    })
  };



  render() {
    const{ currentUser } = this.props
    
console.log(currentUser)
    const typeOfImage = (proc) => {
      return {"type" : "profile_pic", "process": proc, "fileName": currentUser['user_img_salt']}
    }

    const reloadProfilePicture = () => {
      axios.post('api/v1/file-handler/', {
          ...typeOfImage('fetch')
      })
      .then(
          res => {
            let output;
            if(res.status === 404){
                // Set something to show lack of profile picture.
                setTimeout(() => message.error('Profile picture not found.'), 100);
            }
            else if (res.status === 200 && res.data !== 'ErrorResponseMetadata'){
                this.setState({
                  img: res.data
                });
            }
            
            else if(res.status === 200 && res.data === 'ErrorResponseMetadata'){
              // Set something to show lack of profile picture.
              setTimeout(() => message.error('Profile picture not found.'), 100);
          }      
  
         
      })
    }

    const entityPictureUploadProps = {
      name: 'file',
      acceptedFiles: '.png',
      multiple: false,
      method: 'post',
      data: typeOfImage("upload"),
      action: 'https://api.creativehire.co/file-handler/',
      onRemove(file){
          axios.post('file-handler/', {
              "file": file.name,
              ...typeOfImage('remove')
          });
      },
      
      onChange(info) {
        const { status } = info.file;

        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
          reloadProfilePicture();
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`.concat(info));
        }
      },
    };



    const AvatarView = () => (
      <>
        <div className={styles.avatar_title}>Avatar</div>
        <div className={styles.avatar}>
          {
            this.state.img ?
            <img src={`data:image/png;base64,${this.state.img}`} alt="avatar" />
            :
            <img src={logo} alt="avatar" />
          }
        </div>
        <Upload {...entityPictureUploadProps} showUploadList={false}>
          <div className={styles.button_view}>
            <Button>
              <UploadOutlined />
                Change
            </Button>
          </div>
        </Upload>
      </>
    );

    
    if(this.state.img === undefined){
      reloadProfilePicture();
    }
      
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Profile</title>
        </Helmet>
        <div className={styles.left}>
          {currentUser.email ?
          <Form
            layout="vertical"
            onFinish={this.handleFinish}
            initialValues={currentUser}
            hideRequiredMark
          >

            
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  type: 'email',
                  message: 'Please enter a valid email!',
                },
                {
                  required: true,
                  message: 'Please enter your email!',
                },
              ]}
            >
              <Input disabled placeholder={currentUser ? currentUser.email : 'No email set'}/> 
            </Form.Item>
            <Alert message= {this.email_verified ? "Email verified!" : <Link to='/user/confirm-email'>Click here to verify email</Link>} type={this.email_verified ? "success" : "error"} showIcon />

            <Form.Item
              name="first_name"
              label="First Name"
              rules={[
                {
                  required: true,
                  message: 'Please enter your first name!',
                },
              ]}
            >
              <Input placeholder={currentUser.first_name !== null ? currentUser.first_name : 'No first name set'}/>
            </Form.Item>

            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[
                {
                  required: true,
                  message: 'Please enter your last name!',
                },
              ]}
            >
              <Input placeholder={currentUser.last_name !== null ? currentUser.last_name : 'No first name set'}/>
            </Form.Item>


            <Form.Item
              name="location"
              label="Location"
              rules={[
                {
                  required: true,
                  message: 'Please enter a location!',
                },
              ]}
            >
              <Input placeholder={currentUser.location !== null ? currentUser.location : 'No location set'}/>
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="primary">
                Update info
              </Button>
            </Form.Item>
          </Form>
          :
          <Skeleton active />
        }
        </div>
        <div className={styles.right}>
            <AvatarView imgSrc={this.state.img} />
        </div>
      </div>
    );
  }
}

export default connect(({ accountAndsettings }) => ({
  currentUser: accountAndsettings.currentUser,
}))(BaseView);
