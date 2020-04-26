$(document).ready(function() {
    var loginForm = $("form.login");
    var emailInput = $("input#emailLogin");
    var passwordInput = $("input#passwordLogin");

    loginForm.on("submit", function(event) {
        event.preventDefault();

        var userData = {
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
        console.log("ran")
        $.post("/api/login", {
            email: email,
            password: password
        }).then(function(data) {
            window.location.replace("/search.html");
        })
        .catch(function(err) {
            console.log(err);
        })
    }
})