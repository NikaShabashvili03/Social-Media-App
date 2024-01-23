'use client';

import { useCallback, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel?: string;
  disabled?: boolean;
  customStyle?: boolean,
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  body, 
  actionLabel, 
  disabled,
  customStyle,
  secondaryAction,
  secondaryActionLabel
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }

    secondaryAction();
  }, [secondaryAction, disabled]);
  
  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }
  
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300)
  }, [onClose, disabled]);


    const handleSubmit = useCallback(() => {
        if (disabled) {
            return;
        }

        onSubmit && onSubmit();
        onClose()
        }, [onSubmit, disabled]);


  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className="
          justify-center 
          items-center 
          flex 
          overflow-x-hidden 
          overflow-y-auto 
          fixed 
          inset-0 
          z-50 
          outline-none 
          focus:outline-none
          bg-neutral-800/70
          backdrop-blur      
        "
      >
        <div className={`
    
          relative 
          mt-8
          w-full
          md:w-4/6
          lg:w-3/6 
          ${customStyle ? "xl:w-4/6" : "xl:w-2/6"}
          my-6
          mx-auto 
          p-2
          lg:p-0
          
          `}
        >
          {/*content*/}
          <div 
            style={{borderRadius:"20px"}}
            className={`
            translate
            duration-300
            
            h-full
            ${showModal ? 'translate-y-0' : 'translate-y-full'}
            ${showModal ? 'opacity-100' : 'opacity-0'}
          `}>
            <div 
              style={{borderRadius:"20px"}}
              className="
              translate
              h-min
              border-0 
              shadow-lg 
              relative 
              flex 
              flex-col 
              w-[100%]
              bg-white 
              outline-none 
              focus:outline-none
              rounded-lg

            "
            >
              {/*header*/}
              <div className="
                flex 
                items-center 
                p-6
                rounded-t
                justify-center
                relative
                border-b-[1px]
                "
              >
                <button
                  aria-pressed="false"
                  className="
                    p-1
                    border-0 
                    hover:opacity-70
                    transition
                    absolute
                    right-10
                    top-30
                  "
                  onClick={handleClose}
                >
                  <IoMdClose size={18} />
                </button>
                <div className="text-lg font-semibold">
                  {title}
                </div>
              </div>
              {/*body*/}
              <div className="relative p-6 flex-auto h-full">
                {body}
              </div>
              {onSubmit && (
                <div className="flex flex-col gap-2 p-6">
                  <div 
                    className="
                      flex 
                      flex-row 
                      items-center 
                      gap-4 
                      w-full
                    "
                  >
                    {secondaryAction && secondaryActionLabel && (
                      <button 
                        disabled={disabled} 
                        onClick={handleSecondaryAction}
                      >{secondaryActionLabel}</button>  
                    )}
                    <button 
                      className="inline-block w-full py-3 text-base font-medium leading-normal text-center text-white align-middle transition-colors duration-150 ease-in-out border-0 shadow-none cursor-pointer rounded-2xl bg-primary hover:bg-primary-dark active:bg-primary-dark focus:bg-primary-dark"
                      disabled={disabled} 
                      onClick={onSubmit}
                    >{actionLabel}</button>
                  </div>
                </div>
              )}
            </div>


          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
