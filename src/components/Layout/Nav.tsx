import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import { Montserrat, Bebas_Neue } from 'next/font/google'
import AIGen from "../TabPanels/AI/AIGen";
import Recent from "../TabPanels/Recent";
import Top from "../TabPanels/Top";

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: '500',
    style: 'normal',
})

export default function Nav({
    spotifyClientId,
    spotifyClientSecret,
    providerAccountId,
    refreshToken
}: {
    spotifyClientId: string,
    spotifyClientSecret: string,
    providerAccountId: string,
    refreshToken: string
}) {

    return (
        <Tabs value="recent" className="w-5/6">
            <TabsHeader>
                <Tab
                    value="recent"
                    className={`${montserrat.className} px-5`}
                >Recent</Tab>
                <Tab
                    value="top"
                    className={`${montserrat.className} px-5`}
                >Top</Tab>
                {/* <Tab
                    value="aigen"
                    className={`${montserrat.className} px-2`}
                >AI Gen</Tab> */}
            </TabsHeader>
            <TabsBody>
                <TabPanel value="recent" className="p-0">
                    <Recent
                        spotifyClientId={spotifyClientId}
                        spotifyClientSecret={spotifyClientSecret}
                        providerAccountId={providerAccountId}
                        refreshToken={refreshToken}
                    />
                </TabPanel>
                <TabPanel value="top" className="p-0">
                    <Top
                        spotifyClientId={spotifyClientId}
                        spotifyClientSecret={spotifyClientSecret}
                        providerAccountId={providerAccountId}
                        refreshToken={refreshToken}
                    />
                </TabPanel>
                <TabPanel value="aigen" className="p-0">
                    <AIGen
                        spotifyClientId={spotifyClientId}
                        spotifyClientSecret={spotifyClientSecret}
                        providerAccountId={providerAccountId}
                        refreshToken={refreshToken}
                    />
                </TabPanel>
            </TabsBody>
        </Tabs>
    )
}