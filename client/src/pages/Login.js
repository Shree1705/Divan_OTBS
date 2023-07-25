import React, { useState } from "react";
import { Form, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import '../resourses/auth.css'
import OTPInput, { ResendOTP } from "otp-input-react";
import Button from 'react-bootstrap/Button';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput
} from 'mdb-react-ui-kit';
function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [OTP, setOTP] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState(0)
  const [loadSend, setloadSend] = useState(false)
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post("/api/users/login", values);
      dispatch(HideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        localStorage.setItem("token", response.data.data);
        window.location.href = "/";
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  const handleSendOTP = async (e) => {
    console.log(PhoneNumber);
    try {
      const response = await axios.post("/api/users/sendOTP", { PhoneNumber });
      setloadSend(true)
    } catch (error) {
      console.log("error");
    }
  }

  const handleVerify = async (e) => {
    // if (!(OTP.length === 4)) {
    //   alert("enter 4 digits")
    //   setOTP("")
    //   return
    // }
    try {
      const response = await axios.post("/api/users/loginOTP", { OTP });

      if (response.data.success) {
        message.success(response.data.message);
        localStorage.setItem("token", response.data.data);
        window.location.href = "/";
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log("error");
    }
  }

  return (
    <div className="h-screen d-flex justify-content-center align-items-center auth">
    
      <div className="w-400 card p-3">
      <div className="logo" style={{alignItems:"center", display:"flex",justifyContent:"center",padding:"10px"}}>

<img src="/images/divan.jpeg" style={{width:"250px",height:"100px"}}/>
</div>
        <hr />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email">
            <input type="text" />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <input type="password" />
          </Form.Item>
          <div className="d-flex justify-content-between align-items-center my-3">
            <Link to="/register">Click Here To Register</Link>
            <button className="secondary-btn" type="submit">
              Login
            </button>
          </div>
        </Form>
        <hr />
      </div>
      <div>
        <MDBContainer fluid className='d-flex align-items-center justify-content-center'>
          <MDBCard className='m-4' style={{ maxWidth: "250px" }}>
            <MDBCardBody className='px-4'>
              <label className='p-2'>Phone Number :</label>
              <MDBInput wrapperClass='mb-2' onChange={(e) => setPhoneNumber(e.target.value)} size='sm' id='phone' type='number' />
              {/* <button
                  className='lButton w-100 gradient-custom-4' size='md'
                  onClick={handleSendOTP}>Send OTP
                </button> */}
              <button className="secondary-btn" onClick={handleSendOTP} type="submit">Send OTP</button>
            </MDBCardBody>
            {loadSend &&
              <MDBCardBody className='px-4 m-2'>
                <OTPInput value={OTP} onChange={setOTP} autoFocus OTPLength={4} otpType="number" disabled={false} secure />
                <ResendOTP className='m-2 w-100' variant="info" size='md' maxTime={120} disabled onResendClick={handleSendOTP} />
                <Button variant="outline-success" size='lg' onClick={handleVerify}>Verify</Button>
                {/* <button className="secondary-btn" onClick={handleVerify} type="submit">Send OTP</button> */}
              </MDBCardBody>
            }
          </MDBCard>
        </MDBContainer>
      </div>
    </div>
  );
}

export default Login;
