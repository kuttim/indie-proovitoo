import { useState, FormEvent } from 'react';
import PocketBase from 'pocketbase';
import { useNavigate } from 'react-router-dom';

const pb = new PocketBase('https://aloof-zettabyte.pockethost.io');

function Signin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const authData = await pb
                .collection('users')
                .authWithPassword(email, password);

            console.log(authData);

            localStorage.setItem('authToken', authData.token);

            setEmail('');
            setPassword('');
            setErrorMessage('');

            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            setErrorMessage('Invalid email or password');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md">
                <h1 className="text-4xl font-bold text-center text-gray-700 mb-8">
                    Indie real-time chat
                </h1>
                <form
                    className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                    onSubmit={handleSubmit}
                >
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 font-bold mb-2"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 font-bold mb-2"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Sign in
                        </button>
                    </div>
                    {errorMessage && (
                        <p className="text-red-500 mt-4">{errorMessage}</p>
                    )}
                </form>
                <p className="text-center text-gray-500 text-sm">
                    Don't have an account?{' '}
                    <a
                        className="text-blue-500 hover:text-blue-700"
                        href="/signup"
                    >
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Signin;
