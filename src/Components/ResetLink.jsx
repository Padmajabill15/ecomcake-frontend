import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';


function ResetLink() {
  const [searchParams] = useSearchParams();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState("")
  const navigate = useNavigate();
  useEffect(() => {
    const encrypted = decodeURIComponent(searchParams.get('userid'));
    console.log(encrypted)
    if (encrypted) {
      try {
        const [ivHex, encryptedHex] = encrypted.split(':');

        const key = CryptoJS.PBKDF2("thisismycodenodejscrypto", CryptoJS.enc.Utf8.parse("my_salt_string"), {
          keySize: 256 / 32,
          iterations: 1000,
          hasher: CryptoJS.algo.SHA256
        });

        const decrypted = CryptoJS.AES.decrypt(
          { ciphertext: CryptoJS.enc.Hex.parse(encryptedHex) },
          key,
          {
            iv: CryptoJS.enc.Hex.parse(ivHex),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          }
        );

        const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
        console.log("Decrypted User ID:", plaintext);
        setUserId(plaintext);
      } catch (error) {
        console.error("Decryption failed:", error);
      }
    }
  }, [searchParams]);

  const submitHandler = async (e) => {
    let userpassword={
      password:password
    }
    e.preventDefault();
    let response = await fetch(`http://localhost:5000/resetPassword/${userId}`, {
      method: 'put',
      headers: { "Content-Type": "application/JSON" },
      body: JSON.stringify(userpassword),
    });

    let result = await response.json();
    if (response.status == 200) {
     
      console.log(result)
      navigate('/Signin')
    }
    else {
      alert(result.message)
    }
  };
  return (
    <div>
      <h1 className='mt-5'>RESET</h1>

      <form onSubmit={submitHandler}>
        <input type="text" onChange={(e) => setPassword(e.target.value)} />
        <input type="submit" name="" id="" />
      </form>
    </div>
  )
}

export default ResetLink
