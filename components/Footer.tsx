import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils';


import localFont from "next/font/local";

const calFont = localFont({
  src: "../public/fonts/CalSans-SemiBold.woff2",
});

const Footer = () => {
  return (
    <div className='flex flex-col items-center gap-5 mx-auto pt-20 py-5 px-2 bg-black text-white'>
      <h4 className={cn('text-xl mx-auto', calFont.className)}>OUR CONTRIBUTOR</h4>
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

      <div className='mt-10'>
        <p className='text-sm'>&copy; {new Date().getFullYear()} EYEVISION. All rights reserved.</p>
      </div>

      {/* <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">

          <div className="flex space-x-4">
            <Link href="https://facebook.com" passHref>
              <a target="_blank" className="text-white hover:text-gray-400">
                <FaFacebook size={20} />
              </a>
            </Link>
            <Link href="https://twitter.com" passHref>
              <a target="_blank" className="text-white hover:text-gray-400">
                <FaTwitter size={20} />
              </a>
            </Link>
            <Link href="https://instagram.com" passHref>
              <a target="_blank" className="text-white hover:text-gray-400">
                <FaInstagram size={20} />
              </a>
            </Link>
          </div>
        </div>
      </div> */}
      
    </div>
  )
}

export default Footer