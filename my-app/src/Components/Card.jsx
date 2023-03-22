import React , { useEffect, useState } from 'react'
import axios from 'axios';
import "../style/Card.css"

const CACHE_NAME = "api-fronted";
const url = "https://saya.net.in/api/jam2-trade/full";

const fetchData = async () => {
    try {
      const res = await axios.get(url);
      if (res.status === 200) {
        const data = res.data;
        //console.log(data,"data")
        const cache = await caches.open(CACHE_NAME);
        cache.put(url, new Response(JSON.stringify(data)));
        return data;
      } else {
        console.log('Failed to retrieve data from API');
      }
    } catch (err) {
      console.log('Error from API', err);
    }
  };
  

export const Card = () => {
    const [data, setData] = useState([]);
  
    useEffect(() => {
        caches.open(CACHE_NAME).then(cache => {
          cache.match(url).then(res => {
            if (res) {
              const cacheTime = new Date(res.headers.get('date')).getTime();
              const currentTime = new Date().getTime();
              //calcualate time
              const timeDiff = currentTime - cacheTime;
              // 1 day in milliseconds
              const cacheDuration = 24 * 60 * 60 * 1000; 
              if (timeDiff > cacheDuration) {
                fetchData().then(data => setData(data));
              } else {
                res.json().then(data => {
                  setData(data);
                  console.log(data);
                });
              }
            } else {
              fetchData().then(data => setData(data));
            }
          });
        });
      }, []);
      
    

  
  return (
    <div className='div'>
        {data.data?.map((el)=>{
            return <div  key={el.id}>
               <p><b>Name</b>:{el.name}</p>
               <p><b>DrugCode</b>:-{el.drugCode}</p>
               <p><b>Price</b>:-{el.method === "Tablet/Capsule" ? Number(el.price)* Number(el.trade ? (el.trade.packet_digit) : (el.packet_digit)) : (el.price)} </p>
               <p><b>Packet</b>:{el.Packet}</p>
               <p><b>Packet Digit</b>:-{el.trade ? (el.trade.packet_digit) : (el.packet_digit)}</p>
                </div>
        })}
      
    </div>
  )
}
