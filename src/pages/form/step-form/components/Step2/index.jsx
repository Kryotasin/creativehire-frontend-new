import React, { useState } from 'react';
import { Spin, Form, Button, Tooltip, Divider, Statistic, Input, Typography, Space } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined, InfoCircleOutlined } from '@ant-design/icons';

import { connect } from 'umi';
import styles from './index.less';
import asyncLocalStorage from '../../../../../asyncLocalStorage';
import jwt_decode from 'jwt-decode';

const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 19,
  },
};

const Step2 = (props) => {
  const [form] = Form.useForm();
  const { data, dispatch, submitting } = props;
  const [img_counter, setImgCount] = useState(0);

  if (!data) {
    return <Spin />;
  }

  const { validateFields } = form;

  const onPrev = () => {
    if (dispatch) {
      dispatch({
        type: 'formAndstepForm/saveCurrentStep',
        payload: 'link',
      });
    }
  };

  const { title, description, img_list } = data;

  const onValidateForm = async () => {
    const values = await validateFields();
    let userID = await asyncLocalStorage.getItem('accessToken');
    userID = JSON.parse(JSON.stringify(jwt_decode(userID))).user_id;

    // if(values.pastedProjectImage){
    const imageLink = values.pastedProjectImage || img_list[img_counter];
    // }
    // else{
    //   console.log('nos')
    // }

    const final_values = {
      ...values,
      projectImage: imageLink,
      ...props.link,
      projectAuthor: userID,
    };

    if (dispatch) {
      dispatch({
        type: 'formAndstepForm/submitNewProject',
        payload: { ...final_values },
      });
    }
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        layout="horizontal"
        className={styles.stepForm}
        initialValues={{
          projectName: title,
          projectSummary: description,
        }}
      >
        <Divider
          style={{
            margin: '24px 0',
          }}
        />

        <Form.Item
          label="Project Name"
          name="projectName"
          rules={[
            {
              required: true,
              message: 'Please enter project name',
            },
          ]}
        >
          <Input placeholder="Project name" />
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label="Project Summary"
          name="projectSummary"
          rules={[
            {
              required: true,
              message: 'Please enter the project summary',
            },
          ]}
        >
          <TextArea
            style={{
              minHeight: 32,
            }}
            placeholder="Write a few lines about the project"
            rows={4}
            maxLength={500}
            showCount={true}
          />
        </Form.Item>

        <Form.Item label="Project Cover Image" name="projectImage">
          {img_list === undefined || Object.keys(img_list).length === 0 ? (
            <>
              <Typography.Text mark>
                No images found. Please paste a link below. We currently do not support uploading
                images for projects
              </Typography.Text>
            </>
          ) : (
            <Space direction="vertical" size="middle">
              <img src={img_list[img_counter]} width="320"  alt={title.concat(' image')} />
              <Space direction="horizontal" size="small">
                <Button
                  disabled={img_counter === 0}
                  onClick={() => {
                    setImgCount(img_counter - 1);
                  }}
                >
                  <ArrowLeftOutlined /> Previous image
                </Button>
                <Button
                  disabled={img_counter === img_list.length}
                  onClick={() => {
                    setImgCount(img_counter + 1);
                  }}
                >
                  Next image <ArrowRightOutlined />
                </Button>
              </Space>
              <>Or</>
            </Space>
          )}
        </Form.Item>

        <Form.Item
          label="Paste Image URL"
          name="pastedProjectImage"
          rules={[
            {
              type: 'url',
            },
          ]}
        >
          <Space direction="horizontal" size="large">
            <Input placeholder="Paste cover image url" />
            <Tooltip title="We currently do not support uploading images for projects.">
              <InfoCircleOutlined />
            </Tooltip>
          </Space>
        </Form.Item>

        <Form.Item
          style={{
            marginBottom: 8,
          }}
          wrapperCol={{
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: formItemLayout.wrapperCol.span,
              offset: formItemLayout.labelCol.span,
            },
          }}
        >
          <Button
            onClick={onPrev}
            style={{
              marginLeft: 8,
            }}
          >
            Previous
          </Button>
          <Button type="primary" onClick={onValidateForm} loading={props.loading}>
            Next
          </Button>
        </Form.Item>
      </Form>

      <Divider
        style={{
          margin: '40px 0 24px',
        }}
      />
      <div className={styles.desc}>
        <h3>Help</h3>
        <h4>What is Project Image?</h4>
        <p>
          Project images are images we could retrieve from the link you provided. Pick any you like.
        </p>
        <p>
          <Typography.Text strong>Note: </Typography.Text>The images are fetched directly from the
          original source.
        </p>
      </div>
    </>
  );
};

export default connect(({ formAndstepForm }) => ({
  loading: formAndstepForm.loading,
  data: formAndstepForm.basics,
  link: formAndstepForm.link,
}))(Step2);
