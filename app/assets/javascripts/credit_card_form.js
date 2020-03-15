// Function to get params from URL

function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
};

$(document).ready(function() { // Ensures page loads completely before JS fires

    var show_error, stripeResponseHandler, submitHandler;

// Function to handle the submit of the form and intercept the default event
    submitHandler = function (event) {
        var $form = $(event.target);
        $form.find("input[type=submit]").prop("disabled", true);
        if (Stripe) {
            Stripe.card.createToken($form, stripeResponseHandler);
        } else {
            show_error("Failed to load credit card processing functionality. Please reload the page.")
        }
        return false;
    };

// Initiate submit handler listener for any form with class cc_form
    $(".cc_form").on('submit', submitHandler);

// Handle event of plan drop down changing
    var handlePlanChange = function(plan_type, form) {
        var $form  = $(form);

        if (plan_type == undefined) {
            plan_type = $('#tenant_plan :selected').val();
        }

        if (plan_type === 'premium') {
            $('[data-stripe]').prop('required', true);
            $form.off('submit');
            $form.on('submit', submitHandler);
            $('[data-stripe]').show();
        } else { // free plan
            $('[data-stripe]').hide();
            $form.off('submit');
            $('[data-stripe]').prop('required', false); // Source:
        }
    };

// Set up plan change even listener #tenantt_plan in the forms for class cc_from
    $("#tenant_plan").on("change", function(event) {
        handlePlanChange($('#tenant_plan :selected').val(), ".cc_form");
    });

// Call plan change handler so that the plan is set correctly in teh drop down when the page loads
    handlePlanChange(GetURLParameter('plan'), ".cc_form");

// Function to handle the token received from Stripe and remove credit card fields
    stripeResponseHandler = function(status, response) {
        var token, $form;

        $form = $('.cc_form');

        if (response.error) {
            console.log(response.error.message);
            show_error(response.error.message);
            $form.find("input[type=submit]").prop("disabled", false);
        } else {
            token = response.id;
            $form.append($("<input type=\"hidden\" name=\"payment[token]\" \>").val(token));
            $("[data-stripe=number]").remove();
            $("[data-stripe=cvv]").remove();
            $("[data-stripe=exp-year]").remove();
            $("[data-stripe=exp-month]").remove();
            $("[data-stripe=exp-label]").remove();
            $form.get(0).submit();
        }

        return false;
    };

// Function to show errors when Stripe functionality returns errors
    show_error = function (message) {
        if($("#flash-messages").size() < 1){
            $('div.container.main div:first').prepend("<div id='flash-messages'></div>")
        }
        $("#flash-messages").html('<div class="alert alert-warning"><a class="close" data-dismiss="alert">×</a><div id="flash_alert">' + message + '</div></div>');
        $('.alert').delay(5000).fadeOut(3000);
        return false;
    };
});