$(document).ready(function() {
    const loginForm = $("form.login");
    const emailInput = $("input#emailLogin");
    const passwordInput = $("input#passwordLogin");

    loginForm.on("submit", function(event) {
        event.preventDefault();

        const userData = {
            email: emailInput.val().trim(),
            password: passwordInput.val().trim()
        }

        if (!userData.email || !userData.password) {
            return;
        }

        loginUser(userData.email, userData.password);
        emailInput.val("");
        passwordInput.val("");
    });

    function loginUser(email, password) {
        $.post("/api/login", {
            email: email,
            password: password
        }).then(function() {
            window.location.replace("/search.html");
        })
        .catch(function(err) {
            console.log(err);
        })
    }
})