import { useState } from "react";
import CronToggle from "./CronToggle";

export default function ProfileSettings() {
    
    const [createMonthly, setCreateMonthly] = useState(sessionStorage.getItem('createMonthly') === 'true' ? true : false);
    const [createHalfYear, setCreateHalfYear] = useState(sessionStorage.getItem('createHalfYear') === 'true' ? true : false);
    
    const cronToggleSettings = [
        {
            name: 'createMonthly',
            title: 'Automatically create monthly playlists',
            description: 'SonicLab will create a monthly playlist based on your top tracks of the last 4 weeks.',
            checked: createMonthly,
            setChecked: setCreateMonthly
        },
        {
            name: 'createHalfYear',
            title: 'Automatically create half-year playlists',
            description: 'SonicLab will create a playlist based on your top tracks of the last 6 months on July 1st.',
            checked: createHalfYear,
            setChecked: setCreateHalfYear
        }
    ]
    return (
        <>
            {cronToggleSettings.map((setting) => (
                <CronToggle
                    name={setting.name}
                    title={setting.title}
                    description={setting.description}
                    checked={setting.checked}
                    setChecked={setting.setChecked}
                />
            ))}
        </>
    )
}