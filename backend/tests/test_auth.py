def test_register_and_login(client):
    register_payload = {
        'full_name': 'Test User',
        'email': 'test@example.com',
        'password': 'Password123!',
        'role': 'user',
    }
    register_response = client.post('/auth/register', json=register_payload)
    assert register_response.status_code == 201

    login_response = client.post('/auth/login', json={
        'email': 'test@example.com',
        'password': 'Password123!'
    })
    assert login_response.status_code == 200
    assert 'access_token' in login_response.json()

    token = login_response.json()['access_token']
    me_response = client.get('/auth/me', headers={'Authorization': f'Bearer {token}'})
    assert me_response.status_code == 200
    assert me_response.json()['email'] == 'test@example.com'
