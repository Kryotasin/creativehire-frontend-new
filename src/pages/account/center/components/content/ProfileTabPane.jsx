import React, { useState, useEffect } from 'react';
import { Card, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'umi';

import Projects from './Projects';
import Articles from './SavedJobs';
import Applications from './Applications';
import Profile from './Profile';
import SavedJobs from './SavedJobs';
import Settings from './Settings';

import styles from '../../Center.less';

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
          {/* (8) */}
        </span>
      </span>
    ),
  },
  {
    key: 'savedjobs',
    tab: (
      <span>
        Saved Jobs{' '}
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

const ProfileTabPane = (props) => {

  const { userID } = props;

  const [tabKey, setTabKey] = useState('profile');

  const renderChildrenByTabKey = () => {
    if (tabKey === 'profile') {
      return <Profile userID={userID} />;
    }

    if (tabKey === 'portfolio') {
      return (
        // <Space size="large" direction="vertical">
        <>
          <Link to="/portfolio/new">
            <PlusOutlined /> Add New{' '}
          </Link>
          <Projects userID={userID} />
        {/* </Space> */}
        </>
      );
    }

    if (tabKey === 'savedjobs') {
      return <SavedJobs userID={userID} />;
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
    // router.push(`${match.url}/${key}`);
    setTabKey(key);
  };

  useEffect(() => {
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
    <Card
      className={styles.tabsCard}
      bordered={false}
      tabList={operationTabList}
      activeTabKey={tabKey}
      onTabChange={onTabChange}
    >
      {renderChildrenByTabKey()}
    </Card>
  );
};

export default ProfileTabPane;
