import { Button, Dialog, Portal } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

type DialogOpenChange = {
  open: boolean;
};

type Props = {
  content: ReactNode;
  isPending?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  buttonName?: string | ReactNode;
  trigger?: ReactNode;
};

const DialogShaper: FC<Props> = ({
  buttonName,
  trigger,
  content,
  open,
  onOpenChange,
  isPending = false,
}) => {
  const isControlled = typeof open === "boolean";
  const handleOpenChange = (details: DialogOpenChange) => {
    onOpenChange?.(details.open);
  };

  const rootProps = isControlled
    ? { open, onOpenChange: handleOpenChange }
    : onOpenChange
      ? { onOpenChange: handleOpenChange }
      : {};

  const triggerNode = trigger ??
    (buttonName ? (
      <Button variant="outline" disabled={isPending}>
        {buttonName}
      </Button>
    ) : null);

  return (
    <Dialog.Root lazyMount {...rootProps}>
      {triggerNode && <Dialog.Trigger asChild>{triggerNode}</Dialog.Trigger>}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content display="flex" alignItems="center">
            {content}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default DialogShaper;

