import { UploadOutlined } from '@ant-design/icons';
import { Skeleton, Button, Input, Select, Upload, Form, message } from 'antd';
import { connect } from 'umi';
import React, { Component } from 'react';
import styles from './BaseView.less';

const { Option } = Select; // The avatar component is convenient for future independence, and adds functions such as cropping

const AvatarView = ({ avatar }) => (
  <>
    <div className={styles.avatar_title}>Avatar</div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload showUploadList={false}>
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined />
          Change
        </Button>
      </div>
    </Upload>
  </>
);


class BaseView extends Component {
  view = undefined;

  getAvatarURL() {
    const { currentUser } = this.props;

    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }

      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }

    return '';
  }

  getViewDom = (ref) => {
    this.view = ref;
  };

  handleFinish = () => {
    message.success('Successfully updated information');
  };

  render() {
    const { currentUser } = this.props;
        
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
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
              <Input disabled	= {true} />
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
              <Input />
            </Form.Item>
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
              <Input />
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
              <Input />
            </Form.Item>
            {/* <Form.Item
              name="profile"
              label="个人简介"
              rules={[
                {
                  required: true,
                  message: '请输入个人简介!',
                },
              ]}
            >
              <Input.TextArea placeholder="个人简介" rows={4} />
            </Form.Item> */}
            {/* <Form.Item
              name="country"
              label="国家/地区"
              rules={[
                {
                  required: true,
                  message: '请输入您的国家或地区!',
                },
              ]}
            >
              <Select
                style={{
                  maxWidth: 220,
                }}
              >
                <Option value="China">中国</Option>
              </Select>
            </Form.Item> */}
            {/* <Form.Item
              name="geographic"
              label="所在省市"
              rules={[
                {
                  required: true,
                  message: '请输入您的所在省市!',
                },
                {
                  validator: validatorGeographic,
                },
              ]}
            >
              <GeographicView />
            </Form.Item> */}
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
          <AvatarView avatar={this.getAvatarURL()} />
        </div>
      </div>
    );
  }
}

export default connect(({ accountAndsettings }) => ({
  currentUser: accountAndsettings.currentUser,
}))(BaseView);
