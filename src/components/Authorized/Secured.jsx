import React from 'react';
import CheckPermissions from './CheckPermissions';
/**
 * No pages can be accessed by default
 * default is "NULL"
 */

const Exception403 = () => 403;

export const isComponentClass = component => {
  if (!component) return false;
  const proto = Object.getPrototypeOf(component);
  if (proto === React.Component || proto === Function.prototype) return true;
  return isComponentClass(proto);
}; // Determine whether the incoming component has been instantiated
// AuthorizedRoute is already instantiated
// Authorized  render is already instantiated, children is no instantiated
// Secured is not instantiated

const checkIsInstantiation = target => {
  if (isComponentClass(target)) {
    const Target = target;
    return props => <Target {...props} />;
  }

  if (React.isValidElement(target)) {
    return props => React.cloneElement(target, props);
  }

  return () => target;
};
/**
 * Used to determine whether you have permission to access this view Authority
 * authority Support incoming string, () => boolean | Promise
 * e.g. 'user' can only be accessed by user
 * e.g. 'user, admin' both user and admin can access
 * e.g. () => boolean returns true can be accessed, false returns cannot be accessed
 * e.g. Promise then can access catch can not access
 * e.g. authority support incoming string, () => boolean | Promise
 * e.g. 'user' only user user can access
 * e.g. 'user, admin' user and admin can access
 * e.g. () => boolean true to be able to visit, return false can not be accessed
 * e.g. Promise then can not access the visit to catch
 * @param {string | function | Promise} authority
 * @param {ReactNode} error Non-essential parameters
 */

const authorize = (authority, error) => {
  /**
   * conversion into a class
   * Prevent errors caused by not finding staticContext when passing in a string
   * String parameters can cause staticContext not found error
   */
  let classError = false;

  if (error) {
    classError = () => error;
  }

  if (!authority) {
    throw new Error('authority is required');
  }

  return function decideAuthority(target) {
    const component = CheckPermissions(authority, target, classError || Exception403);
    return checkIsInstantiation(component);
  };
};

export default authorize;
