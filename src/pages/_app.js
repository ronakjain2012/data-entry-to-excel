import { AppProps } from 'next/app'
import '@/styles/indexTailwind.css';
import '@/styles/custom.scss';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}