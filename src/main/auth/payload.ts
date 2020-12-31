export function generatePayload(user: any) {
    const payload = {
        sub: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        typeUser: user.type,
        imageProfile: user.profilePhoto?.link
    };
    return payload;
}