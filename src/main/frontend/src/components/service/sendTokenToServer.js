export const sendTokenToServer = async (token) => {
    try {
        const response = await fetch('/api/save-token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });

        if (!response.ok) {
            throw new Error('Failed to send token to server');
        }

        console.log('Token successfully sent to server');
    } catch (error) {
        console.error('Error sending token to server:', error);
    }
};