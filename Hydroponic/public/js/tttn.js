
// Register Form
$(function() {
    var button = $('#registerButton');
    var box = $('#registerBox');
    var form = $('#registerForm');
    button.removeAttr('href');
    button.mouseup(function(register) {
        box.toggle();
        button.toggleClass('active');
    });
    form.mouseup(function() {
        return false;
    });
    $(this).mouseup(function(register) {
        if(!($(register.target).parent('#registerButton').length > 0)) {
            button.removeClass('active');
            box.hide();
        }
    });
});


// After login Form
$(function() {
    var button = $('#loggedInButton');
    var box = $('#loggedInBox');
    var form = $('#loggedInForm');
    button.removeAttr('href');
    button.mouseup(function(register) {
        box.toggle();
        button.toggleClass('active');
    });
    form.mouseup(function() {
        return false;
    });
    $(this).mouseup(function(register) {
        if(!($(register.target).parent('#loggedInButton').length > 0)) {
            button.removeClass('active');
            box.hide();
        }
    });
});
