import { getSession } from '@auth0/nextjs-auth0';
 
export async function isAdmin() {
    const session = await getSession();
    const userRole = session?.user?.['role'];
    const rolesFromMetadata = session?.user?.['https://my-app.example.com/roles'] || [];
    return userRole === 'ADMIN' || (Array.isArray(rolesFromMetadata) && rolesFromMetadata.includes('ADMIN'));
}
 
export function isAdminFromUser(user: any) {
    const roleFromMetadata = user?.['https://my-app.example.com/roles'] || [];
    const roleFromUser = user?.['role'];
    return roleFromUser === 'ADMIN' || (Array.isArray(roleFromMetadata) && roleFromMetadata.includes('ADMIN'));
}