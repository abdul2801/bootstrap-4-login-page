
if(!IsLoggedIn()){
    window.location.href = "index.html";
    console.log("Not logged in");
}

async function IsLoggedIn() {
    const token = localStorage.getItem("token");
    if (token) {
        const response = await fetch(`${apiAdminUrl}/api/admin/auth_test`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        });
        if (response.ok) {
            return true;
        }
    }
    window.location.href = "index.html";
    return false;
}
