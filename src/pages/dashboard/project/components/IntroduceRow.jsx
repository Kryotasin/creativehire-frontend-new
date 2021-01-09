import {
  EditOutlined,
  InfoCircleOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { Col, Row, Tooltip, Space, Card, Button, Modal, Form, Input, Skeleton, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from '../../../../umiRequestConfig';

const { TextArea } = Input;

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 19,
  },
};

const extractHostname = (url) => {
  let hostname;

  // find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }

  // find & remove port number
  hostname = hostname.split(':')[0];

  // find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
};

const IntroduceRow = (props) => {
  const [form] = Form.useForm();

  const { validateFields } = form;

  const { project, userID } = props;

  const [projectData, setProjectData] = useState(undefined);
  const [imgCounter, setImgCount] = useState(0);
  const [img_list, setImgList] = useState(undefined);

  const [modalData, setModalData] = useState(undefined);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalDataLoaded, setModalDataLoaded] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if (projectData === undefined && Object.keys(project).length !== 0) {
      setProjectData(project);
    }
  }, [project]);

  useEffect(() => {
    if (modalData !== undefined) {
      setModalDataLoaded(true);
    }
  }, [modalData]);

  // useEffect(() => {
  //   if(isModalVisible === false && modalData !== undefined){
  //     setModalData(undefined);
  //   }
  // }, [isModalVisible]);

  const onValidateForm = async () => {
    setConfirmLoading(true);
    const values = await validateFields();

    const final_values = {
      ...values,
      projectImage: img_list[imgCounter + 1],
      ...props.link,
      projectAuthor: userID,
    };

    axios
      .post(REACT_APP_AXIOS_API_V1.concat('project-detail-update/'), {
        id: projectData.id,
        project_title: final_values.projectName,
        project_summary: final_values.projectSummary,
        project_img: final_values.pastedProjectImage
          ? final_values.pastedProjectImage
          : final_values.projectImage,
      })
      .then((res) => {

        if (res.status === 200) {
          setProjectData(res.data);

          setConfirmLoading(false);
          setModalDataLoaded(false);
          setModalVisible(false);
        }
      });
  };

  return (
    <>
      <Row gutter={[16, 32]} type="flex">
        <Col xs={{ span: 24 }} lg={{ span: 22, offset: 2 }}>
          {projectData !== undefined ? (
            <Card
              bordered={false}
              // loading={loading}
              title="Cover Image"
              extra={
                <Tooltip title="Edit project details">
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => {
                      setModalVisible(true);

                      console.log(projectData.project_url);
                      axios
                        .post(REACT_APP_AXIOS_API_V1.concat('project/basicdetails/'), {
                          url: projectData.project_url,
                          img_only: 1,
                        })
                        .then((res) => {
                          const finalData = {
                            ...res.data,
                            pastedProjectImage: res.data.img_list.includes(projectData.project_img)
                              ? ''
                              : projectData.project_img,
                          };
                          setModalData(finalData);
                          setImgList(res.data.img_list);
                        });
                    }}
                  />
                </Tooltip>
              }
            >
              <Row>
                <Col xs={{ span: 24 }} lg={{ span: 4, offset: 0 }}>
                  <img
                    alt={projectData.project_title}
                    src={projectData.project_img}
                    style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto' }}
                  />
                </Col>

                <Col xs={{ span: 24 }} lg={{ span: 10, offset: 6 }}>
                  <Space size="middle" direction="vertical">
                    <Space size="large" direction="horizontal">
                      <div>Project Title:</div>
                      <div>{projectData.project_title}</div>
                    </Space>
                    <Space size="large" direction="horizontal">
                      <div>Project Link:</div>
                      <div>
                        <a
                          style={{ color: '#FF7A40' }}
                          target="_blank"
                          rel="noreferrer"
                          href={projectData.project_url}
                        >
                          {extractHostname(projectData.project_url)}
                        </a>
                      </div>
                    </Space>
                    <Space size="large" direction="horizontal">
                      <div>Project Summary:</div>
                      <div>{projectData.project_summary}</div>
                    </Space>
                  </Space>
                </Col>
              </Row>
            </Card>
          ) : (
            <Spin />
          )}
        </Col>
      </Row>

      <Modal
        okText="Save"
        title="Edit project details"
        visible={isModalVisible}
        destroyOnClose="true"
        onOk={onValidateForm}
        onCancel={() => {
          setModalVisible(false);
        }}
        style={{ top: 100 }}
        width="80%"
        confirmLoading={confirmLoading}
      >
        {modalDataLoaded ? (
          <Form
            {...formItemLayout}
            form={form}
            layout="horizontal"
            // className={styles.stepForm}
            initialValues={{
              projectName: projectData.project_title,
              projectSummary: projectData.project_summary,
              pastedProjectImage: modalData.pastedProjectImage,
            }}
          >
            <Row gutter={[16, 32]} type="flex">
              <Col xs={{ span: 24 }} lg={{ span: 8, offset: 2 }}>
                <Form.Item
                  label="Project Cover Image"
                  // name="projectImage"
                >
                  <Space direction="vertical" size="middle">
                    <img
                      src={modalData.img_list[imgCounter + 1]}
                      width="320"
                      alt={projectData.project_title.concat(' image')}
                    />
                    <Space direction="horizontal" size="small">
                      <Button
                        disabled={imgCounter === 0}
                        onClick={() => {
                          setImgCount(imgCounter - 1);
                        }}
                      >
                        <ArrowLeftOutlined /> Previous image
                      </Button>
                      <Button
                        disabled={imgCounter === modalData.img_list.length}
                        onClick={() => {
                          setImgCount(imgCounter + 1);
                        }}
                      >
                        Next image <ArrowRightOutlined />
                      </Button>
                    </Space>
                    <>Or</>
                  </Space>
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
                  <Space direction="horizontal" size="small">
                    <Input placeholder="Custom url" />
                    <Tooltip title="We currently do not support uploading images for projects.">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                </Form.Item>

                {modalData.pastedProjectImage ? (
                  <Form.Item label="Currently using">
                    <a
                      style={{ color: '#FF7A40' }}
                      target="_blank"
                      rel="noreferrer"
                      href={modalData.pastedProjectImage}
                    >
                      {modalData.pastedProjectImage}
                    </a>
                  </Form.Item>
                ) : (
                  ''
                )}
              </Col>

              <Col xs={{ span: 24 }} lg={{ span: 12, offset: 0 }}>
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
              </Col>
            </Row>
          </Form>
        ) : (
          <Skeleton active />
        )}
      </Modal>
    </>
  );
};

export default IntroduceRow;
