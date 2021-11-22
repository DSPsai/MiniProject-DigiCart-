import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}
const Checkout = () => {
    const history = useNavigate();
    useEffect(() => {
        ordernow()
    }, [])
    async function ordernow() {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

        if (!res) {
            alert('Payment not available, Please try after sometime ')
            return
        }
        const options = {
            key: 'rzp_test_3r5Po5gAZZcS5J',
            amount: '100000',
            currency: 'INR',
            name: 'testName',
            description: 'nothing but a fake money transfer',
            image: 'http://localhost:3000/static/images/user-profile.png',
            order_id: localStorage.getItem('razorpay_id'),
            handler: function (response) {
                var postdat = {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    ShopID: localStorage.getItem('merchant_uid'),
                    ShopName: localStorage.getItem('mercShop_name')
                }
                document.getElementsByClassName('loaderbap')[0].style.display='flex';
                axios.post(`${process.env.REACT_APP_API_URL1}/api/User/isOrderComplete`, postdat, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(response => {
                    document.getElementsByClassName('loaderbap')[0].style.display='none';
                    console.log(response)
                    alert('order received')
                    history('/')
                }).catch(error => {
                    document.getElementsByClassName('loaderbap')[0].style.display='none';
                    console.log(error)
                    alert(error)
                    history('/')
                })
            },
            theme: {
                color: "#3399cc"
            }
        }
        const paymentObject = new window.Razorpay(options)
        paymentObject.open()
    }
    return (
        <div className='payment addmercitem'><br />
            <button
                target="_blank"
                rel="noopener noreferrer" onClick={()=>history(-1)} className='btn--outline'>Go Back</button>
        </div>
    )
};

export default Checkout;