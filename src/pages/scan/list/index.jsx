import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, List, Typography, Progress } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, Link } from 'umi';
import styles from './style.less';
import Gauge from '../../dashboard/analysis/components/Charts/Gauge';

const { Paragraph, Text } = Typography;

const gaugeColor = val => {
  if(val >= 0 && val < 20){
    return '#FF2600 ';
  }

  if(val >= 20 && val < 60){
    return '#FF7A40';
  }

  if(val >= 60 && val <=100){
    return '#00A037'
  }
  return '';
}


class CardList extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const userID = localStorage.getItem('userID');

    dispatch({
      type: 'listAndcardList/fetch',
      payload: { userID },
    });
  }
  

  render() {

    const parseDate = (date) => {
      const parts = date.split('-')
      const d = new Date(parts[0], parts[1], parts[2].split('T')[0]);
      return d.toDateString();
  }

    const {
      listAndcardList: { list },
      loading,
    } = this.props;
    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          All the scans you have completed
        </p>
      </div>
    );
    
    const nullData = {'pk': -1};
    

    return (
      <PageHeaderWrapper content={content} >
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{
              gutter: 24,
              lg: 3,
              md: 3,
              sm: 1,
              xs: 1,
            }}
            dataSource={[nullData, ...list]}
            renderItem={item => {
              console.log(item.pk !== -1)
              if (item && item.pk !== -1) {
                return (
                  <List.Item key={item.fields.projectid}>
                    <Link to={'/scan/item/'.concat(item.pk)}>
                      <Card
                        hoverable
                        className={styles.card}
                        cover={
                          <Gauge title="Match" height={164} color={gaugeColor((item.fields.matchpercent * 100).toFixed(2))} percent={(item.fields.matchpercent * 100).toFixed(2)} />
                        }
                      >
                        <Card.Meta
                          // avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                          title= {item.fields.jobtitle ? item.fields.org.concat(" - ").concat(item.fields.jobtitle) : "No position details"}
                          description={
                            <div>
                            <Paragraph
                              className={styles.item}
                              ellipsis={{
                                rows: 3,
                              }}
                              >
                                <Text strong>Project Name: </Text>{item.fields.project_title}
                              {/* {parseDate(item.fields.posted_date)} */}
                            </Paragraph>
                            </div>
                          }
                        />
                      </Card>
                    </Link>
                  </List.Item>
                );
              }

              return (
                <List.Item>
                  <Button type="dashed" className={styles.newButton}>
                    <PlusOutlined /> New Project
                  </Button>
                </List.Item>
              );
            }}
          />
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ listAndcardList, loading }) => ({
  listAndcardList,
  loading: loading.models.listAndcardList,
}))(CardList);
