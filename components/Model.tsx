"use client"
import { addUserEmailToProduct } from '@/lib/actions';
import { Description, Dialog, DialogPanel, DialogTitle, Transition } from '@headlessui/react'
import { FormEvent, Fragment, useState } from 'react'

interface Props {
    productId: string;
}

const Model = ({productId}: Props) => {
    let [isOpen, setIsOpen] = useState(false);
    const [isSubmtting, setIsSubmtting] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmtting(true);

        await addUserEmailToProduct(productId, email);

        setIsSubmtting(false);
        setEmail('');
        closeModal();
    }

    const openModal =()=> {
        setIsOpen(true)
    }

    const closeModal =()=> {
        setIsOpen(false);
    }
  return (
    <>
      <button className='btn' type="button" onClick={openModal}>
        Track
      </button>

<Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div"  onClose={closeModal} className="dialog-container z-50 border-4 rounded-lg border-slate-950">
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 ">
          <DialogPanel className="max-w-lg space-y-4 border bg-white p-12">
            <DialogTitle className="font-bold">Stay Updated with price right in your Inbox 📩</DialogTitle>
            {/* <Description>This will permanently deactivate your account</Description> */}
            {/* <p>Are you sure you want to deactivate your account? All of your data will be permanently removed.</p> */}
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <label>Enter your email</label>
                <input 
                    type='text' 
                    value={email} 
                    onChange={(e)=> setEmail(e.target.value)} 
                    className='border-4 min-h-12 rounded-xl'
                />

            <div className="flex gap-4">
              <button type='submit' className='bg-green-500 p-2 rounded-lg'>
                {
                    isSubmtting? 'Submitting...' : 'Submit'
                }
                </button>
              <button onClick={() => setIsOpen(false)} className='bg-red-500 p-2 rounded-lg'>Cancel</button>
            </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
</Transition>
    </>
  )
}

export default Model
