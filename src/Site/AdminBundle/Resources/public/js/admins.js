"use strict";
var     panels;

jQuery.fn.scrollTo = function(elem, speed) {
    $(this).animate({
        scrollTop:  $(this).scrollTop() - $(this).offset().top + $(elem).offset().top
    }, speed == undefined ? 1000 : speed);
    return this;
};

$.widget( "ui.dialog", $.ui.dialog, {
    _allowInteraction: function( event ) {
        if ( this._super( event ) ) {
            return true;
        }
        if ( event.target.ownerDocument != this.document[ 0 ] ) {
            return true;
        }
        if ( $( event.target ).closest( ".cke_dialog" ).length ) {
            return true;
        }
        if ( $( event.target ).closest( ".cke" ).length ) {
            return true;
        }
    },
    _moveToTop: function ( event, silent ) {
        if ( !event || !this.options.modal ) {
            this._super( event, silent );
        }
    }
});

$.datepicker.setDefaults($.datepicker.regional['ru']);
$.timepicker.setDefaults($.timepicker.regional['ru']);

Date.prototype.daysInMonth = function() {
    return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
};

var clearstimeouts = function()
{
  clearTimeout(refdt);
};

var cleartimearr = function()
{
    if(rfrarr && rfrarr.length){
        var ln = rfrarr.length;
        for(var i=0;i<ln;i++){
            clearTimeout(rfrarr[i]);
        }
    }
};

var clearcutttm = function(idx)
{
    if(parseInt(idx)>=0){
        clearTimeout(rfrarr[idx]);
    }
};

var upd_dtime = function(){
    time=new Date();
    sccd=time.getDate();
    sccm=time.getMonth();
    sccy=time.getFullYear();
    time_sec=time.getSeconds();
    time_min=time.getMinutes();
    time_hours=time.getHours();
};

var upd_toptime = function(){
    var dtms = '', ctms = '', secc = '',minns='';
    var $ctime = $('#ctime');
        if(refdttm){
            clearTimeout(refdttm);
            refdttm = null;
        }
        upd_dtime();
        if($ctime){
            if(time_min<10){
                minns = '0'+''+time_min;
            } else {
                minns = time_min;
            }
            if(time_sec<10){
                secc = '0'+''+time_sec;
            } else {
                secc = time_sec;
            }
            ctms = time_hours+':'+minns+':'+secc;
            $ctime.html(ctms);

            dtms = sccd+' '+currmn[sccm]+' '+sccy+'г.';
            $ctime.attr('title',dtms);

        }
    refresh_topdatetime();
};

var refresh_topdatetime = function(){
    refdttm = setTimeout(function(){upd_toptime();}, 1000);
};

var wats_nrfrm = function(objid)
{
    return $('#'+objid).serializeJSON({ checkboxUncheckedValue: "0" });
};

var refresh_modpgcont = function(modname,mpage,mspage,cause,deystv,obj){
    var send = {};
    send.modcause = cause;
    send.module = modname;
    send.page = mpage;
    send.subpg = mspage;
    send.deystvie = deystv;
    send.objs = obj;
    //console.log(send);
    refdt = setTimeout(function(){change_modpage(send);}, 7000);
};

var send_findarr = function(modname,mpage,mspage,cause,deystv,objid)
{
    var send = {};
    send.modcause = cause;
    send.module = modname;
    send.page = mpage;
    send.subpg = mspage;
    send.deystvie = deystv;
    send.objs = wats_nrfrm(objid);
    //console.log(send);
    change_modpage(send);
};

var change_modpage = function(sobj)
{
    clearstimeouts();
    sendsreq(sobj);
};

