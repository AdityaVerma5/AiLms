"use client"

import React, { useEffect, useState } from 'react'
import SelectOption from './_components/SelectOption'
import { Button } from '@/components/ui/button';
import TopicInput from './_components/TopicInput';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function Create() {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState([]);
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [canCreate, setCanCreate] = useState(true); // false when at free limit
    const router = useRouter();

    useEffect(() => {
        if (!user?.primaryEmailAddress?.emailAddress) return;
        axios.get(`/api/credits?createdBy=${encodeURIComponent(user.primaryEmailAddress.emailAddress)}`)
            .then((res) => {
                const { used, limit } = res.data ?? {};
                setCanCreate(limit == null || used < limit);
            })
            .catch(() => setCanCreate(true));
    }, [user]);
    const handleUserInput = (fieldName, fieldValue) => {    
        setFormData(prev=>({
            ...prev,
            [fieldName]: fieldValue
        }))
        
    }
    console.log('formData',formData);   
    // used to save user input and generate course outline using AI
    const GenerateCourseOutline = async () => {
        const courseId = uuidv4();
        setLoading(true);
        try {
            await axios.post('/api/generate-course-outline', {
                courseId,
                ...formData,
                createdBy: user?.primaryEmailAddress?.emailAddress,
            });
            router.replace('/dashboard');
            toast("Course content being generated, click on Refresh button");
        } catch (err) {
            const raw = err.response?.data?.error ?? err.response?.data?.message ?? err.message ?? "Failed to generate course outline";
            const msg = typeof raw === "string" ? raw : (raw?.message ?? raw?.code ?? JSON.stringify(raw));
            toast.error(msg);
            if (err.response?.status === 403) setCanCreate(false);
        } finally {
            setLoading(false);
        }
    }


  return (
    <div className='flex flex-col items-center p-5 md:px-24 lg:px-36 mt-20'>
        <h2 className='font-bold text-4xl text-primary'>Start Building Your Personal Study Material</h2>
        <p className='text-gray-500 text-lg'>Fill all details to generate</p>

        <div className='mt-10'>
        {step==0 ? <SelectOption selectedStudyType={(value)=>handleUserInput('studyType',value)}/> 
        : <TopicInput setTopic={(value)=>handleUserInput('topic',value)}
        setDifficultyLevel={(value)=>handleUserInput('difficultyLevel',value)}/>}  
        </div>

        <div className='flex justify-between w-full mt-32'>
                { step!=0 ? <Button variant='outline' onClick = {()=>{setStep(step-1)}}>Previous</Button> : '-'}
                {step==0 ?<Button onClick = {()=>{setStep(step+1)}}>Next</Button> 
                : <Button onClick={GenerateCourseOutline} disabled={loading || !canCreate}>{loading ? <Loader className='animate-spin h-5 w-5 text-white'/> : canCreate ? 'Generate' : 'No credits left — upgrade to continue'}</Button>}
        </div>

    </div>
  )
}

export default Create