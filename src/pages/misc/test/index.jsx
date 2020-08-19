import React from 'react';

import { LinkedIn } from 'react-linkedin-login-oauth2';

import axios from '../../../umiRequestConfig';

class Test extends React.Component {

  state = {
    profile: '',
    code: '',
    errorMessage: '',
  };

  accessToken = 'AQURL66ZQYrw1w4NsjhhqbL_lsmeNNr44OIvC1HdEyxDQTlrb1yVx9jhgQ08Bznq4EoaKlS1171s4klhWQYJKZ6qAiGVX4_plFzyr_LYwKttHE12uTATup-BFnMSjWSUxaD2LYajUPsSMUtMdrXCmFBckkgLBkvCJDoXPXVw1izwJn6rFhGVR8heEDzFnKmGqlcvulGGQBo4wshu63YP8wXbnHiBPGSNRDBoDxTXNqGRxeWJ2efFeiFrb4ix3-7zUD8EHZUnVtnI19HW9pLMsDYvXAw1hPiMMjxYuqQxZ6-6kYw593L_DrmTj5EHssIiHZGjr2B-v8KRz6cznqLXGSDIsp2wCg';
  


  handleSuccess = (data) => {
    this.setState({
      code: data.code,
      errorMessage: '',
    });
    this.setState({
      profile: this.getProfile(data.code)
    })
  }

  handleFailure = (error) => {
    this.setState({
      code: '',
      errorMessage: error.errorMessage,
    });
  }

  getProfile = (token) => {
    let output = '';
    axios({
        method: 'get',
        url: 'https://api.linkedin.com/v2/me',
        headers: {
          'Authorization': `Bearer ${token}`,
          'cache-control': 'no-cache',
          'X-Restli-Protocol-Version': '2.0.0',
          'Access-Control-Allow-Origin': '*'
        }
    }).then(res => {
      console.log(res);
      output = res;
    })

    return output;
  }

  render() {
    console.log("State:", this.state)
    // const accessToken = 'AQURL66ZQYrw1w4NsjhhqbL_lsmeNNr44OIvC1HdEyxDQTlrb1yVx9jhgQ08Bznq4EoaKlS1171s4klhWQYJKZ6qAiGVX4_plFzyr_LYwKttHE12uTATup-BFnMSjWSUxaD2LYajUPsSMUtMdrXCmFBckkgLBkvCJDoXPXVw1izwJn6rFhGVR8heEDzFnKmGqlcvulGGQBo4wshu63YP8wXbnHiBPGSNRDBoDxTXNqGRxeWJ2efFeiFrb4ix3-7zUD8EHZUnVtnI19HW9pLMsDYvXAw1hPiMMjxYuqQxZ6-6kYw593L_DrmTj5EHssIiHZGjr2B-v8KRz6cznqLXGSDIsp2wCg';



    const { profile, code, errorMessage } = this.state;
    return (
      <div>
        <LinkedIn
          clientId="86qjkfytfrjz6i"
          redirectUri={`${window.location.origin}/misc/testcp`}
          scope="r_liteprofile"
          state="34232423"
          onFailure={this.handleFailure}
          onSuccess={this.handleSuccess}
          supportIE
          redirectPath='/misc/testcp'
        >
          <img src='../../../src/assets/linkedin.png' alt="Log in with Linked In" style={{ maxWidth: '180px' }} />
        </LinkedIn>
        {!code && <div>No code</div>}
        {code && <div>Code: {code}</div>}
        {profile && <div>profile: {profile}</div>}
        {errorMessage && <div>{errorMessage}</div>}
      </div>
    );
  } 
  
}

export default Test;

// http://localhost:3001/api/v1/social-auth/complete/linkedin-oauth2/
// http://localhost:3001/accounts/linkedin_oauth2/login/callback/