var show_printab_styles = function(pr)
{
    var prtdv = '<div class="printstyles">'+pr+'</div>';
    var iframe=$('<iframe id="print_frame">');
    $('body').append(iframe);
    var $print_frame = $('#print_frame');
    var doc = $print_frame[0].contentDocument || $print_frame[0].contentWindow.document;
    var win = $print_frame[0].contentWindow || $print_frame[0];
    var styles = '.printstyles {display: block; margin: 4px auto;padding: 5px 15px 5px 15px;}';
    styles += ' .printstyles th {font-size:12px;background-color: #ffffff;color: #000000;line-height: 20px;text-align:center;font-weight:bold;padding: 3px 5px 3px 5px;min-height: 26px;} ..printstyles tbody tr { background-color: #FFFFFF;color: #170C00;}';
    styles += ' .printstyles table {width: 100%;border-collapse: collapse;margin: 0px auto;} .printstyles tbody tr.slide {background-color: #d6d8da;color: #170C00;}';
    styles += ' .printstyles td {font-size: 12px !important;text-align: center;line-height: 20px !important;padding: 2px 5px 2px 5px;border-bottom: 1px solid #0c1244;min-height: 24px;} .verts {width: 18px;height: 100px;} .verts text {fill: #170C00;}';

    $(doc).contents().find('head').append('<style type="text/css">'+styles+'</style>');
    doc.getElementsByTagName('body')[0].innerHTML=prtdv;
    win.print();
    $('iframe').remove();

    //show_printab(prtdv);
};

var show_printab = function(pr){
    var iframe=$('<iframe id="print_frame">');
    $('body').append(iframe);
    var $print_frame = $('#print_frame');
    var doc = $print_frame[0].contentDocument || $print_frame[0].contentWindow.document;
    var win = $print_frame[0].contentWindow || $print_frame[0];
    doc.getElementsByTagName('body')[0].innerHTML=pr;
    win.print();
    $('iframe').remove();
};

var getObj = function(objID)
{
    "use strict";
    if (document.getElementById) {return document.getElementById(objID);}
    else if (document.all) {return document.all[objID];}
    else if (document.layers) {return document.layers[objID];}
};

var getElementPosition = function(elemId)
{
    "use strict";
    var elem = getObj(elemId);
    var w = elem.offsetWidth;
    var h = elem.offsetHeight;
    var l = 0;
    var t = 0;
    while (elem)
    {
        l += elem.offsetLeft;
        t += elem.offsetTop;
        elem = elem.offsetParent;
    }
    return {"left":l, "top":t, "width": w, "height":h};
};

var getcurdtime = function(key){
    var tme = '';
    var hr0 = '', mn0 = '', sc0 = '' ,d0='', m0='';
    upd_dtime();

    if(sccd<10)d0='0';
    if(sccm<9)m0='0';
    if(time_hours<10)hr0='0';
    if(time_min<10)mn0='0';
    if(time_sec<10)sc0='0';

    tme = sccy+'-'+m0+(sccm+1)+'-'+d0+sccd+' '+hr0+time_hours+':'+mn0+time_min+':'+sc0+time_sec;

    var $selkey = $('#'+key);
    if($selkey){
        $selkey.val(tme);
    }
};

var show_currdate = function(key){
    var tme = '';
    var d0='', m0='';
    upd_dtime();

    if(sccd<10)d0='0';
    if(sccm<9)m0='0';

    tme = d0+sccd+'.'+m0+(sccm+1)+'.'+sccy;
    if(key) {
        var $selkey = $('#'+key);
        if($selkey){
            $selkey.val(tme);
        }
    } else {
        return tme;
    }
};

var return_currdate = function()
{
    var tme = '';
    var d0='', m0='';
    upd_dtime();

    if(sccd<10)d0='0';
    if(sccm<9)m0='0';

    tme = d0+sccd+'.'+m0+(sccm+1)+'.'+sccy;

    return tme;
};

var transtosqldt = function(jsdt){
	var arrdt = jsdt.split('.');
	return arrdt[2] + '-'+ arrdt[1] + '-' + arrdt[0] + ' 23:59:59';
};

var fromsqldatetime = function(sqldt)
{
    var out = sqldt;
    var arrf = sqldt.split(' ');
    if(parseInt(arrf.length) === 2){
        var arrdt = arrf[0].split('.');
        var arrtm = arrf[1].split(':');
        if(parseInt(arrdt.length) === 3 && parseInt(arrtm.length) === 3){
            out = arrdt[2]+' '+currmn[arrdt[1]-1]+' '+arrdt[0]+'г. '+arrf[1];
        } else {
            if(parseInt(arrf.length) === 1){
                arrdt = arrf[0].split('.');
                if(parseInt(arrdt.length) === 3){
                    out = arrdt[2]+' '+currmn[arrdt[1]-1]+' '+arrdt[0]+'г.';
                }
            }
        }
    }

    return out;
};

