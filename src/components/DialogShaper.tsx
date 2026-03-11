import { Button, Dialog, Portal } from '@chakra-ui/react'
import {FC, ReactNode} from 'react'
type Props = {
    buttonName: string | ReactNode,
    isPending?: boolean,
    content: ReactNode,
    open: boolean
}
const DialogShaper: FC<Props> = ({buttonName, content,open, isPending=false}) => {
  return (
    <Dialog.Root lazyMount open={open}>
          <Dialog.Trigger asChild>
            <Button variant="outline" disabled={isPending}>{buttonName}</Button>
          </Dialog.Trigger>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content display={"flex"} alignItems={"center"}>
               {content}
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
  )
}

export default DialogShaper

