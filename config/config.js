// https://umijs.org/config/
import { defineConfig, utils } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import webpackPlugin from './plugin.config';

const { winPath } = utils; // preview.pro.ant.design only do not use in your production ;

const {
  ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION,
  REACT_APP_AXIOS_BASEURL,
  REACT_APP_AXIOS_API_V1,
  REACT_APP_ENV,
  GA_KEY,
} = process.env;
export default defineConfig({
  hash: true,
  // history: { type: 'hash' }, // default type is browser
  antd: {},
  analytics: GA_KEY
    ? {
        ga: GA_KEY,
      }
    : false,
  dva: {
    hmr: true,
  },
  locale: {
    // default zh-CN
    default: 'us-EN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/user',
          component: '../layouts/UserLayout',
          routes: [
            {
              path: '/user',
              redirect: '/user/login',
            },
            {
              name: 'Login',
              icon: 'login',
              path: '/user/login',
              component: './user/login',
            },
            {
              name: 'Register-result',
              icon: 'smile',
              path: '/user/register-result',
              component: './user/register-result',
            },
            {
              name: 'Register',
              icon: 'smile',
              path: '/user/register',
              component: './user/register',
            },
            {
              name: 'Confirm Email',
              icon: 'login',
              path: '/user/confirm-email',
              component: './user/confirm-email',
            },
            {
              name: 'Reset Password',
              icon: 'login',
              path: '/user/reset-password',
              component: './user/reset-password',
            },
            {
              name: 'Reset Password',
              icon: 'login',
              path: '/user/reset-password/:uidb64/:token',
              component: './user/reset-password',
            },
            {
              component: '404',
            },
          ],
        },
        {
          path: '/misc',
          component: '../layouts/UserLayout',
          routes: [
            {
              path: '/misc',
              redirect: '/misc/terms',
            },
            {
              name: 'Terms and Conditions',
              icon: 'login',
              path: '/misc/terms',
              component: './misc/terms',
            },
            {
              name: 'Privacy policy',
              icon: 'login',
              path: '/misc/privacy',
              component: './misc/privacy',
            },
            {
              name: 'Contact Us',
              icon: 'login',
              path: '/misc/contact',
              component: './misc/contact',
            },
            {
              name: 'Test',
              icon: 'Test',
              path: '/misc/test',
              component: './misc/test',
              hideInMenu: true,
            },
            {
              name: 'Linkedin',
              icon: 'smile',
              path: '/misc/testcp',
              component: './misc/testcp',
              hideInMenu: true,
            },
            {
              component: '404',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              name: 'Welcome',
              path: '/home',
              icon: 'home',
              component: '../pages/Welcome',
            },
            {
              name: 'How it Works',
              path: '/how-it-works',
              icon: 'question',
              component: '../pages/HowitWorks',
            },
            {
              path: '/scan',
              icon: 'scan',
              name: 'Scan',
              routes: [
                {
                  path: '/scan',
                  redirect: '/scan/list',
                },
                {
                  name: 'New Scan',
                  icon: 'plus',
                  path: '/scan/new',
                  component: './form/basic-form',
                },
                {
                  name: 'My Scans',
                  icon: 'folder',
                  path: '/scan/list',
                  component: './scan/list',
                },
                {
                  name: 'Scan',
                  icon: 'folder',
                  path: '/scan/item/:matchID',
                  component: './dashboard/analysis',
                  hideInMenu: true,
                },
              ],
            },
            {
              name: 'Project',
              icon: 'project',
              path: '/project/:matchID',
              component: './dashboard/project',
              hideInMenu: true,
            },
            {
              path: '/portfolio',
              icon: 'folder',
              name: 'Portfolio',
              routes: [
                {
                  path: '/portfolio',
                  redirect: '/portfolio/list',
                },
                {
                  name: 'New Project',
                  icon: 'plus',
                  path: '/portfolio/new',
                  component: './form/step-form',
                },
                {
                  name: 'My Projects',
                  icon: 'project',
                  path: '/portfolio/list',
                  component: './portfolio/list',
                },

              ],
            },
            {
              name: 'Account',
              icon: 'user',
              path: '/account',
              hideInMenu: true,
              routes: [
                {
                  name: 'User Profile',
                  icon: 'control',
                  path: '/account/center',
                  component: './account/center',
                },
                {
                  name: 'Account Settings',
                  icon: 'setting',
                  path: '/account/settings',
                  component: './account/settings',
                },
              ],
            },
            {
              path: '/',
              redirect: '/user/login',
            },
            {
              component: '404',
            },
          ],
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  define: {
    REACT_APP_ENV: REACT_APP_ENV || false,
    REACT_APP_AXIOS_BASEURL: REACT_APP_AXIOS_BASEURL || 'https://api.creativehire.co',
    REACT_APP_AXIOS_API_V1: REACT_APP_AXIOS_API_V1 || 'api/v1/',
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoader: {
    javascriptEnabled: true,
  },
  cssLoader: {
    modules: {
      getLocalIdent: (context, _, localName) => {
        if (
          context.resourcePath.includes('node_modules') ||
          context.resourcePath.includes('ant.design.pro.less') ||
          context.resourcePath.includes('global.less')
        ) {
          return localName;
        }

        const match = context.resourcePath.match(/src(.*)/);

        if (match && match[1]) {
          const antdProPath = match[1].replace('.less', '');
          const arr = winPath(antdProPath)
            .split('/')
            .map((a) => a.replace(/([A-Z])/g, '-$1'))
            .map((a) => a.toLowerCase());
          return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
        }

        return localName;
      },
    },
  },
  manifest: {
    basePath: '/',
  },
  proxy: proxy[REACT_APP_ENV || 'dev'],
  chainWebpack: webpackPlugin,
});
