"use client"

import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import CourseCardItem from './CourseCardItem';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { CourseCountContext } from '@/app/_context/CourseCountContext';

function CourseList() {
    const {user} = useUser();
    const [courseList, setCourseList] = useState([]);
    const [loading,setLoading] = useState(false);
    const { totalCourses, setTotalCourses, setCreditLimit } = useContext(CourseCountContext);

    useEffect(()=>{
        user && GetCourseList();
    },[user])

    const GetCourseList = async ()=>{
        if (!user?.primaryEmailAddress?.emailAddress) return;
        setLoading(true);
        const email = user.primaryEmailAddress.emailAddress;
        const [coursesRes, creditsRes] = await Promise.all([
            axios.post('/api/courses', { createdBy: email }),
            axios.get(`/api/credits?createdBy=${encodeURIComponent(email)}`).catch(() => ({ data: { used: 0, limit: 5 } })),
        ]);
        setCourseList(coursesRes.data.result ?? []);
        setTotalCourses(coursesRes.data.result?.length ?? 0);
        setCreditLimit(creditsRes.data?.limit ?? 5);
        setLoading(false);
    }
  return (
    <div className='mt-10'>
        <h2 className='font-bold text-3xl text-primary flex justify-between items-center'>Your Courses
            <Button variant="outline" 
            onClick={()=>{GetCourseList()}}
            className="border-primary text-primary"><RefreshCw/>Refresh</Button>
        </h2>

        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mt-2 gap-5'>
            {loading==false ? courseList?.map((course,index)=>(
                <CourseCardItem course={course} key={index}/>
            )) : [1,2,3,4,5,6].map((item,index)=>(
                <div key={index} className='h-56 w-full bg-slate-200 rounded-lg animate-pulse'>
                </div>
            ))}  
        </div>
    </div>
  )
}

export default CourseList