var fromsqldate = function(sqldt)
{
    var out = sqldt;
    var arrf = sqldt.split(' ');
    var arrdt;
    if(parseInt(arrf.length) === 2){
        arrdt = arrf[0].split('-');
        var arrtm = arrf[1].split(':');
        if(parseInt(arrdt.length) === 3 && parseInt(arrtm.length) === 3){
            out = arrdt[2]+' '+currmn[arrdt[1]-1]+' '+arrdt[0]+'г. '+arrf[1];
        }
    } else {
        if(parseInt(arrf.length) === 1){
            arrdt = arrf[0].split('-');
            if(parseInt(arrdt.length) === 3){
                out = arrdt[2]+' '+currmn[arrdt[1]-1]+' '+arrdt[0]+'г.';
            }
        }
    }

    return out;
};

var showcurrdatetime = function(keys)
{
    var tme = '';
    var hr0 = '', mn0 = '', sc0 = '' ,d0='', m0='';
    upd_dtime();

    if(sccd<10)d0='0';
    if(sccm<9)m0='0';
    if(time_hours<10)hr0='0';
    if(time_min<10)mn0='0';
    if(time_sec<10)sc0='0';
    if(String(keys).trim() === 'start') {
        tme = d0 + sccd + '.' + m0 + (sccm + 1) + '.' + sccy + ' 00:00:00';
    } else if(String(keys).trim() === 'end'){
        tme = d0 + sccd + '.' + m0 + (sccm + 1) + '.' + sccy + ' 23:59:59';
    } else {
        tme = d0 + sccd + '.' + m0 + (sccm + 1) + '.' + sccy + ' ' + hr0 + time_hours + ':' + mn0 + time_min + ':' + sc0 + time_sec;
    }

    return tme;
};

var parsedtfield = function(objid)
{
    var out = '';
    var arrdate = [];
    if(getObj(objid)){
        var arrdt = $('#'+objid).val().split(' ');
        if(arrdt.length === 2){
            arrdate = arrdt[0].split('.');
            if(arrdate.length === 3){
                out = arrdate[2]+'-'+arrdate[1]+'-'+arrdate[0]+' '+arrdt[1];
            }
        } else {
            if(arrdt.length === 1){
                arrdate = arrdt[0].split('.');
                if(arrdate.length === 3){
                    out = arrdate[2]+'-'+arrdate[1]+'-'+arrdate[0];
                }
            }
        }
    }
    return out;
};

var transtosqldtct = function(jsdt){
    var hr0 = '', mn0 = '', sc0 = '' ,d0='', m0='';
    upd_dtime();
    if(time_hours<10)hr0='0';
    if(time_min<10)mn0='0';
    if(time_sec<10)sc0='0';

    var arrdt = jsdt.split('.');
    return arrdt[2] + '-'+ arrdt[1] + '-' + arrdt[0] + ' '+hr0+time_hours+':'+mn0+time_min+':'+sc0+time_sec;
};

var addnull = function(d,m,y)
{
    var d0='',m0='';
    if (d<10)d0='0';
    if (m<10)m0='0';
    return y+'-'+m0+m+'-'+d0+d+'';
};

var sqltopointdt = function(sqldt)
{
    var extdt = "";
    if(String(sqldt).trim() !== ""){
        var arrdt = sqldt.split('-');
        extdt = arrdt[2]+'.'+arrdt[1]+'.'+arrdt[0];
    } else {
        extdt = sqldt;
    }

    return extdt;
};

var cleardiv = function (divname,clearsobj) {
    var $divname = $('#'+divname);
    if ($divname.is(":hidden")) {
        $divname.show(400);
    } else {
        $divname.hide(400);
        $('#'+clearsobj).val('');
    }
};

var togledivls = function(shows,hides1,hides2){
    toglediv(shows);
    hidediv(hides1);
    hidediv(hides2);
};

var togledivnr = function(shows,hides1,hides2){
    showdiv(shows);
    hidediv(hides1);
    hidediv(hides2);
};

