export async function fetchUserInfo(userID, accessToken) {
    const response = await fetch (`https://18.226.163.235:8000/api/users/${userID}/`, {
        method: "GET",
        headers:{
            Authorization: `Bearer ${accessToken}`,
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch user ${userID} info: ${response.status}`);
    }
    return response.json();
}