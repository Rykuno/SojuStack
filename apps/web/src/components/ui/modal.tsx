'use client';

import * as React from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '#/components/ui/drawer';
import { useIsMobile } from '#/hooks/use-mobile';

type ModalContextValue = {
  isMobile: boolean;
};

const ModalContext = React.createContext<ModalContextValue | null>(null);

function useModalContext() {
  const context = React.useContext(ModalContext);

  if (!context) {
    throw new Error('Modal components must be used within <Modal>.');
  }

  return context;
}

function Modal({
  children,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof Dialog> & React.ComponentProps<typeof Drawer>) {
  const isMobile = useIsMobile();
  const Root = isMobile ? Drawer : Dialog;
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  return (
    <ModalContext.Provider value={{ isMobile }}>
      <Root data-slot='modal' open={open} onOpenChange={handleOpenChange} {...props}>
        {children}
      </Root>
    </ModalContext.Provider>
  );
}

type ModalTriggerProps = React.ComponentProps<typeof DialogTrigger> & {
  children?: React.ReactNode;
};

function getRenderedElement(candidate: unknown) {
  if (React.isValidElement(candidate)) {
    return candidate;
  }

  return null;
}

function ModalTrigger({
  children,
  render,
  className,
  ...props
}: Omit<ModalTriggerProps, 'className'> & { className?: string }) {
  const { isMobile } = useModalContext();
  const child = getRenderedElement(render) ?? getRenderedElement(children);

  if (isMobile) {
    if (child) {
      return (
        <DrawerTrigger asChild {...props}>
          {child}
        </DrawerTrigger>
      );
    }

    return (
      <DrawerTrigger className={className} {...props}>
        {children}
      </DrawerTrigger>
    );
  }

  return (
    <DialogTrigger data-slot='modal-trigger' className={className} render={render} {...props}>
      {children}
    </DialogTrigger>
  );
}

type ModalCloseProps = React.ComponentProps<typeof DialogClose> & {
  children?: React.ReactNode;
};

function ModalClose({
  children,
  render,
  className,
  ...props
}: Omit<ModalCloseProps, 'className'> & { className?: string }) {
  const { isMobile } = useModalContext();
  const child = getRenderedElement(render) ?? getRenderedElement(children);

  if (isMobile) {
    if (child) {
      return (
        <DrawerClose asChild {...props}>
          {child}
        </DrawerClose>
      );
    }

    return (
      <DrawerClose className={className} {...props}>
        {children}
      </DrawerClose>
    );
  }

  return (
    <DialogClose data-slot='modal-close' className={className} render={render} {...props}>
      {children}
    </DialogClose>
  );
}

function ModalContent({
  className,
  children,
  showCloseButton,
  ...props
}: Omit<React.ComponentProps<typeof DialogContent>, 'className'> & {
  className?: string;
}) {
  const { isMobile } = useModalContext();

  if (isMobile) {
    return (
      <DrawerContent data-slot='modal-content' className={className} {...props}>
        {children}
      </DrawerContent>
    );
  }

  return (
    <DialogContent
      data-slot='modal-content'
      className={className}
      showCloseButton={showCloseButton}
      {...props}
    >
      {children}
    </DialogContent>
  );
}

function ModalHeader({ className, ...props }: React.ComponentProps<'div'>) {
  const { isMobile } = useModalContext();
  const Component = isMobile ? DrawerHeader : DialogHeader;

  return <Component data-slot='modal-header' className={className} {...props} />;
}

function ModalFooter({ className, ...props }: React.ComponentProps<'div'>) {
  const { isMobile } = useModalContext();
  const Component = isMobile ? DrawerFooter : DialogFooter;

  return <Component data-slot='modal-footer' className={className} {...props} />;
}

function ModalTitle({
  className,
  ...props
}: Omit<React.ComponentProps<typeof DialogTitle>, 'className'> & {
  className?: string;
}) {
  const { isMobile } = useModalContext();
  const Component = isMobile ? DrawerTitle : DialogTitle;

  return <Component data-slot='modal-title' className={className} {...props} />;
}

function ModalDescription({
  className,
  ...props
}: Omit<React.ComponentProps<typeof DialogDescription>, 'className'> & {
  className?: string;
}) {
  const { isMobile } = useModalContext();
  const Component = isMobile ? DrawerDescription : DialogDescription;

  return <Component data-slot='modal-description' className={className} {...props} />;
}

export {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
};
