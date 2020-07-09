import { List, Radio, Typography, Select, Space, Modal, Divider, Button, Form,  } from 'antd';
import React, { Component, Fragment } from 'react';
import { connect } from 'umi';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const { Option } = Select;


class NotificationView extends Component {

  constructor(props){
    super(props);
    this.state = {
      currentUser: this.props.currentUser,
    }
  }



  render() {
    return (
      <Fragment>
      <Space direction="vertical" size="middle">
      
        <Title level={4}>Work Authorization</Title>
        <Select defaultValue={this.state.currentUser.work_authorization} style={{ width: 120 }} onChange={(value) => {
          console.log(value)
          }}>
          <Option value="0">US Citizen</Option>
          <Option value="1">Green Card</Option>
          <Option value="2">H1B</Option>
          <Option value="3">H4</Option>
          <Option value="4">OPT - EAD</Option>
          <Option value="5">OPT - STEM</Option>
          <Option value="6">F1</Option>
          <Option value="7">F2</Option>
          <Option value="8">L1</Option>
          <Option value="9">None</Option>
        </Select>



        <Title level={4}>Remote employment?</Title>
        <Radio.Group name="radiogroup" defaultValue={this.state.currentUser.remote_work ? 1 : 2}>
          <Radio value={1}>Open to remote jobs</Radio>
          <Radio value={2}>No remote jobs</Radio>
        </Radio.Group>

       

        <Divider />
        <Title level={4}>Employment History</Title>
        <Text strong>Total experience: {
          this.state.currentUser.yoe
        }</Text>
          {
            this.state.currentUser.work_exp !== null ?
              <List
                itemLayout="horizontal"
                dataSource={this.state.currentUser.work_exp}
                renderItem={(item) => (
                  <List.Item actions={item.actions}>
                    <List.Item.Meta title={item.title} description={item.description} />
                  </List.Item>
                )}
              />
            :
            <Button type="text" icon={<PlusOutlined />} size='small' onClick={this.showWorkExpModal}>
              Add new
            </Button>
          }

          <Title level={4}>References</Title>
          {
            this.state.currentUser.work_exp !== null ?
              <List
                itemLayout="horizontal"
                dataSource={this.state.currentUser.work_exp}
                renderItem={(item) => (
                  <List.Item actions={item.actions}>
                    <List.Item.Meta title={item.title} description={item.description} />
                  </List.Item>
                )}
              />
            :
            <Button type="text" icon={<PlusOutlined />} size='small'>
              Add new
            </Button>
          }

        
        <Divider />
        <Title level={4}>Education History</Title>
          {
            this.state.currentUser.work_exp !== null ?
              <List
                itemLayout="horizontal"
                dataSource={this.state.currentUser.work_exp}
                renderItem={(item) => (
                  <List.Item actions={item.actions}>
                    <List.Item.Meta title={item.title} description={item.description} />
                  </List.Item>
                )}
              />
            :
            <Button type="text" icon={<PlusOutlined />} size='small'>
              Add new
            </Button>
          }


        <Divider />
        <Title level={4}>Certifications & Publications</Title>
          {
            this.state.currentUser.work_exp !== null ?
              <List
                itemLayout="horizontal"
                dataSource={this.state.currentUser.work_exp}
                renderItem={(item) => (
                  <List.Item actions={item.actions}>
                    <List.Item.Meta title={item.title} description={item.description} />
                  </List.Item>
                )}
              />
            :
            <Button type="text" icon={<PlusOutlined />} size='small'>
              Add new
            </Button>
          }

          <Button type="primary" size='large'>
            Save
          </Button>

        </Space>
      </Fragment>
    );
  }
}

export default connect(({ accountAndsettings }) => ({
  currentUser: accountAndsettings.currentUser,
}))(NotificationView);