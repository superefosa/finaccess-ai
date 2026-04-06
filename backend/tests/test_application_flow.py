def register_and_login(client, email, role='user'):
    payload = {
        'full_name': 'Flow User' if role == 'user' else 'Admin User',
        'email': email,
        'password': 'Password123!',
        'role': role,
    }
    client.post('/auth/register', json=payload)
    login = client.post('/auth/login', json={'email': email, 'password': 'Password123!'})
    token = login.json()['access_token']
    return {'Authorization': f'Bearer {token}'}


def test_profile_application_and_admin_decision_flow(client):
    user_headers = register_and_login(client, 'flow@example.com', 'user')
    admin_headers = register_and_login(client, 'admin@example.com', 'admin')

    profile_payload = {
        'age': 34,
        'employment_status': 'full_time',
        'monthly_income': 3200,
        'monthly_expenses': 1700,
        'current_debt': 500,
        'years_employed': 4,
        'housing_status': 'renting',
        'dependents': 1,
    }
    profile_response = client.post('/profiles', json=profile_payload, headers=user_headers)
    assert profile_response.status_code == 200

    application_payload = {
        'requested_amount': 2500,
        'loan_purpose': 'education',
        'repayment_months': 12,
    }
    application_response = client.post('/applications', json=application_payload, headers=user_headers)
    assert application_response.status_code == 201
    body = application_response.json()
    assert body['ai_recommendation'] in ('approve', 'review', 'reject')
    assert body['ai_score'] is not None

    admin_list = client.get('/admin/applications', headers=admin_headers)
    assert admin_list.status_code == 200
    assert len(admin_list.json()) == 1

    app_id = body['id']
    decision_response = client.patch(
        f'/admin/applications/{app_id}/decision',
        json={'final_decision': 'approved'},
        headers=admin_headers,
    )
    assert decision_response.status_code == 200
    assert decision_response.json()['status'] == 'approved'

    my_apps = client.get('/applications/me', headers=user_headers)
    assert my_apps.status_code == 200
    assert my_apps.json()[0]['status'] == 'approved'
