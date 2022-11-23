import Container from '@mui/material/Container';
import Header from '../components/Header';
import Link from 'next/link';

export default function Furniture() {
  return(
    <Container maxWidth='false'>
      <Header />
      Furniture
      🚧 Under construction
      {/* TODO: remove this and link to anthonybench customer furnishing external site */}
    </Container>
  )
}