import { FunctionDef } from '.';

const RunCommand = () => <FunctionDef
    name="runCommands"
    title="Run terminal command"
    fields={[
        {
            name: 'command',
            type: 'text'
        }
    ]}
    validate={(form: { command?: string }) => {
        return !!form.command || {
            command: 'Required'
        }
    }}
    parseArg={(form: { command: string } ) => [form.command]}
/>;

export default RunCommand;