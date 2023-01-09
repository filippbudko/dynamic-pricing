import { useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'

// Put your contract ID here
const contractID = "a97715b8-f7d5-4883-b8e2-2bd52d926fd0";

export default function Home() {

  const [price, setPrice] = useState('');

  function openCheckoutLink() {
    if( Number(price) > 0.01 || Number(price) < 0 || isNaN(Number(price))) {
      alert("Prices are in ETH and can be a maximum of 0.01000 ETH!");
    } else {
      fetchCheckoutLink(contractID, price).then(
        (checkoutLink) => {
          console.log(checkoutLink)
          window.open(checkoutLink, "_blank");
      }).catch(e => console.log(e));
    }
  };

  return (
    <div className='bg-gray-700 h-screen w-screen text-white flex justify-center items-center'>
      <div className='max-w-md p-10'>
        <img src="https://ayirprah.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Friven.18bfe504.png&w=750&q=75" className='border border-white rounded-full'></img>
      </div>
      <div className='max-w-md'>
        <h1 className='font-bold text-xl'>Sassy Riven NFT (Pay What You Want Example) </h1>
        <p className='py-4'>Enter in a price you would like to pay for this NFT. Prices are in ETH and can be a maximum of 0.01000 ETH:</p>
        <label>
          <input className='border border-blue-800 rounded-lg text-black px-2 py-1' type="text" value={price} onChange={(e) => {setPrice(e.target.value)}}/>     
        </label>
        <button className='rounded-full border border-white px-4 py-1 m-1' onClick={openCheckoutLink}>purchase</button>
      </div>
    </div>
  )
}

export const fetchCheckoutLink = async (
  contractID: string,
  price: string
) => {
  try {
    const checkoutLinkResp = await fetch("/api/create-checkout-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contractID, price }),
    });
    return (await checkoutLinkResp.json()).checkoutLink;
  } catch (e) {
    console.log("error fetching the checkout link", e);
  }
};