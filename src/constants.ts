import type { TabProps } from '@components/Tabs';

export const isDev = process.env.NODE_ENV === 'development';
export const appTitle = 'Control Me!';

export const maxDisplayNameLength = 128;

export const mainTabs: Array<TabProps> = [
    { value: '/', label: 'Main' },
    { value: '/chat', label: 'Chat' },
    { value: '/share', label: 'Share' },
    { value: '/settings', label: 'Settings' },
    { value: '/about', label: 'About' }
];