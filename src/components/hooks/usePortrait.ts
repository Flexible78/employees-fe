import { useBreakpointValue } from "@chakra-ui/react"

const BASE_VALUE="portrait"
const FULL_VALUE="full"
export default function usePortrait(): boolean {
    const value = useBreakpointValue({
        base: BASE_VALUE,
        sm: FULL_VALUE
      })
      return value == BASE_VALUE
}
