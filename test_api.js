// Test simple pour vérifier l'API
const testApi = async () => {
  const baseUrl = 'https://localhost:5001/api';
  
  // Test 1: Vérifier que l'API répond
  try {
    console.log('🧪 Test 1: Vérification de l\'API...');
    const response = await fetch(`${baseUrl}/user/profile`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer mock-jwt-token-test',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API fonctionne:', data);
    } else {
      const errorText = await response.text();
      console.log('❌ Erreur API:', errorText);
    }
  } catch (error) {
    console.log('❌ Erreur réseau:', error.message);
  }
  
  // Test 2: Test de mise à jour du profil
  try {
    console.log('\n🧪 Test 2: Test de mise à jour du profil...');
    const updateData = {
      username: 'testuser123',
      firstName: 'Test',
      lastName: 'User',
      phoneNumber: '0123456789',
      dateOfBirth: '1990-01-01',
      bio: 'Test bio'
    };
    
    const response = await fetch(`${baseUrl}/user/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer mock-jwt-token-test',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Mise à jour réussie:', data);
    } else {
      const errorText = await response.text();
      console.log('❌ Erreur mise à jour:', errorText);
    }
  } catch (error) {
    console.log('❌ Erreur réseau:', error.message);
  }
};

// Exécuter le test
testApi(); 