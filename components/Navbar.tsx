import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

const Navbar = () => {
  return (
    <header className='px-5 py-10 bg-[#BBE5ED]'>
      <nav className='flex'>
        <Link href='/'>
          <Image className='rounded-xl' src='/logo.jpg' alt='logo-img' width={70} height={70} />
        </Link>
      </nav>
    </header>
  )
}

export default Navbar

