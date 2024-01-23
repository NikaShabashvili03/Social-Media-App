'use client';


import { useEffect, useState } from "react";

import { MdDriveFileRenameOutline, MdEmail } from "react-icons/md";

import Modal from "../Modal";
import useEditModal from "@/app/hooks/useEditModal";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "../inputs/Input";
import ImageUpload from "../inputs/ImageUpload";
import axios from "axios";
import toast from "react-hot-toast";
import { CiCircleRemove } from "react-icons/ci";
import { SafeUser } from "@/app/types";

interface EditModalProps {
  currentUser: SafeUser | null
}
const EditModal = ({
  currentUser
}: EditModalProps) => {  
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const [image, setImage] = useState<any>(currentUser?.avatarUrl || '');
  const { 
    register, 
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
        defaultValues: {
          email: currentUser?.email,
          firstName: currentUser?.firstName,
          lastName: currentUser?.lastName
        },
  });

  const {
    isOpen,
    onClose
  } = useEditModal();

  const onSubmit:SubmitHandler<FieldValues> = (data) => {
    setLoading(true);
    if(image.length <= 0){
      return toast.error('Please set image');
    }
    axios.post('/api/user/update', {
        userId: currentUser?.id,
        firstName: data.firstName,
        lastName: data.lastName,
        image: image,
        email: data.email,
    }).then(() => {
        toast.success('Profile is Updated!');
        router.refresh();
        onClose();
    }).catch(() => {
        toast.error('Somethis went wrong');
    })
  }

  let bodyContent = (
        <div className="flex flex-col justify-center gap-5">
            <div className="flex relative justify-center items-center">
                <ImageUpload profile value={image} onChange={setImage} maxFiles={1}/>
                <button className="absolute right-[25%] top-0" onClick={() => {setImage(null)}}><CiCircleRemove fill="black" size={30}/></button>
            </div>
            <Input 
                placeholder="Name"
                disabled={isLoading}
                type="text"
                register={register}
                title="First Name"
                id="firstName"
                Logo={MdDriveFileRenameOutline}
            />
            <Input 
                placeholder="LastName"
                disabled={isLoading}
                type="text"
                register={register}
                title="Last Name"
                id="lastName"
                Logo={MdDriveFileRenameOutline}
            />
            <Input 
                placeholder="Email"
                disabled={isLoading}
                type="email"
                register={register}
                title="Email"
                id="email"
                Logo={MdEmail}
            />
        </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      title={'Edit Profile'}
      onClose={onClose}
      body={bodyContent}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel="Send"
    />
  );
}

export default EditModal;
