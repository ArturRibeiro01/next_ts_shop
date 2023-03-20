import { stripe } from '@/src/lib/stripe';
import { NextApiRequest, NextApiResponse} from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { priceId } = req.body

  const cancelUrl = `${process.env.NEXT_URL}/`;
  const successUrl = `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`;


  if(req.method != 'POST') {
    return res.status(405).json({
      error: 'Método não permitido'
    })
  }

  if(!priceId){
    return res.status(400).json({
      error: 'Preço não permitido'
    })
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    cancel_url: cancelUrl,

    success_url: successUrl,

    line_items:[
      {
        price: priceId,
        quantity: 1
      }
    ]
  })

  return res.status(201).json({
    checkoutUrl: checkoutSession.url
  })

}
