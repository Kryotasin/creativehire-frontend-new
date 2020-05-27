global.SERVER = '127.0.0.1:8000/'

global.REST_AUTH = 'rest-auth/';
global.API = 'api/v1/'

// No starting slash required
global.REST_AUTH_REGISTER = global.SERVER + global.API + global.REST_AUTH + 'registration/';
global.AUTHENTICATE = global.SERVER + 'authenticate/';
global.LOGIN = global.SERVER + global.API + global.REST_AUTH + 'rest-auth/login/';

global.JOBPOST = global.SERVER + 'jobpost/';
global.UPLOAD_JOBPOST_IMAGE = global.SERVER + 'upload-jobpost-image/';