import { stripe } from '@/src/lib/stripe'
import { ImageContainer, ProductContainer, ProductDetails } from '@/src/styles/pages/product'
import axios from 'axios'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Stripe from 'stripe'


interface ProductProps {
  product: {
    id: string,
    name: string,
    imageUrl: string,
    price: string,
    description: string,
    defaultPriceId: string
  }
}


export default function Product({product}: ProductProps) {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)

  const {isFallback} = useRouter()
  if (isFallback) {
    return <p>Loading ...</p>
  }

  async function handleBuyProduct() {
    try {
      setIsCreatingCheckoutSession(true)

      const response = await axios.post('/api/checkout', {
        priceId: product.defaultPriceId
      })

      const {checkoutUrl} = response.data;

      window.location.href = checkoutUrl

    }catch (err){
      setIsCreatingCheckoutSession(false)
      alert(err)
      //Conectar com (datadog ou Sentry)
    }
  }

  return (
    <>
      <Head>
        <title>{product.name}|{product.price}</title>
      </Head>

      <ProductContainer>
        <ImageContainer>
          <Image
            src={product.imageUrl} alt={"imagem do produto " + product.name}
            width={520}
            height={480}
          />
        </ImageContainer>

        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{product.price}</span>
          <p>{product.description}</p>

          <button onClick={handleBuyProduct} disabled={isCreatingCheckoutSession}>
            Comprar agora
          </button>
        </ProductDetails>

      </ProductContainer>
    </>
  )
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: true
    //fallback: true // permite passsa um UseRouter que espera um Fallback enquanto carrega, é mais elegante colocar um skelleton, fica mais bonito

    // fallback: 'blocking'
    //(Não exibe nada até a página terminar de carregar, pro usuário é ruim não ver nada , mas se for rapidinho ta safe)
  }
}

export const getStaticProps : GetStaticProps<any, {id: string}> = async ({params} : any) => {
  const productId = params.id

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price']
  })

  const price = product.default_price as Stripe.Price


  return {
    props:{
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format((price.unit_amount || 0) / 100),
        description: product.description,
        defaultPriceId: price.id
      }
    },
    revalidate: 60 * 60 * 1,
  }
}
