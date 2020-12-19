import { Switch, Space, Spin, message } from 'antd';
import React, { useEffect } from 'react';
import { connect, Link } from 'umi';
import styles from './index.less';
import axios from '../../../../../../umiRequestConfig';

const Remote = (props) => {
  const { dispatch, candidate_part } = props;

  useEffect(() => {
    if (Object.keys(candidate_part).length === 0) {
      const userID = JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id;
      dispatch({
        type: 'accountAndcenter/fetchCurrent',
        payload: { userID: btoa(userID) },
      });
    }
  }, [candidate_part]);

  const onChange = (checked) => {
    const data = {
      candidate_remote_work: checked,
      type: 'remote',
      userID: btoa(JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id),
    };

    dispatch({
      type: 'accountAndcenter/updateObjects',
      payload: data,
    });
  };

  return (
    <div className="parts">
      <div className={styles.name}>Remote work</div>
      <Space direction="horizontal" align="top" size="large">
        Open to remote work?
        {Object.keys(candidate_part).length !== 0 ? (
          <Switch
            size="default"
            defaultChecked={
              Object.keys(candidate_part).length !== 0
                ? candidate_part.candidate_remote_work
                : false
            }
            checkedChildren="Open"
            unCheckedChildren="Not Open"
            onChange={onChange}
            size="small"
          />
        ) : (
          <Spin />
        )}
      </Space>
    </div>
  );
};

export default connect(({ accountAndcenter }) => ({
  candidate_part: accountAndcenter.candidate_part,
}))(Remote);
