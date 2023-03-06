import { useEffect, useState } from 'react';
import PocketBase from 'pocketbase';

interface Message {
    id: string;
    text: string;
    message: string;
    timestamp: number;
    createdBy: string;
    created: string;
}

const Dashboard = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    const pb = new PocketBase('https://aloof-zettabyte.pockethost.io');

    const currentUser = pb.authStore.model?.email;
    const relationId = pb.authStore.model?.id;

    useEffect(() => {
        // fetch all messages
        async function fetchMessages() {
            const messages = (await pb.collection('messages').getFullList({
                sort: '-created',
            })) as Message[];

            setMessages(messages);
            console.log(messages);
        }

        fetchMessages();
    }, []);

    const handleNewMessageChange = (
        e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setNewMessage(e.target.value);
    };

    const handleNewMessageSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        try {
            const createdRecord: Message = await pb
                .collection('messages')
                .create({
                    message: newMessage,
                    user: relationId,
                    timestamp: Date.now(),
                });
            setMessages((messages) => [...messages, createdRecord]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-gray-50">
            <div className="flex-1 overflow-y-auto px-4 py-8 sm:p-8">
                {messages.map((message) => (
                    <div key={message.id} className="mb-4 flex items-start">
                        <img
                            src={'https://source.unsplash.com/random/800x600'}
                            alt={`${message.created}'s avatar`}
                            className="w-8 h-8 rounded-full mr-2"
                        />
                        <div className="flex flex-col">
                            <div className="flex items-center">
                                <div className="text-gray-500 text-xs">
                                    {new Date(message.created).toLocaleString()}
                                </div>
                            </div>
                            <div className="text-gray-700">
                                {message.message}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleNewMessageSubmit} className="bg-white p-4">
                <div className="flex items-center mb-2">
                    <img
                        src={'https://source.unsplash.com/random/800x600'}
                        alt={`${currentUser}'s avatar`}
                        className="w-8 h-8 rounded-full mr-2"
                    />
                    <textarea
                        className="w-full resize-none border rounded py-2 px-3"
                        placeholder="Type your message here..."
                        value={newMessage}
                        onChange={handleNewMessageChange}
                    ></textarea>
                </div>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Send
                </button>
            </form>
        </div>
    );
};

export default Dashboard;
