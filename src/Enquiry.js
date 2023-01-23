import React from 'react'
import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { set,ref } from "firebase/database";
import "firebase/compat/auth";
import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};


const app = firebase.initializeApp(firebaseConfig);
const db = getDatabase(app);

function Enquiry() {
    
    const [name,setName] = useState("");
    const [query,setQuery] = useState("");
    const [number,setNumber] = useState("");
    const [otp,setOtp] = useState("");
    const [final,setFinal] = useState("");

    const hName = (event) => {setName(event.target.value)}
    const hQuery = (event) => {setQuery(event.target.value)}
    const hNumber = (event) => {setNumber(event.target.value)}
    const hOtp = (event) => {setOtp(event.target.value)}
    
    const configureCaptcha = () =>{
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("sign-in-button",
        {"size":"invisible",
        "callback":(response) => {
            sendOtp();
            console.log("Recaptcha Verified")
        },
        defaultCountry:"IN"});
    }

    const sendOtp = (event) => {
        event.preventDefault();
        configureCaptcha();
        let pn = "+91" + number;
        let av = window.recaptchaVerifier;
        firebase.auth().signInWithPhoneNumber(pn,av)
        .then(res=>{
            setFinal(res);
            console.log(res);
            console.log("OTP Sent");
            alert("OTP Sent")
        })
        .catch(err=>{console.log(err)})
    }
    const submitOtp = (event) =>{
        event.preventDefault();
        final.confirm(otp)
        .then(res=>{
            const d = new Date().toString();
            const n = name + "-->" + d;
            const data = {name,number,query,d}
            set(ref(db,"enquiry/" + n),data)
            .then(res=>{
                console.log(res);
                alert("Will Call You back In 2 Hours")
                window.location.reload();
            })
            .catch(err=>console.log(err))
        })
        .catch(err=>{
            console.log(err);
            alert("Invalid Otp");
            window.location.reload()
        })
    }
    
  return (
    <div>
        <center>
            <h1>Fill the Enquiry Form</h1>
            <br/>
            <form onSubmit={sendOtp}>
                <div id='sign-in-button'></div>
            <input type={"text"} placeholder="Enter Your Name Here" onChange={hName} value={name}/>
            <br/><br/>
            <textarea placeholder="Enter Your Query" rows={3} cols={20} onChange={hQuery} value={query}></textarea>
            <br/><br/>
            <input type={"number"} placeholder="Enter Your Phone Number" onChange={hNumber} value={number}/>
            <br/><br/>
            <input type={"submit"} value="Generate OTP"/>
            <br/><br/>
            </form>
            <form onSubmit={submitOtp}>
            <input type={"text"} placeholder="Enter Your OTP" onChange={hOtp} value={otp}/>
            <br/><br/>
            <input type={"submit"} value="Submit"/>
            <br/><br/>
            </form>
        </center>
    </div>
  )
}

export default Enquiry