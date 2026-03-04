import { Button, Menu, Portal } from '@chakra-ui/react'
import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { NavLink, useLocation } from 'react-router-dom'

const StatisticsSelector = () => {
    const [open, setOpen] = useState<boolean>(false)
    const location = useLocation();

  return (
   <Menu.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
        <Menu.Trigger asChild>
          <Button variant="outline" size="sm" fontWeight= {location.pathname.includes("statistics") ? "bold": "normal"}>
            Statistics
            {open ? <FaChevronUp></FaChevronUp> : <FaChevronDown></FaChevronDown>}
          </Button>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner>
            <Menu.Content >
              <Menu.Item value="age-statistics">
                <NavLink to="statistics/age">Age Statistics</NavLink>
              </Menu.Item>
              <Menu.Item value="salary-statistics">
                 <NavLink to="statistics/salary">Salary Statistics</NavLink>
              </Menu.Item>
              <Menu.Item value="department-statistics">
                <NavLink to="statistics/department">Department Statistics</NavLink>
              </Menu.Item>
             
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
  )
}

export default StatisticsSelector
