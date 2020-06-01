import { message } from 'antd';
import { newScan } from './service';
import { getPageQuery } from '../../../utils/utils';

const Model = {
  namespace: 'formAndbasicForm',
  state: {},
  effects: {
    *submitRegularForm({ payload }, { call }) {
      const userID =  localStorage.getItem('userID');
      const scan = yield call(newScan, payload, userID);

      if(scan.status === 200){
        message.success('New scan submitted');
        console.log(scan.data)
        window.location.href = '/scan/item/'.concat(scan.data.scanid);
      }

    },
  },
};
export default Model;
