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
        var exec_url = 'https://script.google.com/macros/s/AKfycbx8U1IMSprqM2S3WLSUQmUfcozhzrSVhVMVwZROn7_yrYy4-S8/exec';
        exec_url = 'https://script.google.com/macros/s/AKfycbzs-57d16VvQwxCAVZ8ItwZZ_lSH2QjreEY0KrtAvSsxtjErHgOA_I-wSLYHnVksQQ/exec';
        exec_url = 'https://script.google.com/macros/s/AKfycbwt-ekKXe1nksJ2fe1gdsXXh0yvbNERgDY3ucFJfQyQjPas-MXKAXYWc6BXVD2a8Lg/exec';
        exec_url = 'https://script.google.com/macros/s/AKfycbwoc4RJ-TRMFhmEc75Pz4rKwbOHVS2LT0WCyW_ISVD8J_v6hXZ1NUnBrkmy-lOv8Eg/exec';
        sendData(formData, exec_url);
    });

    function sendData(formData, url) {
        $(".loading").show();
        
        var jqxhr = $.post(url, formData, function(data) {
            //console.log("Success! Data: " + JSON.stringify(data));
            if(data.result == "success" && data.name && data.name.length > 0) {
                var name = '', college_dept_school_org = '', certificateNumber = '';
                var btn_p_w1 = '', btn_p_w2 = '';

                name = data.name;
                college_dept_school_org = data.college_dept_school_org;
                certificateNumber = data.certificateNumber;

                if(data.isCompletion)
                    btn_p_w1 = "<button id='gencert_1' class='btn btn-cyan waves-effect waves-light btn-background btn-block'><i class='fa fa-download'></i>" + certName[0] + " Certificate<i class='fa fa-circle-o-notch fa-spin loading1' style='display:none;'></i></button>";
                
                if(data.isAttendance)
                    btn_p_w2 = "<button id='gencert_2' class='btn btn-cyan waves-effect waves-light btn-background btn-block'><i class='fa fa-download'></i>" + certName[1] + " Certificate<i class='fa fa-circle-o-notch fa-spin loading1' style='display:none;'></i></button>";
                
                var ehtml = "<div class='text-center'><h3 class='dark-grey-text'><strong>Verified</strong></h3><hr></div><div class='text-center'>Welcome!<h5 class='dark-grey-text'><strong>" + name + "</strong></h5></div><div class='text-center'  id='tryagain'>"+btn_p_w1+btn_p_w2+"</div>";
                $("#gcontent").html("" + ehtml);

                //////////////
                var eachCert = 0;
                for (eachCert = 0; eachCert < 2; eachCert++) {
                    $("#gencert_" + eachCert).on('click', function () {
                        $(".loading1").show();
                        $(this).attr('disabled', true);
                        var t = new jsPDF();
                        if (t != null) {
                            var cert_id = $(this).attr('id').split("_")[1];
                            jsDoc(imgData[cert_id - 1], certName[cert_id - 1], name, college_dept_school_org, certificateNumber);
                            $(".loading1").hide();
                            $(this).attr('disabled', false);
                        } else {
                            ("#tryagain").html("<h5 class='deep-orange-text'>Something went wrong..</h5><a href='" + url + "' class='btn btn-cyan waves-effect waves-light'>Try Again!</a>");
                        }
                    });
                }
                //eachCert = 0;
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


function jsDoc(imgData, certName, name, college_dept_school_org, certificateNumber) {

    var doc = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4'
    });
	
    doc.addImage(imgData, 'JPEG', 0, 0, 450, 632);
    doc.setTextColor(0, 80, 130);
    doc.setFontSize(15);
    doc.text(name, 225, 292, null, null, 'center');
    doc.setFontSize(12);
    doc.text(college_dept_school_org, 225, 342, null, null, 'center');
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(10);
    doc.text(certificateNumber, 150, 585, null, null, 'center');
    doc.save("Certificate_of_"+name+".pdf");
}