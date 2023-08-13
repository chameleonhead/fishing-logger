import React from 'react';
import { Dialog } from '@headlessui/react'
import IconButton from './IconButton';
import { XMarkIcon } from '@heroicons/react/20/solid';

export type ModalProps = React.PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  className?: string
  size?: "sm" | "md" | "lg" | "full";
  color?: "primary" | "secondary" | "default";
  title?: string | React.ReactNode;
}>

export const Modal = ({ open = false, onClose, className, size = "md", color = "default", title, children }: ModalProps) => {
  const colors = {
    default: "bg-gray-500 text-white",
    primary: "bg-blue-500 text-white",
    secondary: "bg-orange-500 text-white"
  }
  const sizes = {
    sm: "max-w-1/3 w-1/3 rounded shadow-lg my-8",
    md: "max-w-1/2 w-1/2 rounded shadow-lg my-8",
    lg: "max-w-3/4 w-3/4 rounded shadow-lg my-8",
    full: "max-w-full w-full",
  }
  const titleClassList = [
    "p-4 flex items-center justify-between border-b border-gray-200",
    colors[color || "default"],
  ]
  const panelClassList = [
    "mx-auto bg-white",
    sizes[size || "md"],
  ]
  if (className) {
    panelClassList.push(className);
  }

  return (
    <Dialog open={open} onClose={onClose}
      className="relative z-50">
      <div className="fixed inset-0 backdrop-blur-sm bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-start justify-center overflow-auto">
        <Dialog.Panel className={panelClassList.join(" ")}>
          <div className={titleClassList.join(" ")}>
            <Dialog.Title as='h2'>{title}</Dialog.Title>
            {onClose ? (<IconButton onClick={onClose} tabIndex={-1}><XMarkIcon className='text-white' /></IconButton>) : null}
          </div>
          <div className="overflow-auto max-h-full">
            <div className="p-4">
              {children}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

export default Modal;