
$( function () {

    //为了批量绑定blur
    var allRegCheckByIdName = {
        chinaName   : "china-name",
        chinaWord   : "china-word",
        password    : "psw",
        confirmpsw  : "confirm-psw",
        idNum       : "id-num",
        place       : "work-place",
        apartment   : "argument",
        technology  : "technology",
        work        : "work-name"
    };

    //全局的input
    var allItems     = {
        img         : $( ".header-img" ),
        chinaName   : $( "#china-name" ),
        chinaWord   : $( "#china-word" ),
        password    : $( "#psw" ),
        confirmpsw  : $( "#confirm-psw" ),
        sexTxt      : $( "#sexTxt" ),
        idNum       : $( "#id-num" ),
        phone       : $( "#phone" ),
        email       : $( "#e-mail" ),
        dateTime    : $( "#dateTime" ),
        educationTxt: $( "#educationTxt" ),
        picker      : $( "#city-picker" ),
        place       : $( "#work-place" ),
        apartment    : $( "#argument" ),
        technology  : $( "#technology" ),
        work        : $( "#work-name" )

    };
    var allItemsTips = {
        img         : "请选择图片",
        chinaName   : "请填写中文姓名",
        chinaWord   : "请填写姓名拼音",
        sexTxt      : "请选择性别",
        password    : "请输入密码",
        confirmpsw  : "请确认密码",
        idNum       : "请输入身份证号码",
        phone       : "请输入手机号码",
        email       : "请输入邮箱",
        dateTime    : "请选择出生日期",
        educationTxt: "请选择最高学历",
        picker      : "请选择地址",
        place       : "请输入工作单位",
        apartment   : "请输入科室部门",
        technology  : "请输入技术职称",
        work        : "请输入行政职务"

    };
    var allItemsReg  = {
        img         : checkImg,
        chinaName   : checkName,
        chinaWord   : checkWord,
        sexTxt      : checkSex,
        idNum       : checkIdNum,
        phone       : checkPhone,
        email       : checkEmail,
        dateTime    : checkTime,
        educationTxt: checkEducation,
        picker      : checkPicker,
        place       : checkPlace,
        apartment   : checkArg,
        technology  : checkTechnology,
        work        : checkWork,
        password    : checkPassword,
        confirmpsw  : checkPasswordIsPwd
    };

    //全局url cityPicker
    var cityPickerDispalyName = [];
    var url = {
        passport: globalUrl.globalUrl + "passport/",
        users   : globalUrl.globalUrl + "users"
    }

    //点击性别
    $( "#sex" ).click( function () {
        $.actions( {
            actions: [ {
                text   : "男",
                onClick: function () {
                    $( "#sexTxt" ).html( this.text );
                }
            }, {
                text   : "女",
                onClick: function () {
                    $( "#sexTxt" ).html( this.text );
                }
            } ]
        } );
    } );

    $( "#image" ).change( function () {

        lrz( this.files[ 0 ], {
            width: 300 //设置压缩参数
        } ).then( function ( rst ) {
            /* 处理成功后执行 */
            //console.log( rst.base64 );
            $(".header-img").attr("src", rst.base64);
            $("#gallery").css("background-image", "url(" +rst.base64 +")");
            $(".header-img-wrap").removeClass("hide");

        } ).catch( function ( err ) {
            /* 处理失败后执行 */
            console.log( err );
            $.toast("图片选取失败,请重试", "forbidden");
        } )

    } )
    //点击图片全屏预览
    $( ".header-img" ).click(function () {
        $(".weui-gallery " ).show();
    });

    $( ".goback" ).click(function () {
        $(".weui-gallery " ).hide();
        $( ".header-img" ).attr("src", "");
        $("#gallery").css("background-image", "url()");
        $( ".header-img-wrap" ).addClass("hide");
    });


    $( "#birth" ).click( function () {

        for ( var i = $( ".picker-items" ).children( "div" ).length - 1; i > 5; i-- ) {
            try {
                $( ".picker-items" ).children( "div" ).eq( i ).remove();
            } catch ( e ) {
                console.log( "删除时分DOM错误" );
                $.toast("截取时间错误请刷新", "forbidden");
                return;
            }
        }
    } );

    $( "#datetime-picker" ).datetimePicker( {
        value   : "",
        onChange: function ( picker, values, displayValues ) {
            $( "#dateTime" ).html( displayValues.join( "-" ).slice( 0, -6 ) );
        }
    } );

    $( "#education" ).click( function () {
        $.actions( {
            actions: [{
                text   : "博士",
                onClick: function () {
                    $( "#educationTxt" ).html( this.text );
                }
            },{
                text   : "硕士",
                onClick: function () {
                    $( "#educationTxt" ).html( this.text );

                }
            },{
                text   : "本科",
                onClick: function () {
                    $( "#educationTxt" ).html( this.text );

                }
            },{
                text   : "专科",
                onClick: function () {
                    $( "#educationTxt" ).html( this.text );

                }
            },{
                text   : "专科以下",
                onClick: function () {
                    $( "#educationTxt" ).html( this.text );

                }
            }]
        } );
    } );

    $("#city-picker").cityPicker({
        title: "请选择地址",
        onChange: function ( picker, values, displayValues ) {
            if( displayValues.length > 20 ) {

            }
            cityPickerDispalyName = displayValues;
        }
    } );

    //手机号失去焦点
    $("#phone").blur(function () {
        var self = $(this);

        var reg = checkReg( "phone", self.val().trim() );

        if( reg ) {
            showArrow(self, reg, "error");
        }

        if( !reg ){
            //var url = "http://192.168.10.180:5000/api/passport/"+  $( "#phone" ).val();
            $.ajax({
                url: url.passport + $( "#phone" ).val(),
                method: "GET",
                success: function (data) {

                    if( data["errno"] !== "0" ){
                        showArrow( self, data["errmsg"], "error");
                        return;
                    }

                    showArrow(self, "", "success");

                },
                error: function ( xmlerr, err) {

                    showArrow( self, "连接服务器失败", "error");

                }
            })
        }

    } );

    //邮箱失去焦点
    $("#e-mail").blur(function () {
        var self = $(this);

        var reg = checkReg( "email", self.val().trim() );

        if( reg ) {
            showArrow(self, reg, "error");
        }

        if( !reg ){
            //var url = "http://192.168.10.180:5000/api/passport/"+  $( "#phone" ).val();
            $.ajax({
                url: url.passport + $( "#e-mail" ).val(),
                method: "GET",
                success: function (data) {

                    if( data["errno"] !== "0" ){
                        showArrow( self, data["errmsg"], "error");
                        return;
                    }

                    showArrow(self, "", "success");

                },
                error: function ( xmlerr, err) {
                    showArrow( self, "连接服务器失败", "error");
                }
            })
        }

    } );

    //不想让k成为全局变量 其他item失去焦点正则批量处理
    (function( ) {
        for (var k in allRegCheckByIdName ) {

            (function (ele, k) {
                var dom = getDOMById(ele[k]);
                dom.onblur = function () {

                    if( this.value.trim().length === 0 ){
                        showArrow( $( "#"+ele[k]+"" ), "必填项", "error");
                        return;
                    }

                    var regIsError = checkReg( k, this.value.trim() );
                    if ( regIsError ) {
                        showArrow( $( "#"+ele[k]+"" ), regIsError, "error");
                    }

                    if( !regIsError ){
                        showArrow( $( "#"+ele[k]+"" ), "", "success" );
                    }
                }
            })(allRegCheckByIdName,k)
        }

    })()

    //提交
    $( "#commit-btn" ).click( function () {

        if( submitCheckItemLength() ) {
             $.alert({
                 title: '提示',
                 text: submitCheckItemLength(),
                 onOK: function () {
                     //点击确认
                 }
             });
             return;
         }

         //post  如果有正则提示，就不给发
        for ( var i = 0;i < $(".regIsOpen").length; i++ ){

            if( !$( ".regIsOpen" ).eq( i ).hasClass("hide") ) {
                $.alert({
                    title: '提示',
                    text: "请检查必填项",
                    onOK: function () {
                        //点击确认
                    }
                });
                return;
            }

        }

        var baseImg = $( ".header-img" ).attr( "src" ).trim();

        var sex     = $( "#sexTxt" ).html().trim();

        if( sex === "男" ) {
            sex = "man";
        }

        if( sex === "女" ){
            sex = "woman";
        }

        $.ajax({
            url    : url.users,
            method : "POST",
            contentType: 'application/json',
            data   : JSON.stringify({
                "username"       : $( "#china-name" ).val().trim(),
                "password"       : $( "#psw" ).val().trim(),
                "repwd"          : $( "#confirm-psw" ).val().trim(),
                "spellname"      : $( "#china-word" ).val().trim(),
                "gender"         : sex,
                "identity_type"  : "身份证".trim(),
                "identity_num"   : $( "#id-num" ).val().trim(),
                "mobile"         : $( "#phone" ).val().trim(),
                "email"          : $( "#e-mail" ).val().trim(),
                "birthday"       : $( "#dateTime" ).html().trim(),
                "hight_degree"   : $( "#educationTxt" ).html().trim(),
                "province"       : cityPickerDispalyName[ 0 ],
                "city"           : cityPickerDispalyName[ 1 ],
                "address"        : cityPickerDispalyName[ 2 ],
                "work_addr"      : $( "#work-place" ).val().trim(),
                "department"     : $( "#argument" ).val().trim(),
                "technical_title": $( "#technology" ).val().trim(),
                "executive_post" : $( "#work-name" ).val().trim(),
                "office_tel"     : $( "#work-phone" ).val().trim(),
                "resume"         : $( "#textarea-txt" ).val().trim(),
                "user_pic"       : baseImg
            }),
            success: function ( data ) {

                if ( data[ "errno" ] !== "0" ) {
                    $.alert({
                        title: '提示',
                        text: data[ "errmsg" ],
                        onOK: function () {
                            //点击确认
                        }
                    });
                    return;
                }

                if( data[ "errno" ] === "0" ){

                    $.alert({
                        title: '提示',
                        text: data[ "errmsg" ],
                        onOK: function () {
                           window.location.href = "./meetingHomePage.html?meetingId=" + loadPageVar( "meetingId" );

                        }
                    });
                }


            },
            error  : function ( xmlerr, err ) {
                $.alert({
                    title: '提示',
                    text: "连接服务器失败",
                    onOK: function () {
                        //点击确认
                    }
                });
            }
        } )

    });

    //回到首页

    $(".go_back").attr( "href", "meetingHomePage.html?meetingId=" + loadPageVar( "meetingId" ) );

    //获取URL参数
    /*
    * param1 { String } 参数名
    * */
    function loadPageVar( sVar ) {
        return decodeURI( window.location.search.replace( new RegExp( "^(?:.*[&\\?]" + encodeURI( sVar ).replace( /[\.\+\*]/g, "\\$&" ) + "(?:\\=([^&]*))?)?.*$", "i" ), "$1" ) );
    }


    //点了提交验证长度
    function submitCheckItemLength () {

        for ( var k in allItems ) {
            //如果为空字符串
            var tempValue = allItems[k].val().trim();
            var tempAttr  = allItems[k].attr("src");
            var tempHtml  = allItems[k].html().trim();

            if( !tempValue && !tempHtml&&!tempAttr ) {
                return allItemsTips[k];
            }
        }

    };

    //需要一个函数，谁调用就匹配谁的正则
    function checkReg ( ele, eleValue ) {
        for ( var k in allItems ) {
            //如果为空字符串
            if( ele === k ) {
                return allItemsReg[k]( eleValue );
            }
        }
    };
    //显示正则验证提示   ele=$(xx)  success or error
    function showArrow ( ele, errorValue,status ) {

        if( status === "success" ){
            ele.parent("div").siblings("span")
                .children().eq(0).removeClass("hide")
                .siblings("span").eq(0).addClass("hide");
        }

        if( status === "error" ){
            ele.parent("div").siblings("span")
                .children().eq(1).removeClass("hide").html(errorValue)
                .siblings("i").eq(0).addClass("hide");
        }

    };


    //绑定失去事件获取DOM使用到
    function getDOMById ( idName ) {
        return document.getElementById(idName);
    };

    //==============================================

    function checkPassword( value ) {
        if( value.length < 6 ) {
            return "密码长度不能小于6位"
        }
    };

    function checkPasswordIsPwd( value ) {
        if( $( "#psw" ).val().trim() !== value ) {
            return "确认密码不匹配";
        }
    };

    function checkPhone( phoneNum ){

        if(!(/^1[34578]\d{9}$/.test(phoneNum))){

            return "手机号码有误";
        }
    };

    function checkName( chinaName ){

        if(!(/^[\u4E00-\u9FA5]{2,4}$/.test(chinaName))){

            return "请输入中文姓名";
        }
    };

    function checkWord( chinaName ){

        if(!(/^[A-Za-z]+$/.test(chinaName))){

            return "请输入姓名拼音";
        }
    };

    function checkImg( ) {
        var temp = allItems["img"].attr("src").trim();
        if( !temp ) {
            return allItemsTips["img"];
        }
    };

    function checkWork ( value ) {
        if( !value ) {
            return allItemsTips['work'];
        }
    }

    function checkTechnology ( value ) {

        if( !value ) {
            return allItemsTips['technology'];
        }
    }

    function checkArg( value ) {
        if( !value ) {
            return allItemsTips['apartment'];
        }
    }

    function checkPlace( value ) {

        if( !value ) {
            return allItemsTips['place'];
        }
    }

    function checkPicker() {

        var tempValue = allItems['picker'].val().trim();
        if( !tempValue ) {
            return allItemsTips['picker'];
        }
    };

    function checkEducation( ) {

        var temp = allItems['educationTxt'].val().trim();
        if( !temp ) {
            return allItemsTips['educationTxt'];
        }
    };

    function checkTime () {
        var tempValue = allItems["dateTime"].html().trim();
        if( !tempValue ) {
            return allItemsTips["dateTime"];
        }

    };

    function checkEmail ( str ) {
        var re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;

        if ( !re.test( str )) {
            return "请输入正确邮箱";
        }
    };

    function checkIdNum ( str ) {
        var re = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if ( !re.test( str )) {
            return "请输入正确身份证号码";
        }

    };

    function checkSex(  ) {
        var tempValue = allItems["sexTxt"].html().trim();
        if( !tempValue ){
            return allItemsTips["sexTxt"];
        }
    };

} )
