import * as Dialog from '@radix-ui/react-dialog';

interface ModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onChange,
  title,
  description,
  children,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="
            bg-neutral-900/60 
            backdrop-blur-sm 
            fixed 
            inset-0
          "
        />
        <Dialog.Content
          className="
            fixed 
            drop-shadow-md 
            border 
            border-neutral-700 
            top-[50%] 
            left-[50%] 
            max-h-full 
            h-full 
            md:h-auto 
            md:max-h-[85vh] 
            w-full 
            md:w-[90vw] 
            md:max-w-[450px] 
            translate-x-[-50%] 
            translate-y-[-50%] 
            rounded-md 
            bg-neutral-800 
            p-[25px] 
            focus:outline-none
          "
        >
          <Dialog.Title
            className="
              text-2xl 
              text-center 
              font-bold 
              mb-4
              text-white
            "
          >
            {title}
          </Dialog.Title>
          <Dialog.Description
            className="
              mb-5 
              text-xl
              leading-normal 
              text-center
              text-white
            "
          >
            {description}
          </Dialog.Description>
            <div>{children}</div>
            <Dialog.Close />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
