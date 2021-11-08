import React, { useState, useRef,useEffect } from "react";
// import useSwr from "swr";
import GoogleMapReact from "google-map-react";
import Custmar from "../Components/Custmar";
import useSupercluster from "use-supercluster";
import { useNavigate } from "react-router-dom";
import '../Components/Home.css'
import { db, storage } from '../Resources/firebase';
import { collection, query, where, getDocs } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const fetcher = (...args) => fetch(...args).then(response => response.json());
const Marker = ({ children }) => children;
export default function Shops() {
    const history = useNavigate();
    // console.log(Map.shopList)
    const Map = () => {
        const mapRef = useRef();
        const [bounds, setBounds] = useState(null);
        const [zoom, setZoom] = useState(10);
        const [ShopList, setShopList] = useState([])
        let shop = [];
    useEffect(async () => {
       db.collection("MerchantList").onSnapshot((snapshot) => {
            setShopsList(snapshot.docs.map((doc) => ({
                ShopName:doc.data().ShopName,
                ShopUID:doc.data().uid,
                category:doc.data().ShopType,
                image:doc.data().ShopImage,
                location:{
                    longitude:doc.data().Location[1],
                    latitude:doc.data().Location[0]
                }
            })
            ))
        })
    }, [])
        const [ShopsList,setShopsList] =  useState([]);
        const points = ShopsList.map(singleshop => ({
            type: "Feature",
            properties: { 
                cluster: false, 
                ShopUID: singleshop.ShopUID, 
                ShopName: singleshop.ShopName, 
                ShopCat: singleshop.category, 
                image: singleshop.image },
            geometry: {
                type: "Point",
                coordinates: [
                    parseFloat(singleshop.location.longitude),
                    parseFloat(singleshop.location.latitude)
                ]
            }
        }));
        const { clusters, supercluster } = useSupercluster({
            points,
            bounds,
            zoom,
            options: { radius: 175, maxZoom: 30 }
        });
        function fun(id) {
            shop = supercluster.getLeaves(id);
            return <></>
        }
        function fun2(clu) {
            shop.push(clu)
            // const html=()=>{
            //     <pre>{JSON.stringify(shop, null, 2)}</pre>
            // }
            // document.getElementsByClassName('shoplistmob')[0].innerHTML=<>{}</>;
            return <></>
        }
        // function shopdata(){
        //     return 
        // }
        function lim() {
            // console.log(ShopList)
            setShopList(shop);
        }
        useEffect(() => {
        }, [])
        return (<div className="home">
            {/* <div className='catlabels'>
                <div className='catlabel catlabelactive'>Paharmacy</div>
                <div className='catlabel'>Paharmacy</div>
                <div className='catlabel'>Paharmacy</div>
                <div className='catlabel'>Paharmacy</div>
            </div> */}
            <div className='row'><div><div style={{ height: "calc(100vh - 200px)", width: "100%" }}>
                <GoogleMapReact
                    // bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_KEY }}
                    defaultCenter={{ lat: 17.453480156666696, lng: 78.52981425632895 }}
                    defaultZoom={14}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map }) => {
                        mapRef.current = map;
                        mapRef.current.setZoom(15);
                    }}
                    // options={option}
                    onChange={({ zoom, bounds }) => {
                        lim()
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
                            // data: cdata,
                            point_count: pointCount
                        } = cluster.properties;
                        if (isCluster) {
                            return (
                                <Marker
                                    key={`cluster-${cluster.id}`}
                                    lat={latitude}
                                    lng={longitude}
                                >{fun(cluster.id)}
                                    {/* {console.log(shopList)} */}
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
                                key={`crime-${cluster.properties.ShopUID}`}
                                lat={latitude}
                                lng={longitude}
                            >{fun2(cluster)}
                                <Custmar
                                    name={cluster.properties.ShopName}
                                    category={cluster.properties.ShopCat}
                                    image={cluster.properties.image}
                                    uid={cluster.properties.ShopUID}
                                ></Custmar>
                            </Marker>
                        );
                    })}
                </GoogleMapReact>
            </div>
            </div >
                <div className='shoplistmob'>
                    {/* <pre>{JSON.stringify(ShopList, null, 2)}</pre> */}
                    {ShopList.map(shoper => {
                        return <div onClick={()=>history(`/Shop/${shoper.properties.ShopUID}`)} className='signleshopoflist'>
                            <div className="row">
                            <div className="shopimg">
                                <img src={shoper.properties.image} alt='singleshop' />
                            </div>
                            <div className="shopname">{shoper.properties.ShopName}</div>
                            </div>
                            <div className="shopcat">{shoper.properties.ShopCat}</div>
                        </div>
                    })}
                </div>
            </div>
        </div>
        );
    }
    return (
        <Map />
    )
}
