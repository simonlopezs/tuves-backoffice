import { Tab, Tabs } from '@mui/material'
import { SyntheticEvent, useState } from 'react'
import { Link } from 'react-router-dom'

interface NavTabsProps {
    tabs: {
        label: string;
        path: string;
    }[]
}

export const NavTabs = ({ tabs }: NavTabsProps) => {
    const [value, setValue] = useState(0);
    const handleChange = (_: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <Tabs value={value} onChange={handleChange}>
            {
                tabs.map(({ label, path }) => (
                    <Tab key={path} component={Link} label={label} to={path} />
                ))
            }
        </Tabs>
    )
}
