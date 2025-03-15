import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

const Navbar = () => {
  return (
    <header className='px-5 py-5 bg-transparent'>
      <nav className='flex items-center justify-center'>
        <Link href='/'> 
          <Image className='rounded-xl bg-amber-50 bg-transparent' src='/finalLogo.png' alt='logo-img' width={200} height={100} />
        </Link>
      </nav>
    </header>
  )
}

export default Navbar

