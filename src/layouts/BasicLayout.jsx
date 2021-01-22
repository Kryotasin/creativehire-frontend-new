/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import React, { useEffect } from 'react';
import ProLayout, { DefaultFooter, SettingDrawer } from '@ant-design/pro-layout';
import { Link, useIntl, connect } from 'umi';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getAuthorityFromRouter } from '@/utils/utils';
import jwt_decode from 'jwt-decode';
import logo from '../assets/new-blue-logo.svg';
import styles from './BasicLayout.less';
import asyncLocalStorage from '../asyncLocalStorage';

import { messageTokenRunner  } from '../firestore';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList) =>
  menuList.map((item) => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null);
  });

const defaultFooterDom = (
  <DefaultFooter
    copyright="2020 CreativeHire"
    links={[
      {
        key: 'terms',
        title: 'Terms',
        href: 'https://creativehire.co/misc/terms',
        blankTarget: true,
      },
      {
        key: 'privacy',
        title: 'Privacy Policy',
        href: 'https://creativehire.co/misc/privacy',
        blankTarget: true,
      },
      {
        key: 'contact',
        title: 'Contact Us',
        href: 'https://creativehire.co/misc/contact',
        blankTarget: true,
      },
    ]}
  />
);

const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/home',
    },
  } = props;
  /**
   * constructor
   */

   useEffect(() => {
     // Firebase messaging service
     messageTokenRunner();

   }, []);

  useEffect(() => {
    if (localStorage.getItem('refreshToken')) {
      try {
        if (
          jwt_decode(localStorage.getItem('refreshToken')).exp - new Date().getTime() / 1000 < 0 &&
          dispatch
        ) {
          dispatch({
            type: 'login/logout',
          });
        }
      } catch (err) {
        dispatch({
          type: 'login/logout',
        });
      }
    } else {
      dispatch({
        type: 'login/logout',
      });
    }

    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/home') || {
    authority: undefined,
  };
  const {} = useIntl();

  return (
    <>
      <ProLayout
        logo={logo}
        menuHeaderRender={(logoDom, titleDom) => (
          <Link to="/home">
            {logoDom}
            {/* {titleDom} */}
          </Link>
        )}
        onCollapse={handleMenuCollapse}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
            return defaultDom;
          }

          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        // breadcrumbRender={(routers = []) => [
        //   {
        //     path: '',
        //     breadcrumbName: 'Home',
        //   },
        //   ...routers,
        // ]}
        // itemRender={(route, params, routes, paths) => {
        //   const first = routes.indexOf(route) === 0;
        //   return first ? (
        //     <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        //   ) : (
        //     <span>{route.breadcrumbName}</span>
        //   );
        // }}
        footerRender={() => defaultFooterDom}
        menuDataRender={menuDataRender}
        rightContentRender={() => <RightContent />}
        {...props}
        {...settings}
      >
        <Authorized authority={authorized.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </ProLayout>
      {/* <SettingDrawer
        settings={settings}
        onSettingChange={(config) =>
          dispatch({
            type: 'settings/changeSetting',
            payload: config,
          })
        }
      /> */}
      
    </>
  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
