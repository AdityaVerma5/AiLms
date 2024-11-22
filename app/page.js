"use client"

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

const LandingPage = () => {
  const router = useRouter();
  const {isSignedIn} = useUser();

  useEffect(() => {
    if (isSignedIn) {
      router.push('/dashboard');
    }
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="p-4 flex justify-end">
        <Link href="/sign-in">
          <Button variant="ghost">Sign In</Button>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          <span>AI-Powered</span>{' '}
          <span className="text-blue-600">Study Material</span>
          <br />
          <span>Generator</span>
        </h1>
        
        <p className="mt-6 text-xl text-muted-foreground max-w-3xl mx-auto">
          Your AI Study Companion: Create comprehensive study materials powered by Gemini AI. 
          Transform your learning experience with intelligent content generation.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link href="/sign-up">
            <Button className="h-12 px-6 text-lg">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Button variant="outline" className="h-12 px-6 text-lg">
            <Play className="mr-2 h-5 w-5" />
            Watch video
          </Button>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <p className="text-sm font-medium text-muted-foreground mb-6">
            FEATURED IN
          </p>
          <div className="flex justify-center items-center gap-12 grayscale opacity-50">
            {/* YouTube */}
            <div className="flex items-center gap-2">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="text-lg font-medium">YouTube</span>
            </div>

            {/* Product Hunt */}
            <div className="flex items-center gap-2">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.604 8.4h-3.405V12h3.405c.995 0 1.801-.806 1.801-1.801 0-.995-.806-1.799-1.801-1.799zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.801V6h5.803c2.407 0 4.199 1.791 4.199 4.199 0 2.407-1.792 4.201-4.199 4.201z"/>
              </svg>
              <span className="text-lg font-medium">Product Hunt</span>
            </div>

            {/* Reddit */}
            <div className="flex items-center gap-2">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
              </svg>
              <span className="text-lg font-medium">Reddit</span>
            </div>
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="mt-20 pb-20">
          <h2 className="text-2xl font-bold mb-6">Powered by Modern Tech Stack</h2>
          <div className="flex flex-wrap justify-center gap-6 text-muted-foreground">
            <span>Next.js</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>Stripe</span>
            <span>•</span>
            <span>Inngest</span>
            <span>•</span>
            <span>Neon DB</span>
            <span>•</span>
            <span>Clerk Auth</span>
            <span>•</span>
            <span>Gemini AI</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;

