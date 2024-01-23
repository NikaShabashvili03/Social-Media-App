'use client'
import Input from '@/app/components/inputs/Input';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function RegisterClient() {
    const router = useRouter();
    const [isLoading, setLoading] = useState(false);
    const { 
      register, 
      handleSubmit,
      control,
      watch,
      formState: {
        errors,
      },
    } = useForm<FieldValues>({
          defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
          },
    });
    
    const onSubmit:SubmitHandler<FieldValues> = async (data) => {
      setLoading(true)
      await axios.post('/api/user/register', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      }).then(() => {
        toast.success("You successfully registered", {
          style: {
            border: '1px solid #000D71',
            color: '#000D71',
          },
          iconTheme: {
            primary: '#000D71',
            secondary: '#FFFAEE',
          },
        })
        router.push('/login')
        setLoading(false)
      }).catch((error) => {
        toast.error("This email address already exists", {
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
      })
  
    }
    return (
      <div className='flex justify-center items-center h-[90vh] sm:h-screen flex-col'>
          <div className='w-full sm:w-2/4 h-full sm:h-auto bg-gray-100 px-5 py-10 rounded-2xl flex flex-col justify-center items-center'>
            <h1 className="text-xl font-bold leading-tight mb-8 tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create a new account
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full md:space-y-6">
            <div>
                <div className='w-full mb-6 relative flex justify-center items-center'>
                </div>
                <div className='flex mb-2 gap-2'>
                  <div className='w-full'>
                    <Input
                        id='firstName'
                        placeholder='first name'
                        title='First Name'
                        register={register}
                        disabled={isLoading}
                        type='text'
                    />
                  </div>
                </div>
                <div className='flex mb-2 gap-2'>
                  <div className='w-full'>
                    <Input
                        id='lastName'
                        placeholder='last name'
                        title='Last Name'
                        register={register}
                        disabled={isLoading}
                        type='text'
                    />
                  </div>
                </div>
            </div>
            <div>
                <Input
                    id='email'
                    placeholder='email'
                    title='email'
                    register={register}
                    disabled={isLoading}
                    type='email'
                />
              </div>
              <div>
              <Input
                    id='password'
                    placeholder='password'
                    title='password'
                    register={register}
                    disabled={isLoading}
                    type='password'
                />
              </div>
      
              <input disabled={isLoading} className="w-full bg-blue-600 cursor-pointer hover:bg-blue-800 text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" type="submit" />
            </form>
            <div className='w-full mt-5 ml-5'>
              <Link href={'/login'}>You have account? Login!</Link>
            </div>
        </div>
      </div>
    )
}
