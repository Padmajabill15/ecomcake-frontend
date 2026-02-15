import React, { useState } from 'react';

function OtpVerification({ disableResndButton, timer, verifyOtp, submitHandler }) {
  const [otp, setOtp] = useState("");

  const submitOtpHandler = (e) => {
    e.preventDefault();
    verifyOtp(otp);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg p-4 rounded-4">
            <h3 className="text-center mb-3">OTP Verification</h3>
            <hr />
            <form onSubmit={submitOtpHandler}>
              <div className="mb-4">
                <input
                  type="text"
                  className="form-control form-control-lg text-center"
                  maxLength={6}
                  pattern="\d{6}"
                  title="Enter 6 digit OTP"
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                  required
                  placeholder="Enter 6-digit OTP"
                />
              </div>

              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-success btn-lg">
                  Verify OTP
                </button>

                <button
                  type="button"
                  onClick={submitHandler}
                  disabled={disableResndButton}
                  className="btn btn-outline-primary btn-lg"
                >
                  {disableResndButton ? `${timer}s Resend` : "Resend OTP"}
                </button>

                <button
                  type="button"
                  disabled={disableResndButton}
                  className="btn btn-secondary btn-lg"
                  onClick={() => window.location.href = "/register"} // or use React Router navigation
                >
                  Edit Email
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtpVerification;
