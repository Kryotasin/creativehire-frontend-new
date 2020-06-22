/* eslint-disable prefer-destructuring */
/* eslint-disable no-return-assign */
import { Card, Col, Row, Tabs, Empty, Space, Typography } from 'antd';
import React from 'react';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import Gauge from './Charts/Gauge';


const { TabPane } = Tabs;
const { Title, Text } = Typography;


const topColResponsiveProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 24,
  xl: 6,
  style: {
    marginBottom: 24,
  },
};

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

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
}

const getUniqueCategories = cats => {

  return Object.values(cats).filter(onlyUnique);

}


class TopSearch extends React.Component {

  cat = null;

  subcat = null;

  label = null;

  constructor(props){
    super(props);
    this.state={
      loading: this.props.loading,
      match: this.props.match,
      structure: this.props.structure,
      tabKey: this.props.structure[0][0]
    }
  }


  existsInProject = (row) => {
    if(this.state.match.matchitems){
        for(let i=0;i<this.state.match.matchitems.length;i++){
            if(this.state.match.matchitems[i].trim() === row.trim()){
                return <CheckCircleTwoTone style={{ fontSize: '1.2rem', float: "right" }} twoToneColor="#52c41a" />
            }
        }
    }


    return <CloseCircleTwoTone style={{ fontSize: '1rem', float: "right" }} twoToneColor="#FF0000" />
}


 render(){

  if(this.state.structure !== null && this.state.match.jobpost_results !== null){
    this.cat = this.state.structure[0][this.state.match.jobpost_results[0].split(',')[0]]
    this.subcat = this.state.match.jobpost_results[0].split(',')[1];
    this.label = this.state.match.jobpost_results[0].split(',')[0];
  }

  const getResultItem = () => {
    if(this.state.structure && this.state.match.jobpost_results){

    const temp = [];

    Object.values(this.state.match.jobpost_results).forEach((val) => {
      const parts = val.split(',');

      if(this.state.tabKey.toLowerCase() === this.state.structure[0][parts[0]].toLowerCase()){
        temp.push(val);
      }
    })

      return temp;
    }
    return '';

  }

  return(
    <Row gutter={24} type="flex">
    <Col {...topColResponsiveProps} xl={{ span: 14, offset: 5 }}>
      <Card
      loading={this.state.loading}
      bordered={false}
      title="Results"
      style={{
        height: '100%',
      }}
      >
        <Row gutter={68} type="flex">
          <Col
            sm={12}
            xs={24}
            style={{
              marginBottom: 24,
            }}
          >
            <Gauge title="Match" height={164} color={gaugeColor((this.state.match.matchpercent * 100).toFixed(2))} percent={(this.state.match.matchpercent * 100).toFixed(2)} />

          </Col>
          <Col
            sm={12}
            xs={24}
            style={{
              marginBottom: 24,
            }}
          >
            <Space size="middle" direction="vertical" style={{color: '#000'}}>
              <Space size="middle" direction="horizontal">
                <Text strong>
                  Keywords found in job decription:
                </Text>
                <div>
                  {this.state.match ? this.state.match.jobpost_results.length : ''}
                </div>
              </Space>
              <Space size="middle" direction="horizontal">
                <Text strong>
                  Relevant keywords found in your project:
                </Text>
                <div>
                  {this.state.match ? this.state.match.matchitems.length : ''}
                </div>
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>
    </Col>


    <Col {...topColResponsiveProps} xl={{ span: 14, offset: 5 }}>
      <Card
      loading={this.state.loading}
      bordered={false}
      title="Keywords"
      style={{
        height: '100%',
      }}
      >
        <Row gutter={68} type="flex">
          <Col
            sm={12}
            xs={24}
            md={{ span: 12, offset: 5 }}
            lg={{ span: 12, offset: 5 }}
            xl={{ span: 12, offset: 5 }}
            style={{
              marginBottom: 24,
            }}
          >

        { this.state.structure !== null && this.state.match.jobpost_results !== null ?
        <div style={{ listStyleType: "none" }}>
            <Title level={4}>{this.state.structure[0][this.label]}</Title>
            <Text strong>{this.state.structure[1][this.subcat]}</Text>
            <p>{this.state.structure[3][this.label]}{this.existsInProject(this.label)}</p>


                {
                this.state.match.jobpost_results.map((item) => {
                    const parts = item.split(',');

                    if(this.subcat === parts[1]){
                        if(this.label !== parts[0]){
                            this.label = parts[0];
                            return(
                                <React.Fragment key={parts[0]}>
                                    <p>{this.state.structure[3][parts[0]]}{this.existsInProject(this.label)}</p>
                                </React.Fragment>
                                )
                        }

                    }
                    else{
                        this.subcat = parts[1];
                        this.label = parts[0];
                    return(
                        <React.Fragment key={parts[0]}>
                            <Title level={4}>{
                                this.cat === this.state.structure[0][this.label] ?
                                ''
                                :
                                this.cat = this.state.structure[0][this.label]
                                }
                            </Title>
                            <Text strong>{this.state.structure[1][parts[1]]}</Text>
                            <p>{this.state.structure[3][parts[0]]}
                    {this.existsInProject(this.label)}</p>
                        </React.Fragment>
                    )
                }
                })
                    }
            </div>
                    :
            <Empty  />
            // {
            //   Object.values(getResultItem()).map((val) => {
            //     const parts = val.split(',');

            //     if(this.subcat === parts[1]){

            //       if(this.label !== parts[0]){
            //         this.label = parts[0];
            //         return(
            //             <React.Fragment key={parts[0]}>
            //               <Title level={3}>{this.state.structure[1][parts[1]]}</Title>
            //                 <p>{this.state.structure[3][parts[0]]}{this.existsInProject(this.label)}</p>
            //             </React.Fragment>
            //             )
            //     }

            //       return(
            //         <React.Fragment key={parts[0]}>
            //             <Title level={3}>{this.state.structure[1][parts[1]]}</Title>
            //             <p>{this.state.structure[3][parts[0]]}
            //             {this.existsInProject(this.label)}</p>
            //         </React.Fragment>
            //       )
            //   }
            //       this.subcat = parts[1];
            //       this.label = parts[0];
            //       console.log(this.subcat, parts[1]);
            //       return '';
            //   })

            // }
            }

          </Col>
        </Row>
      </Card>
    </Col>
  </Row>
  )
 }

}


export default TopSearch;
