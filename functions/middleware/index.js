
class Middleware {
	async decodeToken(req, res, next) {
						const admin = require('../config/firebase-config');
		try {
			const token = req.headers.authorization.split(' ')[1];
			if (token.length == 0) {
				return res.json({ message: 'Un authorize' });
			}
			else {
				try {
					const decodeValue = await admin.auth().verifyIdToken(token);
					if (decodeValue) {
						req.user = decodeValue;
						const db = await admin.firestore().collection('Users').where('uid', '==', req.user.uid).get();
						if (db.empty){
							console.log(req.user)
							await admin.firestore().collection('Users').doc(req.user.uid).set({
								uid:req.user.uid,
								mail:req.user.email,
							});
							return next();
						}
						else {
							return next();
						}
					}
					return res.json({ message: 'Un authorize' });
				} catch (e) {
					console.log(e)
					return res.json({ message: 'Token Expired' });
				}
			}
		}
		catch (e) {
			console.log(e)
			return res.json({ message: 'Token Invalid' });
		}

	}
}

module.exports = new Middleware();
