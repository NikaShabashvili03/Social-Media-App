'use client';


import { useEffect, useState } from "react";

import { MdDriveFileRenameOutline, MdEmail } from "react-icons/md";

import Modal from "../Modal";
import useNewPostModal from "@/app/hooks/useNewPostModal";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Input from "../inputs/Input";
import ImageUpload from "../inputs/ImageUpload";
import axios from "axios";
import toast from "react-hot-toast";
import { CiCircleRemove } from "react-icons/ci";

interface NewPostModalProps {}

const NewPost = ({}: NewPostModalProps) => {  
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const [image, setImage] = useState<any>([]);
  const { 
    register, 
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
        defaultValues: {
          title: '',
        },
  });

  const {
    isOpen,
    onClose
  } = useNewPostModal();

  const onSubmit:SubmitHandler<FieldValues> = (data) => {
    setLoading(true);
    if(image.length <= 0){
      return toast.error('Please set image');
    }
    axios.post('/api/posts/add', {
        title: data.title,
        images: image,
    }).then(() => {
        toast.success('Post is Added!');
        router.refresh();
        reset();
        setImage([])
        onClose();
        setLoading(false);
    }).catch(() => {
        toast.error('Somethis went wrong');
        setLoading(false);
        reset();
        setImage([])
    })
  }

  let bodyContent = (
        <div className="flex relative flex-col justify-center gap-5">
            <button className="z-20 rounded-full bg-white top-0" onClick={() => {setImage([])}}><CiCircleRemove fill="black" size={30}/></button>
            <ImageUpload value={image} onChange={setImage} maxFiles={5}/>
            <Input 
                placeholder="Title"
                disabled={isLoading}
                type="text"
                register={register}
                title="Title"
                id="title"
                Logo={MdDriveFileRenameOutline}
            />
        </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      title={'New Post'}
      onClose={onClose}
      body={bodyContent}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel="Send"
    />
  );
}

export default NewPost;
