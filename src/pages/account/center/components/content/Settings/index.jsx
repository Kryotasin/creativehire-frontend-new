import { Button, Space, Switch, Spin, Tooltip, InputNumber } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';

import JobsList from '../../../../../homepage/components/jobslist';

import styles from '../Profile/index.less';

const Settings = (props) => {
  const { settings_part, userID, dispatch } = props;

  const [ email, setEmail ] = useState(undefined);
  const [ desktop, setDesktop ] = useState(undefined);
  const [ matchPercent, setMatchPercent ] = useState(undefined);
  const [ loaded, setLoaded ] = useState(false);


  useEffect(() => {
    if(dispatch){
        dispatch({
            type: 'accountAndcenter/fetchUserSettings',
            payload: {
                id: btoa(userID), 
                type: 'fetch'
            }
        });
    }

    return () => {
        dispatch({
            type: 'accountAndcenter/saveNewState',
            payload: {settings_part: {}}
        });
    }
    
  }, []);

  useEffect(() => {
    if(Object.keys(settings_part).length > 0){
        setEmail(settings_part.user_email_notification_setting);
        setDesktop(settings_part.user_desktop_notification_setting);
        setMatchPercent(settings_part.user_match_percent_setting);
        setLoaded(true);
    }

  }, [settings_part, userID]);

  return (
    <>
        {
            loaded ? 
            <div className="parts">
                <div className={styles.name}>Remote work</div>
                <Space direction='vertical' size='large'>
                    <Space direction="horizontal" align="top" size="large">                
                        <Tooltip title="prompt text">
                            <span>Allow email notifications</span>
                        </Tooltip>

                        <Switch checked={email} size="small" onChange={(checked) => {
                            setEmail(checked)
                        }} />
                        
                    </Space>
                    <Space direction="horizontal" align="top" size="large">                
                        <Tooltip title="prompt text">
                            <span>Allow desktop notifications</span>
                        </Tooltip>

                        <Switch checked={desktop} size="small" onChange={(checked) => {
                            setDesktop(checked)
                        }} />
                        
                    </Space>
                    <Space direction="horizontal" align="top" size="large">                
                        <Tooltip title="prompt text">
                            <span>Minimum match percent</span>
                        </Tooltip>

                        <InputNumber
                            min={1} max={100}
                            placeholder='Enter a number'
                            defaultValue={matchPercent}
                            onChange={(e) => {
                                setMatchPercent(e);
                            }}
                        />

                    </Space>

                    <Button type='primary' disabled={!loaded} onClick={() => {
                        setLoaded(false);

                        dispatch({
                            type: 'accountAndcenter/saveNewState',
                            payload: {settings_part: {}}
                        });

                        dispatch({
                            type: 'accountAndcenter/fetchUserSettings',
                            payload: {
                                type: 'update',
                                id: btoa(userID), 
                                user_email_notification_setting: email,
                                user_desktop_notification_setting: desktop,
                                user_match_percent_setting: matchPercent
                            }
                        });

                    }}>Save</Button>
                </Space>
            </div>
        :
        <Spin />
        }
    </>
  );
};

export default connect(({ accountAndcenter }) => ({
    settings_part: accountAndcenter.settings_part,
}))(Settings);
