import { Space, Divider, Select, Spin, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import styles from './index.less';
import axios from '../../../../../../umiRequestConfig';

const { Option } = Select;

const WorkAuthorization = (props) => {
  const { dispatch, candidate_part, workAuthTypes, saving, userID } = props;
  const [options, setOptions] = useState([]);

  const [authorizationIndex, setAuthIndex] = useState(undefined);

  useEffect(() => {
    if (Object.keys(candidate_part).length === 0 && userID !== undefined) {
      dispatch({
        type: 'accountAndcenter/fetchCurrent',
        payload: { userID: btoa(userID) },
      });
    } else {
      setAuthIndex(candidate_part.candidate_work_authorization);
    }
  }, [candidate_part]);

  useEffect(() => {
    if (workAuthTypes.length === 0) {
      dispatch({
        type: 'accountAndcenter/fetchWorkAuthTypes',
      });
    } else {
      setOptions(workAuthTypes);
    }
  }, [workAuthTypes]);

  useEffect(() => {
  }, [authorizationIndex, options]);

  const onChange = (value) => {
    const data = {
      candidate_work_authorization: Number(value) + 1,
      type: 'work_auth',
      userID: btoa(userID),
    };

    dispatch({
      type: 'accountAndcenter/updateObjects',
      payload: data,
    });
  };

  return (
    <div className="parts">
      <Divider />
      <div className={styles.name}>Work authorization</div>
      <Space direction="horizontal" align="top" size="large">
        {
        Object.keys(options).length > 0 &&
        Object.keys(candidate_part).length > 0 &&
        authorizationIndex !== undefined ? (
          <Select
            defaultValue={options[authorizationIndex - 1]}
            style={{ width: 200 }}
            onChange={onChange}
            disabled={saving}
          >
            {/* {options.map(d => (
                
              ))} */}
            {Object.keys(options).map((d) => (
              <Option key={d}>{options[d]}</Option>
            ))}
          </Select>
        ) : (
          <Spin />
        )}
        <Spin spinning={saving} />
      </Space>
    </div>
  );
};

export default connect(({ accountAndcenter }) => ({
  candidate_part: accountAndcenter.candidate_part,
  workAuthTypes: accountAndcenter.workAuthTypes,
  saving: accountAndcenter.saving,
}))(WorkAuthorization);
