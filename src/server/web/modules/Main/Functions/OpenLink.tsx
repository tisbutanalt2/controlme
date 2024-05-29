// TODO Make this file use the right casing. Git is dumb...
import { FunctionDef } from '.';

const OpenLink = () => <FunctionDef
    name="openLinks"
    fields={[
        {
            name: 'url',
            type: 'text',
            label: 'URL',
            placeholder: 'https://github.com/tisbutanalt2/controlme',
            description: 'Link to the website you want to open on the PC',
            sx: { width: '100%' }
        }
    ]}
    parseArg={(form: { url: string }) => [
        /^https?:\/\//.test(form.url)
            ?form.url
            :`https://${form.url}`
    ]}
    validate={form => {
        if (!form.url?.length) return { url: 'Required' }
    }}
>
    Open URL
</FunctionDef>

export default OpenLink;
