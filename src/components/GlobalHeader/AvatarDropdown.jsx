import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React from 'react';
import { history, connect } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import axios from '../../umiRequestConfig';

class AvatarDropdown extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      avatarSrc : undefined
    };
  }

  onMenuClick = event => {
    const { key } = event;

    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }

    history.push(`/account/${key}`);
  };

  render() {
    const {
      currentUser = {
        avatar: '',
        first_name: '',
        last_name: '',
      },
      menu,
    } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="settings">
            <UserOutlined />
            My Account
          </Menu.Item>
        )}
        {/* {menu && (
          <Menu.Item key="settings">
            <SettingOutlined />
            Personal settings
          </Menu.Item>
        )} */}
        {menu && <Menu.Divider />}

        <Menu.Item key="logout">
          <LogoutOutlined />
          Logout
        </Menu.Item>
      </Menu>
    );
    
    // const typeOfImage = (proc) => {
    //   return {"type" : "profile_pic", "process": proc, "fileName": currentUser.img_salt}
    // }

    // const getPic = () => {
    //   axios.post('file-handler/', {
    //     ...typeOfImage('fetch')
    // })
    // .then(res =>{
    //   console.log(res.data);
    //   this.setState({
    //     avatarSrc: res.data
    //   });
    // })
    // }

    return currentUser  ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          {/* <Avatar size="small" className={styles.avatar} src={} alt="avatar" /> */}
          <span className={styles.name}>{currentUser.first_name && currentUser.last_name ? currentUser.first_name.concat(' ').concat(currentUser.last_name) : 'Doe'}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(AvatarDropdown);

