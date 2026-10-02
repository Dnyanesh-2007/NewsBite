// Show Login or the user's name + Logout in the navbar
async function setupNavbarAuth() {
    const loginBtn = document.getElementById("login-btn");
    const userArea = document.getElementById("user-area");
    const userLabel = document.getElementById("user-label");
    const logoutBtn = document.getElementById("logout-btn");

    if (!loginBtn || !userArea) return;

    const { data } = await supabaseClient.auth.getSession();
    const user = data.session && data.session.user;

    if (user) {
        // Use the name from signup, or email if name is missing
        userLabel.textContent = (user.user_metadata && user.user_metadata.name) || user.email;
        loginBtn.style.display = "none";
        userArea.style.display = "flex";
    } else {
        loginBtn.style.display = "inline-block";
        userArea.style.display = "none";
    }

    logoutBtn.addEventListener("click", async function () {
        await supabaseClient.auth.signOut();
        window.location.reload();
    });
}

setupNavbarAuth();
