import React, { useState, useEffect } from 'react';
import { Card, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link } from 'umi';

import Projects from './Projects';
import Articles from './SavedJobs';
import Applications from './Applications';
import Profile from './Profile';

import styles from '../../Center.less';
import SavedJobs from './SavedJobs';

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
];

const ProfileTabPane = ({ projectList }) => {
  const [tabKey, setTabKey] = useState('profile');

  const renderChildrenByTabKey = () => {
    if (tabKey === 'profile') {
      return <Profile />;
    }

    if (tabKey === 'portfolio') {
      return (
        // <Space size="large" direction="vertical">
        <>
          <Link to="/portfolio/new">
            <PlusOutlined /> Add New{' '}
          </Link>
          <Projects />
        {/* </Space> */}
        </>
      );
    }

    if (tabKey === 'savedjobs') {
      return <SavedJobs />;
    }

    if (tabKey === 'appliedjobs') {
      return <Applications />;
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
      hoverable={true}
    >
      {renderChildrenByTabKey(tabKey)}
    </Card>
  );
};

export default ProfileTabPane;
