import axios from 'axios';
import {React, useState} from 'react'
import { IoClose } from "react-icons/io5";
import { toast } from 'react-toastify';

const DeleteModal = ({title,onClose,onDelete,Children}) => {
  

  const handleDeleteplan = async () => {
    try {
      const response = await axios.delete(onDelete);
      const responseData = response.data;
      toast.success(`${title} Deleted Successfully`)
      onClose()
     
    } catch (error) {
      console.log(error);
    }
  };
  
  return (
    <>

    <div className=' font-extralight fixed inset-0 flex justify-center  items-center backdrop-blur-sm '>
        <div className='mx-2 bg-gradient-to-b from-[#110038] to-[#08006B] lg:w-2/5 md:w-2/4   h-96  '>
    <button onClick={onClose}  className='grid place-self-end'><IoClose className='size-[24px]' /></button>
    <div className='grid justify-center gap-6'>
        <p className='text-center my-6'>Delete {title}</p>
        <p className='h-40 '>Are you sure you want to delete this {title}</p>
        </div>
    <div className='flex justify-around'>
        <button className=' text-white bg-gradient-to-r from-[#3D03FA] to-[#A71CD2] px-4 py-2 ' onClick={()=>handleDeleteplan()}>Delete {title}</button>
        <button onClick={onClose}className='text-black bg-white px-10 py-2'>Cancel</button>
        </div>
       
    </div>
    </div>
    {Children}
    </>
  )
}

export default DeleteModal