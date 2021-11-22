const express = require('express');
const Razorpay = require('razorpay');
const FieldValue = require('firebase-admin').firestore.FieldValue;
const middleware = require('../middleware');
const router = express.Router()
router.use(middleware.decodeToken)
const admin = require('../config/firebase-config');
const { response } = require('express');
const db = admin.firestore();
const razorpay = new Razorpay({
    key_id: 'rzp_test_3r5Po5gAZZcS5J',
    key_secret: '4b4CTU1KUw116fI6cDeM2DEW'
})
router.route('/AddRecent')
    .post(async (req, res) => {
        const userShop = db.collection('Users').doc(req.user.uid).collection('Recent').doc();
        const saved = await userShop.set({
            ShopName: req.body.ShopName,
            ShopID: req.body.ShopID,
        });
        return res.json(
            saved
        );
    })
router.route('/AddCart')
    .post(async (req, res) => {
        const userShop = db.collection('UserCart').doc(req.user.uid)
        const userAddress = await db.collection('Users').doc(req.user.uid).get()
        const asd = await userShop.get();
        async function gettot(items, shopref) {
            const funer = async () => {
                var totprice = 0;
                console.log(req.body)
                for (let item of items) {
                    let sad = await db.collection('ShopList').doc(shopref).collection('Shop').doc(item.DocId).get()
                    totprice += parseInt(sad.data().itemPrice) * (items.find(element => element.DocId == item.DocId)).itemCount;
                    // console.log(totprice)
                }
                return totprice
            }
            return await funer()
        }
        if (userAddress.data().address != req.body.address) {
            await admin.firestore().collection('Users').doc(req.user.uid).set({
                address: req.body.address,
            }, { merge: true });
        }
        if (!asd.exists) {
            const tot = await gettot(req.body.Items, req.body.ShopRef);
            await userShop.set({
                ShopName: req.body.ShopName,
                ShopRef: req.body.ShopRef,
                Items: req.body.Items,
                TotalPrice: tot,
                Address: req.body.address
            });
        }
        else {
            const tot = await gettot(req.body.Items, req.body.ShopRef);
            await userShop.update({
                ShopName: req.body.ShopName,
                ShopRef: req.body.ShopRef,
                Items: req.body.Items,
                TotalPrice: tot,
                Address: req.body.address
            });
        }
        const pricefetch = await db.collection('UserCart').doc(req.user.uid).get()
        let price = pricefetch.data().TotalPrice
        let options = {
            amount: price * 100,
            currency: "INR",
        }
        razorpay.orders.create(options, (err, order) => {
            // console.log(order)
            res.json(order)
            // console.log(err)
        })
    })
//keyid:rzp_test_3r5Po5gAZZcS5J
//keysec:4b4CTU1KUw116fI6cDeM2DEW
router.route('/isOrderComplete')
    .post(async (req, res) => {
        razorpay.payments.fetch(req.body.razorpay_payment_id).then(async (paymentDocument) => {
            if (paymentDocument.status == 'captured') {
                await admin.firestore().collection('Users').doc(req.user.uid).collection('Recent').doc().set({
                    ShopID: req.body.ShopID,
                    ShopName: req.body.ShopName,
                });
                res.json({ data: 'Payment Successful' })
                const userSh = await db.collection('UserCart').doc(req.user.uid).get()
                var temper = [];
                const order = db.collection('Users').doc(req.user.uid).collection('Orders').doc()
                async function funer() {
                    for await (let i of userSh.data().Items) {
                        const userS = db.collection('ShopList').doc(userSh.data().ShopRef).collection('Shop').doc(i.DocId)
                        const decrement = FieldValue.increment(-parseInt(i.itemCount));
                        const geter = await userS.get()
                        await userS.set({
                            itemCount: decrement,
                        }, { merge: true });
                        temper.push((geter.data().itemName+' of '+ geter.data().itemWeight  + ' - ' + i.itemCount))
                    }
                    // console.log(temper)
                    return temper
                }
                const temp=await funer();
                const del = await order.set({
                    name: req.user.name,
                    no: userSh.data().Items.length,
                    address: userSh.data().Address,
                    items: temp,
                    totalprice: userSh.data().TotalPrice
                })
                const orderm = db.collection('MerchantList').doc(userSh.data().ShopRef).collection('Buffer').doc()
                 await orderm.set({
                    name: req.user.name,
                    no: userSh.data().Items.length,
                    address: userSh.data().Address,
                    items: temp,
                    totalprice: userSh.data().TotalPrice
                })
            }
            else
                res.json({ status: 'Unsuccessful Payment' })
        })

    })
module.exports = router