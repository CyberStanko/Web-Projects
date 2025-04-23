import { ManagementClient } from 'auth0';
 
const auth0 = new ManagementClient({
  domain: process.env.AUTH0_DOMAIN!,
  clientId: process.env.AUTH0_CLIENT_ID!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!,
});
 
export async function updateAuth0UserRole(userId: string, role: 'USER' | 'ADMIN') {
  try {
    const response = await fetch('/api/auth/users', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        role
      })
    });
 
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error('Failed to update user');
    }
 
    const data = await response.json();
    return true;
  } catch (error) {
    console.error('Error updating Auth0 user role:', error);
    throw error;
  }
}