var toglediv = function(divname)
{
    var $divname = $('#'+divname);
    if ($divname.is(":hidden")) {
        $divname.show("fast");
    } else {
        $divname.hide("fast");
    }
};

var showdiv = function(divname)
{
    var $divname = $('#'+divname);
    if ($divname.is(":hidden")) {
        $divname.show("fast");
    }
};

var hidediv = function(divname)
{
    var $divname = $('#'+divname);
    if (!$divname.is(":hidden")) {
        $divname.hide("fast");
    }
};

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};

var escapeHtml = function(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
};

var shows_fancyform = function(size,forms)
{
    var shdiv = $('<div id="moddiv" class="formdlgs" tmid="'+size.tmid+'" style="display: none; margin: 0 auto;">'), hg = 280, vg = 300;
    $('body').append(shdiv);
    var frm = '';
        frm = '<div>'+forms+'</div>';
        if(size && size.height && size.weight) {
            hg = size.height;
            vg = size.weight;
        }
        var $moddiv = $("#moddiv");
    $moddiv.html(frm);

    $moddiv.modal({
        containerCss: {
            height: hg,
            width: vg
        },
        onClose: function(dialog){
            var size = {"tmid": $('#moddiv').attr("tmid")};
            //console.log(size);
            if(size && size.tmid > 0){
                clearcutttm(size.tmid);
            }
            dialog.data.fadeOut('fast', function () {
                dialog.container.fadeOut('fast', function () {
                    dialog.overlay.fadeOut('fast', function () {
                        // $(this).html('');
                        setTimeout(function(){$("#moddiv").remove();},200);
                        $.modal.close();
                    });
                });
            });
        },
        onOpen: function(dialog){
            var size = {"tmid": $('#moddiv').attr("tmid")};
            //console.log(size);
            if(size)
            {
                //$("#payls").mask("(999999)");
                //$("#paysumm").mask("99999");
            }
            dialog.overlay.fadeIn(100, function () {
                dialog.container.fadeIn('fast', function () {
                    dialog.data.fadeIn('fast');
                });
            });
        }
    });
};

var shows_confirmsform = function(size,forms)
{
    var shdiv = $('<div id="alertdiv" class="formdlgs" style="display: none; margin: 0 auto;">'), hg = 280, vg = 300;
    $('body').append(shdiv);
    var frm = '';
    var $alertdv = $("#alertdiv");
    frm = '<div>'+forms+'</div>';
    if(size && size.height && size.weight) {
        hg = size.height;
        vg = size.weight;
    }
    $alertdv.html(frm);

    $alertdv.modal({
        containerCss: {
            height: hg,
            width: vg
        },
        onClose: function(dialog){
            dialog.data.fadeOut('fast', function () {
                dialog.container.fadeOut('fast', function () {
                    dialog.overlay.fadeOut('fast', function () {
                        setTimeout(function(){$("#alertdiv").remove();},200);
                        $.modal.close();
                    });
                });
            });
        },
        onOpen: function(dialog){
            dialog.overlay.fadeIn(100, function () {
                dialog.container.fadeIn('fast', function () {
                    dialog.data.fadeIn('fast');
                });
            });
        }
    });
};

/*
var sends = {
     "id": parseInt(idarr[1]),
     "uid": parseInt(idarr[2]),
     confirms: function(){
        var send = {
           "id": this.id,
           "uid": this.uid
        };

        tch.sendreq('delabontechcomms',send);
       //console.log(send);
     }
};
confirmsbox('Подтверждаете удаление данного коментария?',sends);
*/

var confirmsbox = function(msg,objs)
{
    var sfrm = '';
    sfrm += '<div style="margin: 0 auto; border: 1px solid #c9cccf; padding 4px;">';
    sfrm += '<div style="text-align: center; margin: 0 auto; line-height: 32px; height: 100px;">'+msg+'</div>';
    sfrm += '<div style="text-align: center; margin: 0 auto; margin-top: 5px; margin-bottom: 5px; height: 30px;">';
    sfrm += '<button id="canseles" class="btn-confs">Отмена</button>';
    sfrm += '<button id="confirmes" class="btn-confs">Подтверждаю</button>';
    sfrm += '</div>';
    sfrm += '</div>';
    var sz = {};
    sz.weight = 300;
    sz.height= 185;
    shows_confirmsform(sz,sfrm);
    $("#canseles").click(function(){
        $.modal.close();
    });
    $("#confirmes").click(function(){
        objs.confirms();
        $.modal.close();
    });
};

