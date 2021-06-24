$(document).ready(function () {

    $(".iloading").hide();
    $(".loading").hide();
    $("#gcontent").show();
    $("#sendbtn").show();

    $('#gform').bootstrapValidator({
        fields: {
            ge: {
                validators: {
                    notEmpty: {
                        message: 'Your email is required'
                    },
                    stringLength: {
                        max: 60,
                        message: 'Your email should be less than 60 characters'
                    }
                }
            }
        }
    }).on('success.form.bv', function (e) {
        e.preventDefault();
        var eg = $("#genemail").val();
        $form = $(e.target);
        var bv = $form.data('bootstrapValidator');
        var formData = $form.serialize();
        formData.email = eg;
        //var exec_url = 'https://script.google.com/macros/s/AKfycbzboyJPvZzHnzh9h9zWU2YHWxAQv7T8OFPkiwJjs8USqEm1Vg/exec';
        var exec_url = 'https://script.google.com/macros/s/AKfycbzHXZcPsgWUZuKxNH1GfOHNzAENBbsKD2P8Auf9hZiC9WtRBkA8GnHgULK6HYPq-Lk/exec';
        sendData(formData, exec_url);
    });

    function sendData(formData, url) {
        $(".loading").show();

        var jqxhr = $.post(url, formData, function(data) {
            console.log("Success! Data: " + JSON.stringify(data));
            if(data.result == "success" && data.name && data.name.length > 0) {
                var n = '';
                var btn='';

                n = data.name;

                if(data.is_attended)
                    btn = "<button id='gencert' class='btn btn-cyan waves-effect waves-light btn-background btn-block'><i class='fa fa-download'></i>Attendance Certificate<i class='fa fa-circle-o-notch fa-spin loading1' style='display:none;'></i></button>";

                var ehtml = "<div class='text-center'><h3 class='dark-grey-text'><strong>Verified</strong></h3><hr></div><div class='text-center'>Welcome!<h5 class='dark-grey-text'><strong>" + n + "</strong></h5></div><div class='text-center'  id='tryagain'>"+btn+"</div>";
                $("#gcontent").html("" + ehtml);

                //////////////
                $("#gencert").on('click', function () {
                    $(".loading1").show();
                    $(this).attr('disabled', true);
                    var t = new jsPDF();
                    if (t != null) {
                        jsDoc(imgData, "Attendance", n);
                        $(".loading1").hide();
                        $(this).attr('disabled', false);
                    } else {
                        ("#tryagain").html("<h5 class='deep-orange-text'>Something went wrong..</h5><a href='" + url + "' class='btn btn-cyan waves-effect waves-light'>Try Again!</a>");
                    }
                });
            } else {
                $("#tryagain").html("<h5 class='deep-orange-text'>This Email is not Verified !</h5>");
            }
            $(".loading").hide();
            // $(location).attr('href',redirectUrl);
        }).fail(function(data) {
                console.warn("Error! Data: " + JSON.stringify(data));
                // HACK - check if browser is Safari - and redirect even if fail b/c we know the form submits.
                if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                    //alert("Browser is Safari -- we get an error, but the form still submits -- continue.");
                    // $(location).attr('href',redirectUrl);
                }
                $(".loading").hide();
                $("#tryagain").html("<h5 class='deep-orange-text'>Something went wrong..</h5><a href='"+url+"' class='btn btn-cyan waves-effect waves-light'>Try Again!</a>");
            });
    }
});


function jsDoc(imgData, certName, name) {

    var doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'a4'
    });

    doc.addImage(imgData, 'JPEG', 0, 0, 632, 450);
    doc.setTextColor(0, 80, 130);
    doc.setFontSize(18);
    doc.text(name, 316, 190, null, null, 'center');
    doc.save("Certificate_of_"+certName+"_"+name+".pdf");
}
