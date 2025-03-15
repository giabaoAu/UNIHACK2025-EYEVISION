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


      {/* <div className='flex flex-wrap justify-center gap-10 mt-8'>

        <div className='flex flex-col items-center text-center'>
          <p className='text-lg font-semibold'>Bao Au</p>
          <Link href='https://www.linkedin.com/in/bao-au-84bb41229/' className="text-sm text-blue-400 hover:opacity-80 transition-opacity">LinkedIn</Link>
          <p className='text-sm mt-2'>Phone: 123-456-7890</p>
          <p className='text-sm'>Email: bao.au@example.com</p>
        </div>


        <div className='flex flex-col items-center text-center'>
          <p className='text-lg font-semibold'>Rachel Ho</p>
          <Link href='https://www.linkedin.com/in/ngoc-thanh-uyen-ho/' className="text-sm text-blue-400 hover:opacity-80 transition-opacity">LinkedIn</Link>
          <p className='text-sm mt-2'>Phone: 234-567-8901</p>
          <p className='text-sm'>Email: uyen.ho@example.com</p>
        </div>

        
      </div>
      <div className='flex flex-wrap justify-center gap-10 mt-8'>

        <div className='flex flex-col items-center text-center'>
          <p className='text-lg font-semibold'>Hayden Ngo</p>
          <Link href='https://www.linkedin.com/in/haydenngo/' className="text-sm text-blue-400 hover:opacity-80 transition-opacity">LinkedIn</Link>
          <p className='text-sm mt-2'>Phone: 345-678-9012</p>
          <p className='text-sm'>Email: hayden.ngo@example.com</p>
        </div>


        <div className='flex flex-col items-center text-center'>
          <p className='text-lg font-semibold'>Minh Nguyen</p>
          <Link href='https://www.linkedin.com/in/minh-nguyen-26602a2bb/' className="text-sm text-blue-400 hover:opacity-80 transition-opacity">LinkedIn</Link>
          <p className='text-sm mt-2'>Phone: 456-789-0123</p>
          <p className='text-sm'>Email: minh.nguyen@example.com</p>
        </div>    
      </div> */}


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

    </div>
  )
}

export default Footer