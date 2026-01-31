"use client"

import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import React, { useEffect } from 'react'

function Provider({children}) {

    const {user} = useUser();

    useEffect(() => {
        checkIsNewUser();
    }, [user])

    const checkIsNewUser = async () => {
        if (!user?.primaryEmailAddress?.emailAddress) return;

        try {
            const resp = await axios.post('/api/create-user', {
                user: {
                    fullName: user.fullName ?? '',
                    email: user.primaryEmailAddress?.emailAddress ?? '',
                },
            });
            console.log(resp.data);
        } catch (err) {
            const msg = err.response?.data?.error ?? err.response?.statusText ?? err.message ?? 'Request failed';
            if (err.response?.status === 500) {
                console.warn('create-user (non-blocking):', msg);
            } else {
                console.error('create-user error:', msg);
            }
        }
    }

    return (
        <div>
            {children}
        </div>
    )

}

export default Provider
