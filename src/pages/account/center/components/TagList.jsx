import { Tag, AutoComplete, message, Typography } from 'antd';
import React, { useState } from 'react';

import axios from '../../../../umiRequestConfig';
import styles from '../Center.less';


const { Title, Text } = Typography;

const TagList = ({ tagsInput, structure }) => {
    // const ref = useRef(null);
    // const [newTags, setNewTags] = useState([]);
    // const [inputVisible, setInputVisible] = useState(false);
    // const [inputValue, setInputValue] = useState('');
    const [selected, setSelected] = useState('');
    const [tags, setTags] = useState(tagsInput)
    
    const colors = new Map();
  
    colors.set('custom', '#f50');
    colors.set('resume', '#87d068');
    colors.set('projects', '#108ee9');
  
    // const showInput = () => {
    //   setInputVisible(true);
  
    //   if (ref.current) {
    //     // eslint-disable-next-line no-unused-expressions
    //     ref.current?.focus();
    //   }
    // };
  
    // const handleInputChange = e => {
    //   setInputValue(e.target.value);
    // };
  
    // const handleInputConfirm = () => {
    //   let tempsTags = [...newTags];
  
    //   if (inputValue && tempsTags.filter(tag => tag.label === inputValue).length === 0) {
    //     tempsTags = [
    //       ...tempsTags,
    //       {
    //         key: `new-${tempsTags.length}`,
    //         label: inputValue,
    //       },
    //     ];
    //   }
  
    //   setNewTags(tempsTags);
    //   setInputVisible(false);
    //   setInputValue('');
    // };

    const skillAPI = info => {
        return axios.put(REACT_APP_AXIOS_API_V1.concat('entities/candidate-complete-details/').concat(btoa(JSON.parse(localStorage.getItem('accessTokenDecoded')).user_id)), info)
    }
  
    const getSets = () => {
      const temp = {};
        Object.keys(tags).forEach(key => {
          tags[key].forEach(item => {
          if(temp[structure[0][item]]){
            temp[structure[0][item]] = temp[structure[0][item]].concat(item.toString().concat('-').concat(key).concat(','));
          } 
          else{
            temp[structure[0][item]] = item.toString().concat('-').concat(key).concat(',');
          }
          })
        })

      return temp;
    }
  
    const uniqueItems = arr => {
      return arr.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
    };

    const handleClose = (removedTag ) => {
        const item = {
            'type': 'skill-remove',
            'skillType': 'custom',
            'skill': removedTag.toString()
        }
        skillAPI(item)
        .then(res => {
          message.warn(`${structure[3][removedTag]} has been removed!`);
          setTags(res.data)
        })
    }
  
    const generateTags = arr => {
      const output = [];
  
      arr.forEach((item, value) =>{
        if(item){
          const split = item.split('-');
          if(structure[3][split[0]].length > 0){
            output.push(<Tag color={colors.get(split[1])} key={item} onClose={() => handleClose(split[0])} closable='true'>{structure[3][split[0]]}</Tag>)
          }
        }
      })
      return output;
    }
  
    const generateKeys = () => {
      
      const skills = getSets();
      const cats = uniqueItems(structure[0]);
      const output = [];
      
      Object.keys(cats).forEach(item => {
          const x = (
            <div key={item}>
              <div className={styles.tagsTitle}>{cats[item]}</div>
              {
                skills[cats[item]] ? 
                  generateTags(skills[cats[item]].trim().split(','))
                :
                <Text type='secondary'>No Skills</Text>
              }
              {/* {inputVisible && (
                <Input
                  ref={ref}
                  type="text"
                  size="small"
                  style={{
                    width: 78,
                  }}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                />
              )}
              {!inputVisible && (
                <Tag
                  onClick={showInput}
                  style={{
                    borderStyle: 'dashed',
                  }}
                >
                  <PlusOutlined />
                </Tag>
              )} */}
            </div>
            )
            output.push(x)
      })
      return output;
    }
  
    const renderItem = (item, cat) => (
      
      <div
        key={item}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {item}
        <span style={{ fontSize: '0.8em' }}>{cat}</span>
      </div>
    );
  
    const onSelect = (label, option) => {
      const { item, category, subcategory, index } = option;
      setSelected(item);
      // updateSkills((prev) => [...prev, `${index},-1,-1`]);
      
      const repeat = tags.custom.includes(index);
      
      if(repeat) { 
        message.error(`${item} is already present.`)
      }
      else{
          const data = {
            'type': 'skill',
            'skillType': 'custom',
            'skill': index
          }
        skillAPI(data)
        .then(res => {

          if(res.data === "Duplicate entry for skill"){
            message.error(`${item} is already present.`)
          }
          else{
            setTags(res.data);
            message.success(`${structure[3][index]} has been added!`);
          }
        })
        .catch(err => {
          message.error(err)
        })
      }
      
  
    };
  
    const autoCompleteValues = structure[3]
      .filter((item) => item.length > 0)
      .map((item) => {
        const index = structure[3].indexOf(item);
        const category = structure[0][index];
        const subcategory = structure[1][index];
        return {
          value: renderItem(item, category),
          item,
          category,
          subcategory,
          index,
        };
      });
  
    return (
      <div className={styles.tags}>
        <Title level={4}>Skills</Title>
        <AutoComplete
            placeholder="Add skill"
            options={autoCompleteValues}
            filterOption={(inputValue, option) =>
              option.item.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1
            }
            style={{ width: 250 }}
            notFoundContent="No Skills Found"
            onSelect={onSelect}
            onChange={(value) => {
              setSelected(value);
            }}
            value={selected}
        />
        {        
          generateKeys()
        }
      </div>
    );
  };

  export default TagList;