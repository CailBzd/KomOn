const fetch = require('node-fetch');

async function testLoginSimple() {
    const loginData = {
        email: "test@example.com",
        password: "password123"
    };

    console.log('🔧 Testing login with simple data...');
    console.log('📡 Request data:', JSON.stringify(loginData, null, 2));

    try {
        const response = await fetch('http://192.168.1.197:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response status text:', response.statusText);

        const responseText = await response.text();
        console.log('📡 Response body:', responseText);

        if (response.ok) {
            const data = JSON.parse(responseText);
            console.log('✅ Login successful:', data);
        } else {
            console.log('❌ Login failed with status:', response.status);
            try {
                const errorData = JSON.parse(responseText);
                console.log('❌ Error details:', errorData);
            } catch (e) {
                console.log('❌ Raw error response:', responseText);
            }
        }
    } catch (error) {
        console.error('❌ Network error:', error.message);
    }
}

testLoginSimple(); 