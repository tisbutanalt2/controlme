export default function validateSignup(username: string, password: string): true|{ username?: string; password?: string } {
    let userErr: string|undefined;
    let passwordErr: string|undefined;

    // Username must be minimum 3 chars and only include a-z, 0-9 and underscore
    if (!/^[a-z0-9_]{3,}$/.test(username))
        userErr = 'Username must be minimum 3 characters long, and must only include alphanumerical characters';

    // Username cannot only contain numbers
    if (!userErr && /^\d+$/.test(username))
        userErr = 'Username cannot contain only numbers';

    if (!userErr && username.toLowerCase().startsWith('_anon'))
        userErr = 'Username conflicts with internal key';

    // Password must be >= 5 in length without spaces
    if (!/^[^\s]{5,}$/.test(password))
        passwordErr = 'Password must be at least 5 characters, without spaces';

    if (userErr || passwordErr) return {
        username: userErr,
        password: passwordErr
    }

    return true;
}