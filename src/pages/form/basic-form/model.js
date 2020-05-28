import { message } from 'antd';
import { newScan } from './service';

const Model = {
  namespace: 'formAndbasicForm',
  state: {},
  effects: {
    *submitRegularForm({ payload }, { call }) {
      // yield call(newScan, payload);
      console.log(payload);
      message.success('New scan submitted');
    },
  },
};
export default Model;
