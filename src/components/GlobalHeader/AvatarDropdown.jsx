import { LogoutOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { history, connect } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import axios from '../../umiRequestConfig';

const AvatarDropdown = (props) => {
  
  const { dispatch, currentUser, menu } = props;
  const [ avatarSrc, setAvatarSrc ] = useState(undefined);

  useEffect(() => {
  }, [currentUser]);

  const onMenuClick = (event) => {
    const { key } = event;

    if (key === 'logout') {
      
      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }

      return;
    }

    history.push(`/account/${key}`);
  };

    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <UserOutlined />
            My Account
          </Menu.Item>
        )}
        {/* {menu && (
          <Menu.Item key="settings">
            <SettingOutlined />
            Account settings
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

    return (
      <>
        {
          Object.keys(currentUser).length !== 0 ? 
              <HeaderDropdown overlay={menuHeaderDropdown}>
               <span className={`${styles.action} ${styles.account}`}>
                 {/* <Avatar size="small" className={styles.avatar} src={} alt="avatar" /> */}
                 <span className={styles.name}>{currentUser.entity ? currentUser.entity.first_name.concat(' ').concat(currentUser.entity.last_name) : ''}</span>
               </span>
              </HeaderDropdown>
          : 
          <span className={`${styles.action} ${styles.account}`}>
            <Spin
              size="small"
              style={{
                marginLeft: 8,
                marginRight: 8,
              }}
            />
          </span>
        }
      </>
    );
    
    // this.state.userObj  ? (
    //   <HeaderDropdown overlay={menuHeaderDropdown}>
    //     <span className={`${styles.action} ${styles.account}`}>
    //       {/* <Avatar size="small" className={styles.avatar} src={} alt="avatar" /> */}{console.log(this.state.userObj)}
    //       <span className={styles.name}>{this.state.userObj.entity ? this.state.userObj.entity.first_name.concat(' ').concat(this.state.userObj.entity.last_name) : ''}</span>
    //     </span>
    //   </HeaderDropdown>
    // ) : (
    //   <span className={`${styles.action} ${styles.account}`}>
    //     <Spin
    //       size="small"
    //       style={{
    //         marginLeft: 8,
    //         marginRight: 8,
    //       }}
    //     />
    //   </span>
    // );
  

}

export default connect(({ user, accountAndcenter }) => ({
  // currentUser: user.currentUser,
  currentUser: accountAndcenter.currentUser,
}))(AvatarDropdown);

