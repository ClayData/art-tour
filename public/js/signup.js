$(document).ready(function() {
    const signUpForm = $("form.signup");
    const emailInput = $("input#emailSignUp")
    const passwordInput = $("input#passwordSignUp")

    signUpForm.on("submit", function(event) {
        event.preventDefault();
        var userData = {
            email: emailInput.val().trim(),
            password: passwordInput.val().trim()
        }

    if(!userData.email || !userData.password) {
        return;
    }

    signUpUser(userData.email, userData.password) 
    emailInput.val("");
    passwordInput.val("");
    })

    function signUpUser(email, password) {
        $.post("/api/signup", {
            email: email,
            password: password
        }).then((data) => {
            window.location.replace("/search.html");
        })
        .catch(handleLoginErr);
    }

    function handleLoginErr(err) {
        $("#alert .msg").text(err.responseJSON);
        $("#alert").fadeIn(500);
      }
});

