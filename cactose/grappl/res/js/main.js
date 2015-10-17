(function jQueryAlias($) {
    $(document).ready(function onReady() {
      // BootstrapCSS CDN Fallback
      if ($('html').css('font-family') !== 'sans-serif') {
          $('head').append('<link rel="stylesheet" href="/res/vendor/bootstrap-3.3.5-dist/css/bootstrap.min.css">');
      }

      // Event Listeners
      $('#btnDonate').click(function clickDonate(event) {
        event.preventDefault();
        $('#modalDonate').modal('show');
      });
      $('#modalDonate').on('shown.bs.modal', function modalDonateFocus() {
        $('#inputDonate').focus();
      })
      $('#btnRegister').click(function clickRegister(event) {
        event.preventDefault();
        $('#modalRegister').modal('show');
      });
      $('#modalRegister').on('shown.bs.modal', function modalRegisterFocus() {
        $('#modalRegister input').first()
          .focus();
      })
      $('#btnLogin').click(function clickLogin(event) {
        event.preventDefault();
        $('#modalLogin').modal('show');
      });
      $('#modalLogin').on('shown.bs.modal', function modalLoginFocus() {
        $('#modalLogin input').first()
          .focus();
      })
      $('#modalRegister, #modalLogin').on('keypress', function capsTest(event) {
        var s = String.fromCharCode( event.which );
        if ((s.toUpperCase() === s && s.toLowerCase() !== s && !event.shiftKey) ||
        (s.toUpperCase() !== s && s.toLowerCase() === s && event.shiftKey)) {
          $('#modalRegister .modalstatus, #modalLogin .modalStatus').show();
        }
        else if ((s.toLowerCase() === s && s.toUpperCase() !== s && !event.shiftKey) ||
        (s.toLowerCase() !== s && s.toUpperCase() === s && event.shiftKey)) {
          $('#modalRegister .modalstatus, #modalLogin .modalStatus').hide();
        }
      });
      $('#license').click(function clickLicense(event) {
        event.preventDefault();
        $('#modalLicense').modal('show');
      });
      $('#submitRegister').click(function submitRegister(event) {
        event.preventDefault();
        // Confirm that user input is being handled and disable button till user input is processed
        $('#submitRegister').prop('disabled', true)
          .html('<span class="glyphicon glyphicon-refresh spin"></span> Submitting...');
        $.ajax({
          type: 'POST',
          url: '/registerhandler',
          data: $('#modalRegister form').serialize(),
          success: function(msg) {
            $('#modalRegister p').html(msg)
              .fadeIn(function returnSubmitControl() {
                // User input has been handled so return control to the user and reset the submission button
                $('#submitRegister').prop('disabled', false)
                  .html('Submit');
              })
              .delay(1500)
              .fadeOut();
          },
          error: function submitRegisterError() {
            $('#modalRegister p').html('Connection error. Please try again or <a href="mailto:matt@daexsys.com">contact us</a>.')
              .fadeIn(function returnSubmitControl() {
                // User input has been handled so return control to the user and reset the submission button
                $('#submitRegister').prop('disabled', false)
                  .html('Submit');
              })
              .delay(1500)
              .fadeOut();
          }
        });
      });
      $('#submitLogin').click(function submitLogin(event) {
        event.preventDefault();
        // Confirm that user input is being handled and disable button till user input is processed
        $('#submitLogin').prop('disabled', true)
          .html('<span class="glyphicon glyphicon-refresh spin"></span> Submitting...');
        $.ajax({
          type: 'POST',
          url: '/auth',
          data: $('#modalLogin form').serialize(),
          success: function(msg) {
            /*
            It is standard for the backend to not inform the user what information exactly they have provided is wrong
            In regard to this custom keep responses to a minimum and do not seperate information about username or password
            */
            switch (msg) {
              /*
              This case could be one word and a custom message could be set to $('modalLogin p').html in response
              Example:
              case 'error':
                $('#modalLogin p').html('Incorrect username or password.')
                  .fadeIn()
                  .delay(1500)
                  .fadeOut()
                break;
              */
              case 'Incorrect username or password.':
                $('#modalLogin p').html(msg)
                  .fadeIn(function returnSubmitControl() {
                    // User input has been handled so return control to the user and reset the submission button
                    $('#submitLogin').prop('disabled', false)
                      .html('Submit');
                  })
                  .delay(1500)
                  .fadeOut();
                break;
              default:
                /*
                A login response will contain three parameters in a string:
                'msg;cookie;redirecton'
                'Welcome, testificatealice;1442846245957;/account'
                */
                var arr = msg.split(';');
                msg = arr[0]; // Set msg to actual message from response
                var c = arr[1] // Set c to cookie provided in response
                var r = arr[2] // Set r to redirecton page provided in response
                $('#modalLogin p').html(msg)
                  .fadeIn()
                  .delay(1000, function CBLogin() {
                    document.cookie = c; // Set user cookie
                    window.location.href = r; // Redirect user
                  });
            }
          },
          error: function submitLoginError() {
            $('#modalLogin p').html('Connection error. Please try again or <a href="mailto:matt@daexsys.com">contact us</a>.')
              .fadeIn(function returnSubmitControl() {
                // User input has been handled so return control to the user and reset the submission button
                $('#submitLogin').prop('disabled', false)
                  .html('Submit');
              })
              .delay(1500)
              .fadeOut();
          }
        });
      });
    });
})(window.jQuery);
