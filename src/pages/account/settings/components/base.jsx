import { UploadOutlined } from '@ant-design/icons';
import { Alert, Skeleton, Button, Input, Select, Upload, Form, message } from 'antd';
import { connect, Link, Helmet } from 'umi';
import React, { Component } from 'react';
import styles from './BaseView.less';
import axios from '../../../../umiRequestConfig';

const { Option } = Select; // The avatar component is convenient for future independence, and adds functions such as cropping


class BaseView extends Component {
  view = undefined;

  email_verified = undefined;

  constructor(props){
    super(props);
    this.state = {
      img: undefined
    }
  }


  componentDidMount(){
    axios.get('userprofile/email-verified/'.concat(localStorage.getItem('userID')))
    .then(res => {
      if(res.data){
        this.email_verified = true;
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
    axios.put('userprofile/update/'.concat(localStorage.getItem('userID')),{
      name: values.name,
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
    
    const typeOfImage = (proc) => {
      return {"type" : "profile_pic", "process": proc, "fileName": currentUser['img_salt']}
    }

    const reloadProfilePicture = () => {
      axios.post('file-handler/', {
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

    const userProfilePictureUploadProps = {
      name: 'file',
      acceptedFiles: '.png',
      multiple: false,
      method: 'post',
      data: typeOfImage("upload"),
      action: 'http://localhost:3001/file-handler/',
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
          <img src={`data:image/png;base64,${this.state.img}`} alt="avatar" />
        </div>
        <Upload {...userProfilePictureUploadProps} showUploadList={false}>
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
          {currentUser.username ?
          <Form
            layout="vertical"
            onFinish={this.handleFinish}
            initialValues={currentUser}
            hideRequiredMark
          >
            <Form.Item
              name="username"
              label="Username"
              rules={[
                {
                  required: true,
                  message: 'Please enter username!',
                },
              ]}
            >
              <Input disabled/>
            </Form.Item>
            
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
            { this.email_verified && (<Alert message= {this.email_verified ? "Email verified!" : <Link to='/user/confirm-email'>Click here to verify email</Link>} type={this.email_verified ? "success" : "error"} showIcon />)}

            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: 'Please enter your full name!',
                },
              ]}
            >
              <Input placeholder={currentUser.name !== null ? currentUser.name : 'No name set'}/>
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
            {this.state.img ?
            <AvatarView imgSrc={this.state.img} />
          :
          <Skeleton active />}
        </div>
      </div>
    );
  }
}

export default connect(({ accountAndsettings }) => ({
  currentUser: accountAndsettings.currentUser,
}))(BaseView);
