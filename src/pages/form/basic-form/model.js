import { message } from 'antd';
import { newScan } from './service';

const Model = {
  namespace: 'formAndbasicForm',
  state: {},
  effects: {
    *submitRegularForm({ payload }, { call }) {
      const userID =  localStorage.getItem('userID');
      const scan = yield call(newScan, payload, userID);

      if(scan.status === 200){
        message.success('New scan submitted');
        window.location.href = window.location.href.split('new')[0].concat('item/').concat(scan.data.scanid);
      }

    },
  },
};
export default Model;
