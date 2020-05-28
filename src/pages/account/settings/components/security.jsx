import React, { Component } from 'react';
import { message, Button, List } from 'antd';
import axios from '../../../../umiRequestConfig';
import { connect } from 'umi';

class SecurityView extends Component {

  user = undefined;

  getData = () => [
    {
      title: 'Password',
      description: <>An email with instructions will be sent to your email.</>,
      actions: [<Button key="Modify" onClick={() =>{
        this.sendEmail();
      }}>
        Change Password
      </Button>],
    },
  ];

  sendEmail = () => {
    axios.post('/api/v1/rest-auth/password/reset/', {
      'email': this.user.email
    })
    .then(res => {
        if(res.status === 200 || res.status === 201){
          message.success('Check your mailbox for an email from us');
        }
        else if(res.status !== 200 || res.status !== 201){
          message.error('Failed! Please contact us.');
        }
    })
  }

  render() {
    const { currentUser } = this.props;

    if(currentUser.username){
      this.user = currentUser;
    }

    const data = this.getData();
    return (
      <>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
      </>
    );
  }
}

export default connect(({ accountAndsettings }) => ({
  currentUser: accountAndsettings.currentUser,
}))(SecurityView);