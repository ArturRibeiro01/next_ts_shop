import { GetServerSideProps } from 'next'
import Link from 'next/link'
import React from 'react'
import Stripe from 'stripe'
import { stripe } from '../lib/stripe'
import Image from 'next/image'
import { ImageContainer, SuccessContainer } from '../styles/pages/success'
import Head from 'next/head'


interface SuccessProps {
  customerName: string,
  product : {
    name: string,
    imageUrl: string
  }
}

export default function Success({customerName, product}: SuccessProps) {
  return (

    <>
      <Head>
        <title>Success | Ignite Shop</title>
        <meta name='robots' content='noindex'/>
      </Head>


      <SuccessContainer>
        <h1>Compra efetuada</h1>

        <ImageContainer>
        <Image
          src={product.imageUrl} alt={"imagem do produto " + product.name}
          width={150}
          height={150}
        />

        </ImageContainer>

        <p>
        <strong>Aeee !!! {customerName}</strong>,sua nova <strong>{product.name}</strong> foi comprada com sucesso e será enviada para o endereço cadastrado
        </p>

        <Link href="/">
          Voltar ao Catálogo
        </Link>

      </SuccessContainer>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({query}) => {

  if(!query.session_id){
    return {
      redirect: {
        destination: "/",
        permanent: false
      }
      // notFound: true
    }
  }

  const sessionId = String(query.session_id)

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: [
      'line_items',
      'line_items.data.price.product'
    ]
  })

  const customerName = session.customer_details?.name;
  const product = session.line_items?.data[0].price?.product as Stripe.Product

  return {
    props: {
      customerName,
      product: {
        name: product.name,
        imageUrl: product.images[0],
      }
    }
  }
}
