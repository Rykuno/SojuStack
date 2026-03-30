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

type ModalRootProps = React.ComponentProps<typeof Dialog> & React.ComponentProps<typeof Drawer>;
type ModalContextValue = {
  isMobile: boolean;
};
type ModalTriggerProps = Omit<React.ComponentProps<typeof DialogTrigger>, 'className'> & {
  children?: React.ReactNode;
  className?: string;
};
type ModalCloseProps = Omit<React.ComponentProps<typeof DialogClose>, 'className'> & {
  children?: React.ReactNode;
  className?: string;
};
type ModalContentProps = Omit<React.ComponentProps<typeof DialogContent>, 'className'> & {
  className?: string;
};
type ModalTitleProps = Omit<React.ComponentProps<typeof DialogTitle>, 'className'> & {
  className?: string;
};
type ModalDescriptionProps = Omit<React.ComponentProps<typeof DialogDescription>, 'className'> & {
  className?: string;
};

const ModalContext = React.createContext<ModalContextValue | null>(null);

function useModalContext() {
  const context = React.useContext(ModalContext);

  if (!context) {
    throw new Error('Modal components must be used within <Modal>.');
  }

  return context;
}

function useModalOpenState({
  defaultOpen = false,
  open: openProp,
  onOpenChange,
}: Pick<ModalRootProps, 'defaultOpen' | 'open' | 'onOpenChange'>) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : uncontrolledOpen;

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  return [open, setOpen] as const;
}

function Modal({
  children,
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  ...props
}: ModalRootProps) {
  const isMobile = useIsMobile();
  const Root = isMobile ? Drawer : Dialog;
  const [open, setOpen] = useModalOpenState({
    defaultOpen,
    open: openProp,
    onOpenChange,
  });
  const contextValue = React.useMemo(() => ({ isMobile }), [isMobile]);

  return (
    <ModalContext.Provider value={contextValue}>
      <Root data-slot='modal' open={open} onOpenChange={setOpen} {...props}>
        {children}
      </Root>
    </ModalContext.Provider>
  );
}

function getAsChildElement(candidate: unknown) {
  if (React.isValidElement(candidate)) {
    return candidate;
  }

  return null;
}

function ModalTrigger({ children, render, className, ...props }: ModalTriggerProps) {
  const { isMobile } = useModalContext();
  const child = getAsChildElement(render) ?? getAsChildElement(children);

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

function ModalClose({ children, render, className, ...props }: ModalCloseProps) {
  const { isMobile } = useModalContext();
  const child = getAsChildElement(render) ?? getAsChildElement(children);

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

function ModalContent({ className, children, showCloseButton, ...props }: ModalContentProps) {
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

function ModalTitle({ className, ...props }: ModalTitleProps) {
  const { isMobile } = useModalContext();
  const Component = isMobile ? DrawerTitle : DialogTitle;

  return <Component data-slot='modal-title' className={className} {...props} />;
}

function ModalDescription({ className, ...props }: ModalDescriptionProps) {
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
