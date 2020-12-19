import { connect } from 'umi';
import React, { useState, useEffect } from 'react';
import { Spin, Form, Button, Tooltip, Divider, Checkbox, Input, Typography, message } from 'antd';
import { ArrowRightOutlined, ArrowLeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import axios from '../../../../../umiRequestConfig';
import styles from './index.less';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 12 },
    lg: { span: 12 },
    xl: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
    md: { span: 10, offset: 2 },
    lg: { span: 10, offset: 2 },
    xl: { span: 16, offset: 2 },
  },
};

const Step2 = (props) => {
  const [form] = Form.useForm();
  const { dispatch, portfolio, project_links_list } = props;

  const [processing, setProcessing] = useState(false);
  const [total, setTotal] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [failed, setFailed] = useState(0);

  useEffect(() => {
    if (project_links_list.length === 0) {
      dispatch({
        type: 'userAndregister/setCompletion',
        payload: {
          type: 'warning',
          message: `We couldn't fetch any projects. You can add projects later from your account command center. If you face any issues, contact us at admin@creativehire.co`,
        },
      });

      dispatch({
        type: 'userAndregister/saveCurrentStep',
        payload: 'confirmation',
      });
    }
  });

  useEffect(() => {
    if (failed > 0) {
      message.warn('Oops...', 5000);

      dispatch({
        type: 'userAndregister/setCompletion',
        payload: {
          type: 'warning',
          message: `Failed to process ${failed}/${total} projects. You can add them later from your account command center. If problem persists, contact us at admin@creativehire.co`,
        },
      });

      dispatch({
        type: 'userAndregister/saveCurrentStep',
        payload: 'confirmation',
      });

      setProcessing(false);
    }

    if (completed + failed === total && total > 0) {
      message.success('Done', 5000);

      dispatch({
        type: 'userAndregister/setCompletion',
        payload: {
          type: 'success',
          message: `All ${total} projects uploaded successfully! You can add more later from your account command center. If you face any issues, contact us at admin@creativehire.co`,
        },
      });

      dispatch({
        type: 'userAndregister/saveCurrentStep',
        payload: 'confirmation',
      });

      setProcessing(false);
    }
  }, [completed, failed]);

  if (!project_links_list) {
    return <Spin />;
  }

  const { validateFields } = form;

  const onPrev = () => {
    if (dispatch) {
      dispatch({
        type: 'userAndregister/saveCurrentStep',
        payload: 'info',
      });
    }
  };

  const onValidateForm = async () => {
    setProcessing(true);
    const values = await validateFields();

    if (values.links !== undefined) {
      message.loading({
        content: 'Please wait while we create your projects. It takes a while...',
        key: 'processing',
        duration: values.links.length * 5000,
      });

      let pass = 0;
      let fail = 0;

      setTotal(values.links.length);

      Object.keys(values.links).forEach((k) => {
        setTimeout(() => {
          axios
            .post(REACT_APP_AXIOS_API_V1.concat('project/basicdetails/'), {
              url: values.links[k],
              img_only: 0,
            })

            .then((res) => {
              const img = res ? res.data.img_list[0] : null;

              axios
                .post(REACT_APP_AXIOS_API_V1.concat('project/'), {
                  project_url: values.links[k],
                  project_title: res.data.title,
                  project_summary: res.data.description,
                  project_author: JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id,
                  project_img: img,
                })
                .then((project) => {
                  if (values.links.includes(project.data.project_url) && project.status === 201) {
                    pass += 1;
                  } else {
                    fail += 1;
                  }
                  setCompleted(pass);
                  setFailed(fail);
                });
            });
        }, 4000 * k);
      });
    } else {
      message.success('Done', 5000);

      dispatch({
        type: 'userAndregister/setCompletion',
        payload: {
          type: 'success',
          message: `No projects were added. You can them later from your account command center. If you face any issues, contact us at admin@creativehire.co`,
        },
      });

      dispatch({
        type: 'userAndregister/saveCurrentStep',
        payload: 'confirmation',
      });

      setProcessing(false);
    }
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        layout="horizontal"
        className={styles.stepForm}
        size="large"
        colon={false}
      >
        <Divider
          style={{
            margin: '24px 0',
          }}
        />

        <Form.Item
          name="links"
          label="Select projects"
          tooltip={{
            title: 'Do not choose password protected projects.',
            icon: <QuestionCircleOutlined />,
          }}
        >
          <Checkbox.Group options={project_links_list} />
        </Form.Item>

        <Form.Item
          label={
            <Button
              onClick={onPrev}
              style={{
                marginLeft: 8,
              }}
            >
              Previous
            </Button>
          }
        >
          <Button type="primary" onClick={onValidateForm} loading={processing}>
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
          Project images are images we could retrieve from the link you provided. Pick 3-4. You can
          add more later.
        </p>
        <p>
          <Typography.Text strong>Note: </Typography.Text>The images are fetched directly from the
          original source. We currently do not support uploading project cover images.
        </p>
      </div>
    </>
  );
};

export default connect(({ userAndregister }) => ({
  loading: userAndregister.loading,
  portfolio: userAndregister.portfolio,
  project_links_list: userAndregister.project_links_list,
}))(Step2);
