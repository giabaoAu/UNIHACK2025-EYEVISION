import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <div className='flex flex-col items-center gap-5 mx-auto py-5 px-2 bg-transparent text-white'>
      <h1 className='text-4xl mx-auto'>A BIG THANKS TO OUR CONTRIBUTOR</h1>
      <div className='flex flex-row gap-6'>
        <Link href='https://www.linkedin.com/in/bao-au-84bb41229/'>
          <Image src="/baoau.jpg" alt="contributor-img" className='rounded-4xl' width={100} height={100} />
        </Link>

        <Link href='https://www.linkedin.com/in/ngoc-thanh-uyen-ho/'>
          <Image src="/uyenHo.jpg" alt="contributor-img" className='rounded-4xl' width={100} height={100} />
        </Link>
        <Link href='https://www.linkedin.com/in/haydenngo/'>
          <Image src="/hayden.png" alt="contributor-img" className='rounded-4xl' width={100} height={100} />
        </Link>
        <Link href='https://www.linkedin.com/in/minh-nguyen-26602a2bb/'>
          <Image src="/hminh.jpg" alt="contributor-img" className='rounded-4xl' width={100} height={100} />
        </Link>
      </div>
    </div>
  )
}

export default Footer