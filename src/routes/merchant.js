const express = require('express');
const { app } = require('firebase-admin');
const middleware = require('../middleware');
const router = express.Router()
router.use(middleware.decodeToken)
const admin = require('../config/firebase-config');
const db = admin.firestore();
router.route('/Product')
    .post(async (req, res) => {
        const userShop = db.collection('ShopList').doc(req.user.uid).collection('Shop').doc();
        const saved=await userShop.set({
            itemWeight: req.body.itemWeight,
            itemCount: parseInt(req.body.itemCount),
            itemBrand:req.body.itemBrand,
            itemCat:req.body.itemCat,
            itemName:req.body.itemName,
            itemPrice:req.body.itemPrice,
			itemPhotoUrl: req.body.itemPhotoUrl,
        });
        return res.json(
            saved
        );
    })
    .delete(async (req, res) => {
        const userShop = db.collection('ShopList').doc(req.user.uid).collection('Shop').doc(req.body.docid).delete()
        return res.json(
            {message:'delete Request Processed'}
        );
    })
router.route('/MercAdd')
.post(async(req,res)=>{
    const userShop = db.collection('MerchantList').doc(req.user.uid);
    const saved=await userShop.set({
        Location: req.body.Location,
        MerchantName: req.body.MerchantName,
        uid: req.body.uid,
        ShopType: req.body.ShopType,
        ShopName:req.body.ShopName,
        ShopImage: req.body.ShopImage,
    });
    return res.json(
        saved
    );
})
router.route('/MercBufDel')
.post(async(req,res)=>{
    const orderm =await db.collection('MerchantList').doc(req.user.uid).collection('Buffer').doc(req.body.docid).delete();
    // complete.set(orderm.data());
    return res.json(
        orderm
    );
})
module.exports = router