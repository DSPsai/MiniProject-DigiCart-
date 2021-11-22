import React, { useState, useRef,useEffect } from "react";
import useSwr from "swr";
import GoogleMapReact from "google-map-react";
import Custmar from "./Custmar";
import useSupercluster from "use-supercluster";
const fetcher = (...args) => fetch(...args).then(response => response.json());
const Marker = ({ children }) => children;

export default function Map() {
	const mapRef = useRef();
	const [bounds, setBounds] = useState(null);
	const [zoom, setZoom] = useState(10);
const markerimg =require('./marker.png')
const [shopList,setShopList]=useState()
	const url ="http://localhost:5000/api/locs";
	const { data, error } = useSwr(url, { fetcher });
	const crimes = data && !error ? data.slice(0, 2000) : [];
	const points = crimes.map(crime => ({
		type: "Feature",
		properties: { cluster: false,data: { cluster: false, crimeId: crime.ShopUID,crimeName: crime.name, category: crime.category }, crimeId: crime.id,crimeName: crime.name, category: crime.category },
		
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
	useEffect(async() => {
		db.collection("MerchantList").onSnapshot((snapshot) => {
            setShopList(snapshot.docs.map((doc) => ({
                name: doc.data().ShopName,
                ShopUID: doc.data().uid,
                type: doc.data().ShopType,
                img:doc.data().ShopImage
            })
            ))
		})
		console.log('executed')
		mapRef.current.panTo({ lat: 17.3850, lng: 78.4867 });
	}, [])
	return (<div><div style={{ height: "calc(100vh - 100px)", width: "100%" }}>
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
				// console.log(cluster)
				const [longitude, latitude] = cluster.geometry.coordinates;
				const {
					cluster: isCluster,
					data: cdata,
					point_count: pointCount
				} = cluster.properties;
				if (isCluster) {
					return (
						<Marker
							key={`cluster-${cluster.id}`}
							lat={latitude}
							lng={longitude}
						>{()=>{setShopList(supercluster.getLeaves(cluster.id))}}
						{console.log(supercluster.getLeaves(cluster.id))}
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
							>
								{/* {console.log(cluster)} */}
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