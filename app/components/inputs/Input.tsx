import React, { ReactHTMLElement } from 'react'


interface InputProps {
    placeholder: string,
    disabled: boolean,
    type: any,
    register: any,
    title: string,
    id: string,
    Logo?: any
}
export default function Input({
    placeholder,
    disabled,
    type,
    register,
    title,
    id,
    Logo
}: InputProps) {
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{title}</label>
        <div className="flex">
            {Logo && (
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                    {<Logo width={4} height={4} className="w-4 h-4 text-gray-500 dark:text-gray-400"/>}
                </span>
            )}
            <input disabled={disabled} type={type} {...register(id, { required: true })} id="website-admin" className="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeholder}/>
        </div>
    </div>
  )
}
