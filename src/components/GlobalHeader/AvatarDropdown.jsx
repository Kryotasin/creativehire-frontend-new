import { LogoutOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { history, connect } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import asyncLocalStorage from '../../asyncLocalStorage';
import jwt_decode from 'jwt-decode';
import temp from '../../assets/anony.png';

const AvatarDropdown = (props) => {
  
  const { dispatch, entity_part, menu, profile_picture } = props;
  const [ avatarSrc, setAvatarSrc ] = useState(undefined);

    //----------------------------------------USER ID HANDLING--------------------------------------------------------------------

    // useEffect(() => {  
    //   if(Object.keys(entity_part).length === 0){
    //     asyncLocalStorage.getItem('accessToken')
    //     .then((token) => {console.log('avater', token)
    //       token = JSON.parse(JSON.stringify(jwt_decode(token)));
    //       dispatch({
    //         type: 'accountAndcenter/fetchCurrent',
    //         payload: { userID: btoa(token.user_id) },
    //       });
    //     })
    //   }
    // }, []);
  
    //------------------------------------------------------------------------------------------------------------

    useEffect(() => {

      if(profile_picture === undefined && Object.keys(entity_part).length > 0 ){
        asyncLocalStorage.getItem('accessToken')
        .then((token) => {
          try{
            dispatch({
              type: 'accountAndcenter/fetchProfilePicture',
              payload: entity_part.user_img_salt
            });
          }
          catch(e){
            console.log(e);
          }
          
        });
      }
    }, [entity_part]);

  useEffect(() => {
  }, [profile_picture]);

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

    return (
      <>
        {
          Object.keys(entity_part).length !== 0 ? 
              <HeaderDropdown overlay={menuHeaderDropdown}>
               <span className={`${styles.action} ${styles.account}`}>
                 {
                   profile_picture === undefined ? 
                   <Avatar size="small" className={styles.avatar} src={temp} alt="avatar" />
                   :
                   <Avatar size="small" className={styles.avatar} src={`data:image/png;base64,${profile_picture}`} alt="avatar" />
                 }
                 
                 <span className={styles.name}>{entity_part ? entity_part.first_name.concat(' ').concat(entity_part.last_name) : ''}</span>
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
  entity_part: accountAndcenter.entity_part,
  profile_picture: accountAndcenter.profile_picture,
}))(AvatarDropdown);

