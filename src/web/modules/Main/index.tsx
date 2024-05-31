import Providers from '@components/providers';

import Tabs from '@components/Tabs';
import Tab from '@components/Tab';

// Tab contents
import Share from './tabs/Share';
import Settings from './tabs/Settings';

const Main = () => {

    return <Providers>
        <Tabs searchParam="tab">
            <div className="tab-content">
                <Tab name="main">
                    <div className="tab-generic">
                        <div className="tab-generic-content">
                            <h1>Welcome to Control Me!</h1>
                            <p>
                                Please read <a href="https://github.com/tisbutanalt2/controlme/blob/main/tutorial.md" target="_blank">
                                    this guide
                                </a> if you're lost!
                            </p>

                            <p>
                                This is still a work in progress.
                                Most features aren't implemented yet.
                            </p>
                        </div>
                    </div>
                </Tab>

                <Tab name="chat">
                    Chat tab
                </Tab>

                <Tab name="share">
                    <Share />
                </Tab>

                <Tab name="settings">
                    <Settings />
                </Tab>
            </div>
        </Tabs>
    </Providers>
}

export default Main;