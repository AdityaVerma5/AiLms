"use client"

import { CourseCountContext } from '@/app/_context/CourseCountContext'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Image, LayoutDashboard, Menu, Shield, UserCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useContext } from 'react'

function SideBar() {
    const MenuList = [
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: LayoutDashboard
        },
        {
            name: 'Upgrade',
            path: '/dashboard/upgrade',
            icon: Shield
        },
        {
            name: 'Profile',
            path: '/dashboard/profile',
            icon: UserCircle
        }
    ]
    const {totalCourse,setTotalCourse} = useContext(CourseCountContext);
    const path = usePathname();
  return (
    <div className='h-screen shadow-md p-5'>
        <div className='flex gap-2 items-center'>
            <Image src={'/logo.svg'} alt='logo' width={40} height={40}/>
            <h2 className='font-bold text-2xl'>Study.ai</h2>
        </div>

        <div className='mt-10'>
            <Link href={'/create'} className='w-full'>
            <Button className='w-full'>Create New</Button>
            </Link>

            <div className='mt-5'>
                {MenuList.map((menu, index) => (
                    <div key={index} className={`flex gap-5 items-center p-3 hover:bg-gray-100 rounded-md mt-3 ${path == menu.path && 'bg-gray-200'}`}>
                        <menu.icon/>
                        <h2>{menu.name}</h2>
                    </div>
                ))}
            </div>
        </div> 
        <div className='border p-3 bg-slate-100 rounded-md absolute bottom-10 w-[85%]'>
           <h2 className='text-lg mb-2'>Available Credits : 5</h2>
           <Progress value={30}/>
           <h2 className='text-sm'>{totalCourse} out of 5 Credits Used</h2> 

           <Link href={'dashboard/upgrade'} className='text-primary text-xs mt-3'>Upgrade to unlock more credits</Link>
        </div>

    </div>
  )
}

export default SideBar