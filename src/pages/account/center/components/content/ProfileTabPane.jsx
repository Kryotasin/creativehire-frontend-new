import React, { useState, useEffect, Suspense } from 'react';
import { Card, Skeleton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'umi';

const Projects = React.lazy(() => import('./Projects'));
const Applications = React.lazy(() => import('./Applications'));
const Profile = React.lazy(() => import('./Profile'));
const Settings = React.lazy(() => import('./Settings'));

import { getPageQuery } from '../../../../../utils/utils';

import { history } from 'umi';

import styles from '../../Center.less';


const ProfileTabPane = (props) => {

  const { userID, projectList, match } = props;

  useEffect(() =>{

  }, [projectList]);

  const operationTabList = [
    {
      key: 'profile',
      tab: (
        <span>
          Profile{' '}
          <span
            style={{
              fontSize: 14,
            }}
          >
            {/* (8) */}
          </span>
        </span>
      ),
    },
    {
      key: 'portfolio',
      tab: (
        <span>
          Portfolio{' '}
          <span
            style={{
              fontSize: 14,
            }}
          > 
            {projectList ? `(${Object.keys(projectList).length})` : '()'}
          </span>
        </span>
      ),
    },
    {
      key: 'appliedjobs',
      tab: (
        <span>
          Applied Jobs{' '}
          <span
            style={{
              fontSize: 14,
            }}
          >
            {/* (8) */}
          </span>
        </span>
      ),
    },  
    {
      key: 'settings',
      tab: (
        <span>
          Settings{' '}
          <span
            style={{
              fontSize: 14,
            }}
          >
            {/* (8) */}
          </span>
        </span>
      ),
    },
  ];
  

  const [tabKey, setTabKey] = useState('profile');

  const renderChildrenByTabKey = () => {
    if (tabKey === 'profile') {
      return <Profile userID={userID} />;
    }

    if (tabKey === 'portfolio') {
      return (
        // <Space size="large" direction="vertical">
        <>
          <div  className={styles.addnew}>
            <Link to="/portfolio/new">
              <PlusOutlined /> Add New{' '}
            </Link>
          </div>
          <Projects userID={userID} />
        {/* </Space> */}
        </>
      );
    }

    if (tabKey === 'appliedjobs') {
      return <Applications userID={userID} />;
    }

    if (tabKey === 'settings') {
      return <Settings userID={userID} />;
    }

    return null;
  };

  const onTabChange = (key) => {
    // If you need to sync state to url
    // const { match } = this.props;
    history.replace(`center?tab=${key}`);
    setTabKey(key);
  };

  useEffect(() => {
    
    const {tab} = getPageQuery();
    if(tab !== undefined){
      setTabKey(tab);
    }
    // const path = match && match.path;
    // const urlTabKey = location.pathname.replace(`${path}/`, '');
    // if (urlTabKey && urlTabKey !== '/' && tabKey !== urlTabKey) {
    //   return {
    //     tabKey: urlTabKey,
    //   };
    // }
    // return null;
  });

  return (
    <Suspense fallback={<Skeleton />}>
      <Card
        className={styles.tabsCard}
        bordered={false}
        tabList={operationTabList}
        activeTabKey={tabKey}
        onTabChange={onTabChange}
      >
        {renderChildrenByTabKey()}
      </Card>
    </Suspense>
  );
};

export default ProfileTabPane;
