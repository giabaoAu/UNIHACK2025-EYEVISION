import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

const Navbar = () => {
  return (
    <header className='px-5 py-5 bg-transparent'>
      <nav className='flex items-center justify-center'>
        <Link href='/'> 
          <Image className='rounded-xl bg-transparent fade-in' src='/finalLogo.png' alt='logo-img' width={150} height={80} />
        </Link>
      </nav>
    </header>
  )
}

export default Navbar

