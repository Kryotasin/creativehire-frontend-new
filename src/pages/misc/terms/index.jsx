import React from 'react';
import { Typography, Row, Col, List } from 'antd';
import { Helmet, Link } from 'umi';

const { Title, Text } = Typography;

const Terms = () => {

    return (
        <div>
        <Helmet>
            <meta charSet="utf-8" />
            <title>Terms and Conditions</title>
        </Helmet>
      <Row>
      <Col span={4}/>
      <Col span={16}>
      <Title>Terms and Conditions for CreativeHire</Title>

        <Title level ={3}>Introduction</Title> 
        
        <p>These Website Standard Terms and Conditions written on this webpage shall manage your use of our website, Creativehire accessible at <a href="https://www.creativehire.co/">https://www.creativehire.co/</a>.</p>

        <p>These Terms will be applied fully and affect to your use of this Website. By using this Website, you agreed to accept all terms and conditions written in here. You must not use this Website if you disagree with any of these Website Standard Terms and Conditions. These Terms and Conditions have been generated with the help of the <a href="https://www.termsandcondiitionssample.com">Terms And Conditions Template</a> and the <a href="https://www.terms-conditions-generator.com">Terms and Conditions Generator</a>.</p>

        <p>Minors or people below 18 years old are not allowed to use this Website.</p>

        <Title level ={3}>Intellectual Property Rights</Title>

        <p>Other than the content you own, under these Terms, CreativeHire and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>

        <p>You are granted limited license only for purposes of viewing the material contained on this Website.</p>

        <Title level ={3}>Restrictions</Title>

        <p>You are specifically restricted from all of the following:</p>

        <List size="small">
            <List.Item>Publishing any Website material in any other media;</List.Item>
            <List.Item>Selling, sublicensing and/or otherwise commercializing any Website material;</List.Item>
            <List.Item>Publicly performing and/or showing any Website material;</List.Item>
            <List.Item>Using this Website in any way that is or may be damaging to this Website;</List.Item>
            <List.Item>Using this Website in any way that impacts user access to this Website;</List.Item>
            <List.Item>Using this Website contrary to applicable laws and regulations, or in any way may cause harm to the Website, or to any person or business entity;</List.Item>
            <List.Item>Engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website;</List.Item>
            <List.Item>Using this Website to engage in any advertising or marketing.</List.Item>
        </List>

        <p>Certain areas of this Website are restricted from being access by you and CreativeHire may further restrict access by you to any areas of this Website, at any time, in absolute discretion. Any user ID and password you may have for this Website are confidential and you must maintain confidentiality as well.</p>

        <Title level ={3}>Your Content</Title>

        <p>In these Website Standard Terms and Conditions, "Your Content" shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant CreativeHire a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>

        <p>Your Content must be your own and must not be invading any third-party’s rights. CreativeHire reserves the right to remove any of Your Content from this Website at any time without notice.</p>

        <Title level ={3}>Your Privacy</Title>

        <p>Please read <Link to="privacy-policy">Privacy Policy</Link>.</p>

        <Title level ={3}>No warranties</Title>

        <p>This Website is provided "as is," with all faults, and CreativeHire express no representations or warranties, of any kind related to this Website or the materials contained on this Website. Also, nothing contained on this Website shall be interpreted as advising you.</p>

        <Title level ={3}>Limitation of liability</Title>

        <p>In no event shall CreativeHire, nor any of its officers, directors and employees, shall be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract.  CreativeHire, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.</p>

        <Title level ={3}>Indemnification</Title>

        <p>You hereby indemnify to the fullest extent CreativeHire from and against any and/or all liabilities, costs, demands, causes of action, damages and expenses arising in any way related to your breach of any of the provisions of these Terms.</p>

        <Title level ={3}>Severability</Title>

        <p>If any provision of these Terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting the remaining provisions herein.</p>

        <Title level ={3}>Variation of Terms</Title>

        <p>CreativeHire is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.</p>

        <Title level ={3}>Assignment</Title>

        <p>The CreativeHire is allowed to assign, transfer, and subcontract its rights and/or obligations under these Terms without any notification. However, you are not allowed to assign, transfer, or subcontract any of your rights and/or obligations under these Terms.</p>

        <Title level ={3}>Entire Agreement</Title>
            
        <p>These Terms constitute the entire agreement between CreativeHire and you in relation to your use of this Website, and supersede all prior agreements and understandings.</p>

        <Title level ={3}>Governing Law & Jurisdiction</Title>

        <p>These Terms will be governed by and interpreted in accordance with the laws of the State of us, and you submit to the non-exclusive jurisdiction of the state and federal courts located in us for the resolution of any disputes.</p>

                </Col>
      <Col span={4}/>
    </Row>
        
  </div>
    );
  
}

export default Terms;