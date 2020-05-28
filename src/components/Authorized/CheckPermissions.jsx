import React from 'react';
import { CURRENT } from './renderAuthorize'; // eslint-disable-next-line import/no-cycle

import PromiseRender from './PromiseRender';

/**
 * 通用权限检查方法
 * Common check permissions method
 * @param { 权限判定 | Permission judgment } authority
 * @param { 你的权限 | Your permission description } currentAuthority
 * @param { 通过的组件 | Passing components } target
 * @param { 未通过的组件 | no pass components } Exception
 */
const checkPermissions = (authority, currentAuthority, target, Exception) => {
  // No judgment authority. View all by default
  // Retirement authority, return target;
  if (!authority) {
    return target;
  } // Array processing

  if (Array.isArray(authority)) {
    if (Array.isArray(currentAuthority)) {
      if (currentAuthority.some(item => authority.includes(item))) {
        return target;
      }
    } else if (authority.includes(currentAuthority)) {
      return target;
    }

    return Exception;
  } // string processing

  if (typeof authority === 'string') {
    if (Array.isArray(currentAuthority)) {
      if (currentAuthority.some(item => authority === item)) {
        return target;
      }
    } else if (authority === currentAuthority) {
      return target;
    }

    return Exception;
  } // Promise processing

  if (authority instanceof Promise) {
    return <PromiseRender ok={target} error={Exception} promise={authority} />;
  } // Function processing

  if (typeof authority === 'function') {
    try {
      const bool = authority(currentAuthority); // After the function is executed, the return value in Promise

      if (bool instanceof Promise) {
        return <PromiseRender ok={target} error={Exception} promise={bool} />;
      }

      if (bool) {
        return target;
      }

      return Exception;
    } catch (error) {
      throw error;
    }
  }

  throw new Error('unsupported parameters');
};

export { checkPermissions };

function check(authority, target, Exception) {
  return checkPermissions(authority, CURRENT, target, Exception);
}

export default check;
