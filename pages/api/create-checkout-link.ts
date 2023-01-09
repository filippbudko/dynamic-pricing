import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {contractID, price} = req.body;
  const checkoutLink = await getCheckoutLink(contractID, price);
  res.status(200).json({ checkoutLink })
}

//create checkout link intent
const getCheckoutLink = async (
  contractID: string,
  price: string
) => {
  try {
    const options = {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAPER_API_KEY}`,
      },
      body: JSON.stringify({
        quantity: 1,
        metadata: {},
        expiresInMinutes: 30,
        contractArgs: {
          tokenId: "0",
        },
        contractId: contractID,
        title: "Sassy Riven",
        imageUrl: "https://ayirprah.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Friven.18bfe504.png&w=750&q=75",
        twitterHandleOverride: "papercheckout",
        mintMethod: {
          "name": "mintTo",
          "args": {
            "recipient": "$WALLET",
            "quantity": "$QUANTITY"
          },
          "payment": {
            "value": price + " * $QUANTITY",
            "currency": "ETH"
          }
        },
        eligibilityMethod: {
          "name": "checkClaimEligibility",
          "args": {
            "quantity": "$QUANTITY"
          }
        } 
      }),
    };

    const response = await fetch(
      "https://paper.xyz/api/2022-08-12/checkout-link-intent",
      options
    );
    const jsonResponse = await response.json();
    console.log(jsonResponse.checkoutLinkIntentUrl)
    return jsonResponse.checkoutLinkIntentUrl;
  } catch (e) {
    console.log("error with checkout link api", e);
  }
};