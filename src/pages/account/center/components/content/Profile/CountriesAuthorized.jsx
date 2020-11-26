import { List, Card, Pagination  } from 'antd';
import React, { useEffect } from 'react';
import { connect, Link } from 'umi';
// import moment from 'moment';
// import AvatarList from '../AvatarList';
import styles from './index.less';

const CountriesAuthorized = props => {
  const { currentUser } = props;

  useEffect(() => {
    // console.log(projectList)
  })

  return (
    <div className="parts">
      <div className={styles.name}>
        Test
      </div>
      <p>Test</p>
    </div>
  );
};

export default connect(({ accountAndcenter }) => ({
  currentUser: accountAndcenter.currentUser,
}))(CountriesAuthorized);
