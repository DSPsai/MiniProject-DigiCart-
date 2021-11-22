import React, { useEffect, useState } from 'react';
import { db } from './firebase'
export default function ListOfTodo({ token, uid }) {
	var [data, setData] = useState();
	async function fetchData() {
		let temp=[]
		console.log('uid : ', uid, ' token : ', token)
		const snapshot = await db.collection('MerchantList').get()
		snapshot.docs.map((shopa)=>{
			temp=temp.concat(shopa.data())
	   })
	   setData(temp)
	}
	useEffect(async () => {
		fetchData()
	}, []);
	return (
		<div>
			<div><pre>{JSON.stringify(data, null, 2)}</pre></div>
		</div>
	);
}