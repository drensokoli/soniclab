import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import { Montserrat, Bebas_Neue } from 'next/font/google'
import AIGen from "./AIGen";
import Library from "./Library";

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
        <Tabs value="aigen" className="w-5/6">
            <TabsHeader>
                <Tab
                    value="aigen"
                    className={`${montserrat.className} px-2`}
                >Playlist Generator</Tab>
                <Tab
                    value="monthly"
                    className={`${montserrat.className} px-5`}
                >SpotiLab Library</Tab>
            </TabsHeader>
            <TabsBody>
                <TabPanel value="aigen">
                    <AIGen
                        spotifyClientId={spotifyClientId}
                        spotifyClientSecret={spotifyClientSecret}
                        providerAccountId={providerAccountId}
                        refreshToken={refreshToken}
                    />
                </TabPanel>
                <TabPanel value="monthly">
                    <Library />
                </TabPanel>
            </TabsBody>
        </Tabs>
    )
}