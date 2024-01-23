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
import useEditPostModal from "@/app/hooks/useEditPostModal";

interface EditPostModalProps {}

const EditPostModal = ({}: EditPostModalProps) => {  
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const [image, setImage] = useState<any>([]);

  const {
    isOpen,
    onClose,
    data,
  } = useEditPostModal();

  const { 
    register, 
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm<FieldValues>({
        defaultValues: {
          title: data.title,
        },
  });

  useEffect(() => {
    reset({
        title: data?.title
    })
    setImage(data?.images);
  }, [isOpen])


  const onSubmit:SubmitHandler<FieldValues> = (submitData) => {
    setLoading(true);
    axios.post('/api/posts/edit', {
        postId: data?.postId,
        title: submitData?.title,
        images: image,
    }).then(() => {
        toast.success('Post is Added!');
        router.refresh();
        reset();
        setImage([])
        setLoading(false);
        onClose();
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
      title={'Updated Post'}
      onClose={onClose}
      body={bodyContent}
      onSubmit={handleSubmit(onSubmit)}
      actionLabel="Send"
    />
  );
}

export default EditPostModal;