var numKeys = function(obj)
{
    var count = 0;
    for(var prop in obj)
    {
        count++;
    }
    return count;
};

var datamod = {
    "modcause": '',
    "module": '',
    "page": '',
    "subpg": '',
    "deystvie": '',
    "objs": {}
};

var replcurr = function(obj,key)
{
    if(parseInt(key) === 0){
        if (/[^А-ЯЁа-яё]/.test($(obj).val()[$(obj).val().length - 1])) {
            $(obj).val($(obj).val().slice(0, -1));
        }
    }
    if(parseInt(key) === 1){
        if (/[^0-9]/.test($(obj).val()[$(obj).val().length - 1])) {
            $(obj).val($(obj).val().slice(0, -1));
        }
    }
    if(parseInt(key) === 2){
        if($(obj).val().length === 1){
            if (/^[^0-9 ]$/.test($(obj).val())) {
                $(obj).val('');
            }
        } else {
            if (/[^0-9(\.|\-а-яё)]/.test($(obj).val()[$(obj).val().length - 1])) {
                $(obj).val($(obj).val().slice(0, -1));
            }
        }
    }
    if(parseInt(key) === 3){
        if (/[^0-9А-ЯЁ]/.test($(obj).val()[$(obj).val().length - 1])) {
            $(obj).val($(obj).val().slice(0, -1));
        }
    }
    if(parseInt(key) === 4){
        if (/[^0-9А-ЯЁа-яё\-]/.test($(obj).val()[$(obj).val().length - 1])) {
            $(obj).val($(obj).val().slice(0, -1));
        }
    }
    if(parseInt(key) === 5){
        if (/[^0-9А-ЯЁа-яё№\.\- ]/.test($(obj).val()[$(obj).val().length - 1])) {
            $(obj).val($(obj).val().slice(0, -1));
        }
    }
    if(parseInt(key) === 6){
        if (/[^0-9\(\)\+\-]/.test($(obj).val()[$(obj).val().length - 1])) {
            $(obj).val($(obj).val().slice(0, -1));
        }
    }
    if(parseInt(key) === 7){
        if (/[^0-9(\.|\-а-яё)]/.test($(obj).val()[$(obj).val().length - 1])) {
            $(obj).val($(obj).val().slice(0, -1));
        }
    }
    if(parseInt(key) === 8){
        if (/[^0-9\.\+\-]/.test($(obj).val()[$(obj).val().length - 1])) {
            $(obj).val($(obj).val().slice(0, -1));
        }
    }
};

var sendsreq = function(objs)
{
	$.ajax({
        url: window.location.pathname,
        data: JSON.stringify(objs),
        type: 'POST',
        dataType: 'json',
        error: function(err){
            console.error(err);
        },
        success: function (result) {
            if (result.cause) {
                //console.log(result);

                if (result.cause === 'exit') {
                    window.location = '/logout';
                } else if (result.cause === 'firstpg') {
                    window.location = window.location.pathname;
                } else if (result.cause === 'denyperm') {
                    window.location = '' + result.location + '';
                } else if (result.cause === 'error') {
                    console.error(result.errors);
                } else {
                    panels.callback_panel(result);
                }
            } else if (result.refresh) {
                if (result.refresh === 'modselect') {
                    returnreloadmodselect(result.sels);
                }

            } else if (result.modcause) {
                callback_module(result);
            }
        }
    });
};

var uplimage = function(idfrm,names)
{
    var outs = '';
    var fd = new FormData();
    fd.append('supdadm', $("#"+idfrm).prop('files')[0]);
    fd.append('methods', 'uploads');
    fd.append('sends', names);
    if(fd)
    {
        $.ajax({
            url: basepath,
            data: fd, //JSON.stringify(objs),
            type: 'POST',
            processData: false,
            contentType: false,
            cache: false,
            dataType: "json",
            error: function(err){
                console.error(err);
            },
            success: function (result) {
                if(result.cause) {
                    if (result.cause === 'uploads') {

                    }
                }
            }
        });
    }
};

