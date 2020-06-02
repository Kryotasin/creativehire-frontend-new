import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, useIntl, connect } from 'umi';
import React from 'react';
// import SelectLang from '@/components/SelectLang';
import logo from '../assets/logo.png';
import styles from './UserLayout.less';

const UserLayout = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const {} = useIntl();
  // const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    // breadcrumb,
    ...props,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        {/* <div className={styles.lang}>
          <SelectLang />
        </div> */}
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/user/login">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>Creativehire</span>
              </Link>
            </div>
            <div className={styles.desc}>Evaluate the strength of your portfolio</div>
          </div>
          {children}
        </div>
        <DefaultFooter 
        copyright="2020 CreativeHire"
        links={[
          {
            key: 'terms',
            title: 'Terms',
            href: 'https://pro.ant.design',
            blankTarget: true,
          },
          {
            key: 'privacy',
            title: 'Privacy Policy',
            href: 'https://github.com/ant-design/ant-design-pro',
            blankTarget: true,
          },
          {
            key: 'contact',
            title: 'Contact Us',
            href: 'https://ant.design',
            blankTarget: true,
          },
        ]}/>
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
