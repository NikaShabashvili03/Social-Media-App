'use client'
import Input from '@/app/components/inputs/Input';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function LoginClient() {
    const router = useRouter();
    const [isLoading, setLoading] = useState(false);
    const { 
      register, 
      handleSubmit,
      formState: {
        errors,
      },
    } = useForm<FieldValues>({
          defaultValues: {
            email: '',
            password: ''
          },
    });
    const onSubmit:SubmitHandler<FieldValues> = (data) => {
      setLoading(true)
      signIn('credentials', { 
        ...data, 
        redirect: false,
      })
      .then((callback) => {
        if (callback?.ok) {
          toast.success(":)", {
            style: {
              border: '1px solid blue',
              color: '#713200',
            },
            iconTheme: {
              primary: '#713200',
              secondary: '#FFFAEE',
            },
          })
          router.refresh();
          setLoading(false)
        }
        
        if (callback?.error) {
          toast.error(":(", {
            style: {
              border: '1px solid #000D71',
              color: '#000D71',
            },
            iconTheme: {
              primary: '#000D71',
              secondary: '#FFFAEE',
            },
          })
          setLoading(false)
        }
      });
    }
    return (
      <div className='flex justify-center items-center h-[90vh] sm:h-screen flex-col'>
          <div className='w-full sm:w-2/4 h-full sm:h-auto bg-gray-100 px-5 py-10 rounded-2xl flex flex-col justify-center items-center'>
            <h1 className="text-xl font-bold leading-tight mb-8 tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full md:space-y-6">
              <div>
                <Input
                        id='email'
                        placeholder='Email'
                        title='Email'
                        register={register}
                        disabled={isLoading}
                        type='email'
                    />
              </div>
              <div>
                <Input
                      id='password'
                      placeholder='Password'
                      title='Password'
                      register={register}
                      disabled={isLoading}
                      type='password'
                  />
              </div>
    
              <input disabled={isLoading} className="w-full bg-blue-600 cursor-pointer hover:bg-blue-800 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" type="submit" />
            </form>
            <div className='w-full mt-5 ml-5'>
              <Link href={'/register'}>You dont have account? Register!</Link>
            </div>
          </div>
      </div>
    )
}