var init_fulleditor = function(idtarea,heights)
{
    CKEDITOR.replace(idtarea, {
        height: parseInt(heights),
        toolbar: [
            {name: 'document', items: ['Source', '-', 'NewPage', 'DocProps', 'Preview', '-', 'Templates']},
            {name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']},
            {name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'SpellChecker']}, '/',
            {
                name: 'basicstyles',
                items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']
            },
            {
                name: 'paragraph',
                items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl']
            },
            {name: 'links', items: ['Link', 'Unlink', 'Anchor']},
            {name: 'insert', items: ['Image', 'Flash', 'Youtube', 'Table', 'HorizontalRule', 'SpecialChar']},
            '/',
            {name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize']},
            {name: 'colors', items: ['TextColor', 'BGColor']},
            {name: 'tools', items: ['ShowBlocks']}
        ]
    });
};

var init_smalleditor = function(idtarea,heights)
{
    CKEDITOR.replace(idtarea, {
        height: parseInt(heights),
        toolbar: [
            {name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo']},
            {
                name: 'basicstyles',
                items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat']
            },
            '/',
            {name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize']},
            {name: 'colors', items: ['TextColor', 'BGColor']},
            {name: 'tools', items: ['ShowBlocks']}
        ]
    });
};

var init_minieditor = function(idtarea,heights)
{
    CKEDITOR.replace(idtarea, {
        height: parseInt(heights),
        toolbar: [
            {name: 'clipboard', items: ['Cut', 'Copy', 'Paste']},
            {
                name: 'basicstyles',
                items: ['Bold', 'Italic', 'Underline']
            },
            {name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize']}
        ]
    });
};

var shows_fullviews = function(hrefs,titls)
{
    $.fancybox.open([
        {
            href : hrefs,
            title : titls
        }
    ], {
        openEffect	: 'elastic',
        closeEffect	: 'elastic',
        padding : 0,
        helpers: {
            overlay: {
                locked: false
            },
            title : {
                type : 'over'
            }
        }
});

    return false;
};

var clear_block = function(objid)
{
    $('#'+objid).html('');
};

var clear_value = function(objid)
{
    $('#'+objid).val('');
};

var inpobjs = {
    genbuttons: function(obj){
        var blk = '', style ='';
        if(obj && obj.selects){
            if(obj.css){
                style=' style="'+obj.css+'"';
            }
            blk += '<div id="'+obj.selects+'"'+style+'>';
            if(obj.idadd){
                blk += '<img id="add:'+obj.idadd+'" src="/modules/'+curview+'/img/add.png" class="btn btn-smini" style="width: 16px; height: 16px; margin-right: 2px; margin-left: 2px;" alt="" title="Добавить" />';
            }
            if(obj.idedt){
                blk += '<img id="edt:'+obj.idedt+'" src="/modules/' + curview + '/img/edfrm.png" class="btn btn-smini" style="width: 16px; height: 16px; margin-right: 2px; margin-left: 2px;" alt="" title="Изменить">';
            }
            if(obj.iddel){
                blk += '<button id="del:'+obj.iddel+'" class="btn btn-smini btn-helpgtv" style="height: 16px; width: 16px; margin-right: 2px; margin-left: 2px;" title="Удалить"></button>';
            }
            blk += '</div>';
        }
        return blk;
    },
    genblktworow: function(obj){
        var blk = '', classtop='', classbott = '', style ='', styleleft='', stylerich='';
        if(obj){
            if(obj.css){
                style=''+obj.css+'';
            }
            if(obj.cltop){
                classtop=' class="'+obj.cltop+'"';
            }
            if(obj.clbott){
                classbott=' class="'+obj.clbott+'"';
            }
            if(obj.stleft){
                styleleft=' '+obj.stleft+'';
            }
            if(obj.strigh){
                stylerich=' '+obj.strigh+'';
            }
            blk += '<div style="display: table;'+style+'">';
            blk += '<div'+classtop+' style="display: table-cell;'+styleleft+'">' + obj.info + '</div>';
            blk += '<div'+classbott+' style="display: table-cell;'+stylerich+'">' + obj.params + '</div>';
            blk += '</div>';
        }
        return blk;
    },
    genblkinl: function(obj){
        var blk = '', classtop='', classbott = '', style ='', stylebot='', btnadd='';
        if(obj){
            if(obj.css){
                style=' style="'+obj.css+'"';
            }
            if(obj.cssbt){
                stylebot=' style="position: relative; padding-right: 30px;"';
                btnadd='<img src="/modules/'+curview+'/img/add.png" class="btn btn-smini" style="position: absolute; top: 1px; right: 5px;" alt="" title="Добавить" onclick="'+obj.cssbt+'" />';
            }
            if(obj.cltop){
                classtop=' class="'+obj.cltop+'"';
            }
            if(obj.clbott){
                classbott=' class="'+obj.clbott+'"';
            }
            blk += '<div'+style+'>';
            blk += '<div'+classtop+''+stylebot+'>' + obj.info + ''+btnadd+'</div>';
            blk += '<div'+classbott+'>' + obj.params + '</div>';
            if(obj.fullinf) {
                blk += '<div' + classbott + ' style="margin-top: 10px;" id="'+obj.fullinf+'"></div>';
            }
            blk += '</div>';
        }
        return blk;
    },
    divinltwoline: function(obj){
        //console.log(obj);
        var blk = '', style='', icl = '', vcl = '', fcl = '';
        if(obj.css){
            style=' style="'+obj.css+'"';
        }
        if(obj.fcl){
            if(String(obj.fcl).trim() !== ''){
                fcl = ' '+obj.fcl+'';
            }
        }
        if(obj.icl){
            if(String(obj.icl).trim() !== ''){
                icl = ' '+obj.icl+'';
            }
        }
        if(obj.vcl){
            if(String(obj.vcl).trim() !== ''){
                vcl = ' '+obj.vcl+'';
            }
        }

        blk += '<div class="inlblkdtf'+fcl+'"'+style+'>';
        if(parseInt(obj.stl) === 0) {
            blk += '<div class="logllps'+icl+'">' + obj.info + '</div><div class="linplps'+vcl+'">' + this.genelemobj(obj.params) + '</div>';
        } else {
            blk += '<div class="linplps'+vcl+'">' + this.genelemobj(obj.params) + '</div><div class="logllps'+icl+'">' + obj.info + '</div>';
        }
        blk += '</div>';

        return blk;
    },
    divtwoline: function(obj){
        //console.log(obj);
        var blk = '', style='', clas='', infcl = '';
        if(obj.css){
            style=' style="'+obj.css+'"';
        }
        if(obj.clas){
            clas=' '+obj.clas+'';
        }
        if(obj.tclas){
            infcl=' '+obj.tclas+'';
        }

        blk += '<div class="inlblkdtf"'+style+'>';
        if(parseInt(obj.stl) === 0) {
            blk += '<div class="logllps'+infcl+'">' + obj.info + '</div><div class="linplps'+clas+'">' + obj.val + '</div>';
        } else {
            blk += '<div class="linplps'+clas+'">' + obj.val + '</div><div class="logllps'+infcl+'">' + obj.info + '</div>';
        }
        blk += '</div>';

        return blk;
    },
    divoneline: function(obj){
        //console.log(obj);
        var blk = '', style='', clas='', infcl = '';
        if(obj.css){
            style=' style="'+obj.css+'"';
        }
        if(obj.clas){
            clas=' '+obj.clas+'';
        }
        if(obj.dcss){
            infcl=' style="'+obj.dcss+'"';
        }
        blk += '<div class="inlblkdtf"'+style+'>';
        blk += '<div class="linplps'+clas+'"'+infcl+'>' + obj.val + '</div>';
        blk += '</div>';

        return blk;
    },
    genelemobj: function(params){
        var ret = '', inarg = '', optsel = '';

        if(params.arg){
            if(params.arg.id && params.arg.id !== ''){
                inarg += ' id="'+params.arg.id+'"';
            }
            if(params.arg.name && params.arg.name !== ''){
                inarg += ' name="'+params.arg.name+'"';
            }
            if(params.arg.css && params.arg.css !== ''){
                inarg += ' style="'+params.arg.css+'"';
            }
            if(params.arg.chk && params.arg.chk !== ''){
                inarg += ' checked="checked"';
            }
            if(params.arg.enbl && params.arg.enbl !== ''){
                inarg += ' disabled="disabled"';
            }
            if(params.arg.argv){
                if(params.type === 'select'){
                    if (params.arg.argv !== '') {
                        optsel = params.arg.argv;
                    }
                } else if(params.type === 'textarea'){
                    if (params.arg.argv !== '') {
                        optsel = params.arg.argv;
                    } else {
                        optsel = '';
                    }
                } else {
                    if (params.arg.argv !== '') {
                        inarg += ' value="' + params.arg.argv + '"';
                    } else {
                        inarg += ' value=""';
                    }
                }
            }
            if(params.arg.onch && params.arg.onch !== ''){
                inarg += ' '+params.arg.onch+'';
            }
        }

        if(params.type === 'input'){
            if(params.param === 'text'){
                ret = '<input type="text"'+inarg+' />';
            }
            if(params.param === 'number'){
                ret = '<input type="number"'+inarg+' />';
            }
            if(params.param === 'checkbox'){
                ret = '<input type="checkbox"'+inarg+' />';
            }
            if(params.param === 'password'){
                ret = '<input type="password"'+inarg+' />';
            }
            if(params.param === 'hidden'){
                ret = '<input type="hidden"'+inarg+' />';
            }
        }
        if(params.type === 'select'){
            ret = '<select '+inarg+'>'+optsel+'</select>';
        }
        if(params.type === 'textarea'){
            ret = '<textarea '+inarg+'>'+optsel+'</textarea>';
        }

        return ret;
    }
};

var modgen_startpg = function(obj)
{
    if(obj){
        var tmpl = "";
        var $fmpgid = $("#fmpgid");
        if(obj.objs && obj.objs.length) {
            var len = obj.objs.length;
            var menus = obj.objs;
            var starts = "";
            for (var m = 0; m < len; m++) {
                if (m === 0) {
                    starts = menus[m].mkey;
                    tmpl = '<li><div id="men_'+menus[m].mkey+'" class="pgsel" unselectable=on>' + menus[m].mval + '</div></li>';
                } else {
                    tmpl += '<li><div id="men_'+menus[m].mkey+'" unselectable=on>' + menus[m].mval + '</div></li>';
                }
            }
        }

        $fmpgid.html(tmpl);
        $fmpgid.find("li div").click(function(){
            if($(this).attr("id")){
                if(String($(this).attr("id")).trim() !== ""){
                    var arid = String($(this).attr("id")).trim().split("_");
                    if(arid.length === 2){
                        change_modulepage(arid[1]);
                        $fmpgid.find('li div.pgsel').removeClass('pgsel');
                        $(this).addClass('pgsel');
                    }
                }
            }
        });
        change_modulepage(starts);
    }
};

var returnreloadmodselect = function(obj)
{
    if(obj && obj.length){
        var $slmod = $('#slmod');
        var currsel = $slmod.val();
        var usesel = false;
        $slmod.empty();
        for(var opt in obj){
            $slmod.append($("<option></option>").attr("value", obj[opt].id).text(obj[opt].name));
            if(parseInt(obj[opt].id) === parseInt(currsel)){
                usesel = true;
            }
        }
        if(usesel){
            $slmod.val(currsel);
        } else {
            $slmod.val(0);
            //change_fgrp(0,'admmod','mods');
        }
    }
};

var initpanel = function(mod,pg)
{
    panels = new livepanel();
    panels.init_page(mod,pg);
    $('#top').find('ul li a').click(function(){
        $('#top').find('a.selects').removeClass('selects');
        $(this).addClass('selects');
    });
    $('#fmpgid').find('li div').click(function(){
        $('#fmpgid').find('li div.pgsel').removeClass('pgsel');
        $(this).addClass('pgsel');
        if($(this).attr("id")) {
            if (String($(this).attr("id")).trim() !== "") {
                var params = String($(this).attr("id")).trim().split("|");
                if(params.length === 2) {
                    panels.select_sysmenu(params[0], params[1]);
                }
            }
        }
    });
};
