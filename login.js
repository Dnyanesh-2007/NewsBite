const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const messageEl = document.getElementById("auth-message");

function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = "auth-message " + type;
}

// If already logged in, go back to the home page
supabaseClient.auth.getSession().then(function (result) {
    if (result.data.session) {
        window.location.href = "index.html";
    }
});

document.getElementById("show-signup").addEventListener("click", function (event) {
    event.preventDefault();
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
    showMessage("", "");
});

document.getElementById("show-login").addEventListener("click", function (event) {
    event.preventDefault();
    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
    showMessage("", "");
});

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    if (!email || !password) {
        showMessage("Please fill in all fields.", "error");
        return;
    }
    if (password.length < 6) {
        showMessage("Password must be at least 6 characters.", "error");
        return;
    }

    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
        showMessage(error.message, "error");
        return;
    }

    showMessage("Logged in! Redirecting...", "success");
    window.location.href = "index.html";
});

signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("signup-name").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;

    if (!name || !email || !password) {
        showMessage("Please fill in all fields.", "error");
        return;
    }
    if (password.length < 6) {
        showMessage("Password must be at least 6 characters.", "error");
        return;
    }

    const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { name } }
    });

    if (error) {
        showMessage(error.message, "error");
        return;
    }

    showMessage("Account created! You can log in now.", "success");
    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
});
