import Container from '@mui/material/Container';
import Header from '../components/Header';
import Link from 'next/link';

export default function About() {
  return(
    <Container maxWidth='false'>
      <Header />
      About Me
      🚧 Under construction
      {/* TODO: add resume, vanity links and whatever else */}
    </Container>
  )
}