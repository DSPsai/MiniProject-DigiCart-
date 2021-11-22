function getitemsofsingleMerchant() {
	const citiesRef = db.collection('ShopList').doc(uid).collection('Shop');
	const snapshot = await citiesRef.get();
	if (snapshot.empty) {
		console.log('No matching documents.');
		return;
	}
	setData(snapshot.docs.map((doc) => ({
		itemName: doc.data().itemName,
		itemWeight: doc.data().itemWeight,
		itemCat: doc.data().itemCat,
		itemBrand: doc.data().itemBrand,
		itemCount: doc.data().itemCount,
		itemPhotoUrl: doc.data().itemPhotoUrl,
	})
	))
}
function getOnlyShopList(){
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
}
function geteItemsOfAllMerchantsResToUId(){
import React, { useEffect, useState } from 'react';
import { db } from './firebase'
export default function ListOfTodo({ token, uid }) {
	var [data, setData] = useState();
	async function fetchData() {
		console.log('uid : ', uid, ' token : ', token)
		async function getMarker() {
			const snapshot = await db.collection('Users').get()
			let uids=[]
			snapshot.docs.map((doc)=>uids.push(doc.id))
			const ref=db.collection('ShopList');
			let shop='';
			let temp=[]
			console.log(uids)
			const getData=async()=>await uids.map(async(id)=>{
				shop = await ref.doc(id).collection('Shop').get()
				await shop.docs.map((shopa)=>{
					 temp=temp.concat(shopa.data())
				})
				setData(temp)
			});
			await getData().then(()=>{});
		}
		await getMarker()
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
}
function mapview(){
	import React, { useState, useRef } from "react";
import useSwr from "swr";
import GoogleMapReact from "google-map-react";
import Custmar from "./Custmar";
import useSupercluster from "use-supercluster";
const fetcher = (...args) => fetch(...args).then(response => response.json());

const Marker = ({ children }) => children;

export default function ListOfTodo() {
	const mapRef = useRef();
	const [bounds, setBounds] = useState(null);
	const [zoom, setZoom] = useState(10);
const markerimg =require('../marker.png')

	const url =
		"http://localhost:5000/api/locs";
	const { data, error } = useSwr(url, { fetcher });
	const crimes = data && !error ? data.slice(0, 2000) : [];
	const points = crimes.map(crime => ({
		type: "Feature",
		properties: { cluster: false, crimeId: crime.id,crimeName: crime.name, category: crime.category },
		geometry: {
			type: "Point",
			coordinates: [
				parseFloat(crime.location.longitude),
				parseFloat(crime.location.latitude)
			]
		}
	}));
	const { clusters, supercluster } = useSupercluster({
		points,
		bounds,
		zoom,
		options: { radius: 175, maxZoom: 30 }
	});
	const option = { minZoom: 15, maxZoom: 20 }
	return (<div><div style={{ height: "calc(100vh - 20px)", width: "100%" }}>
		<GoogleMapReact
			// bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY }}
			defaultCenter={{ lat: 17.453480156666696, lng: 78.52981425632895 }}
			defaultZoom={14}
			yesIWantToUseGoogleMapApiInternals
			onGoogleApiLoaded={({ map }) => {
				mapRef.current = map;
			}}
			// options={option}
			onChange={({ zoom, bounds }) => {
				setZoom(zoom);
				setBounds([
					bounds.nw.lng,
					bounds.se.lat,
					bounds.se.lng,
					bounds.nw.lat
				]);
			}}
		>
			{clusters.map(cluster => {
				const [longitude, latitude] = cluster.geometry.coordinates;
				const {
					cluster: isCluster,
					point_count: pointCount
				} = cluster.properties;

				if (isCluster) {
					return (
						<Marker
							key={`cluster-${cluster.id}`}
							lat={latitude}
							lng={longitude}
						>
							<div
								className="cluster-marker"
								style={{
									width: `${10 + (pointCount / points.length) * 20}px`,
									height: `${10 + (pointCount / points.length) * 20}px`
								}}
								onClick={() => {
									const expansionZoom = Math.min(
										supercluster.getClusterExpansionZoom(cluster.id),
										20
									);
									mapRef.current.setZoom(expansionZoom);
									mapRef.current.panTo({ lat: latitude, lng: longitude });
								}}
							>{console.log(cluster)}
								{/* {cluster.properties.crimeName} */}
								{pointCount}
							</div>
						</Marker>
					);
				}

				return (
					<Marker
						key={`crime-${cluster.properties.crimeId}`}
						lat={latitude}
						lng={longitude}
					>
					<Custmar
					 name={cluster.properties.crimeName}
					 category={cluster.properties.category}
					 ></Custmar>
					</Marker>
				);
			})}

		</GoogleMapReact>
	</div></div >
	);
}
}