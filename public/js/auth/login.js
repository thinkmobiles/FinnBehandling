$(document).ready(function () {

    $.validator.addMethod(
        'emailAdvance',
        function (value, element, validate) {
            var emailPattern = /^(([^<"'>()[\]\\.,;:\s@\" ]+(\.[^><>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return this.optional(element) || validate && emailPattern.test(value);
        },
        'You entered wrong email address'
    );
});

function setParams(form, resultObject, callback) {
    var result = resultObject || {};
    var formLength = form.length;
    var fieldName;

    for (var i = 0; i < formLength; i++) {
        fieldName = form[i].name;

        if (!fieldName) {
            callback(result);
            return;
        } else if (fieldName !== 'remember') {
            result[fieldName] = form[i].value;
        } else {
            result[fieldName] = form[i].checked;
        }

        if (i === formLength - 1) {
            callback(result);
            return;
        }
    }
}

function signInValidate(callback) {
    $('.login-form').validate({
        highlight: function(element, errorClass) {
            $(element).parent().parent().addClass('error');
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element).parent().parent().removeClass('error');
        },
        /*errorPlacement: function(error, element) {
            return true;
        },*/
        rules: {
            login: {
                required: true,
                emailAdvance: true
            },
            password: {
                required: true
            }
        },
        submitHandler: callback
    });
}

function sendSignIn(data) {
    $.ajax({
        method: "POST",
        url: "/user/signIn",
        data: data,
        success: function (msg) {
            window.location = '/admin';
        },
        error: function (jqXHR, textStatus) {
            alert(jqXHR.responseJSON.error);
        }
    });
}

function signIn() {
    signInValidate(function (form) {
        setParams(form, null, sendSignIn);
    });
}