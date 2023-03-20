import type { AppProps } from 'next/app'
import { globalStyles } from '../styles/global'

import { Container, Header } from '../styles/pages/app'
import logoImg from '../assets/logo_ignite_shop.svg'

globalStyles()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Container>
        <Header>
          <img src={logoImg.src} alt="Logo_da_página"/>
        </Header>
        <Component {...pageProps} />
      </Container>

    </>
  )
}
