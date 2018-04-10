"use strict";

var		refdt       = 0;
var     rfrarr      = [];
var     curview     = '';
var		grpobj		= {};
var		time		= new Date();
var		time_sec	= time.getSeconds();
var		time_min	= time.getMinutes();
var		time_hours	= time.getHours();
var		sccd		= time.getDate();
var		sccm		= time.getMonth();
var		sccy		= time.getFullYear();
var     basepath    = window.location.href;
var     refdttm;
var     currmn      = ['Января','Февраля','Марта','Апреля','Мая','Июня','Июля','Августа','Сентрября','Октября','Ноября','Декабря'];
var     mn          = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентрябрь','Октябрь','Ноябрь','Декабрь'];
var     usstatus    = ['Активен','Заблокирован'];
var     selindex    = 0;

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
        if(refdttm){
            clearTimeout(refdttm);
            refdttm = null;
        }
        upd_dtime();
        if($('#ctime')){
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
            $('#ctime').html(ctms);

            dtms = sccd+' '+currmn[sccm]+' '+sccy+'г.';
            $('#ctime').attr('title',dtms);

        }
    refresh_topdatetime();
};

var refresh_topdatetime = function(){
    refdttm = setTimeout(function(){upd_toptime();}, 1000);
};

var refresh_toppgcont = function(selid,page,spage){
    refdt = setTimeout(function(){change_selfgrp(selid,page,spage);}, 10000);
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

var show_printab_styles = function(pr)
{
    var prtdv = '<div class="printstyles">'+pr+'</div>';
    var iframe=$('<iframe id="print_frame">');
    $('body').append(iframe);
    var doc = $('#print_frame')[0].contentDocument || $('#print_frame')[0].contentWindow.document;
    var win = $('#print_frame')[0].contentWindow || $('#print_frame')[0];
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
    var doc = $('#print_frame')[0].contentDocument || $('#print_frame')[0].contentWindow.document;
    var win = $('#print_frame')[0].contentWindow || $('#print_frame')[0];
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

    if($('#'+key)){
        $('#'+key).val(tme);
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
        if ($('#' + key)) {
            $('#' + key).val(tme);
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
    if(arrf.length == 2){
        var arrdt = arrf[0].split('.');
        var arrtm = arrf[1].split(':');
        if(arrdt.length == 3 && arrtm.length == 3){
            out = arrdt[2]+' '+currmn[arrdt[1]-1]+' '+arrdt[0]+'г. '+arrf[1];
        } else {
            if(arrf.length == 1){
                arrdt = arrf[0].split('.');
                if(arrdt.length == 3){
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
    if(arrf.length == 2){
        arrdt = arrf[0].split('-');
        var arrtm = arrf[1].split(':');
        if(arrdt.length == 3 && arrtm.length == 3){
            out = arrdt[2]+' '+currmn[arrdt[1]-1]+' '+arrdt[0]+'г. '+arrf[1];
        }
    } else {
        if(arrf.length == 1){
            arrdt = arrf[0].split('-');
            if(arrdt.length == 3){
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
    if(keys == 'start') {
        tme = d0 + sccd + '.' + m0 + (sccm + 1) + '.' + sccy + ' 00:00:00';
    } else if(keys == 'end'){
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
    if(sqldt.trim() != ""){
        var arrdt = sqldt.split('-');
        extdt = arrdt[2]+'.'+arrdt[1]+'.'+arrdt[0];
    } else {
        extdt = sqldt;
    }

    return extdt;
};

var cleardiv = function (divname,clearsobj) {
    if ($('#'+divname).is(":hidden")) {
        $('#'+divname).show(400);
    } else {
        $('#'+divname).hide(400);
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
    if ($('#'+divname).is(":hidden")) {
        $('#'+divname).show("fast");
    } else {
        $('#'+divname).hide("fast");
    }
};

var showdiv = function(divname)
{
    if ($('#'+divname).is(":hidden")) {
        $('#'+divname).show("fast");
    }
};

var hidediv = function(divname)
{
    if (!$('#'+divname).is(":hidden")) {
        $('#'+divname).hide("fast");
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
    $("#moddiv").html(frm);

    $("#moddiv").modal({
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

var confirms_box = function(msg,objs)
{
    var sfrm = '';
    var sends = objs.functs;
    sfrm += '<div style="margin: 0 auto; border: 1px solid #c9cccf; padding 4px;">';
    sfrm += '<div style="text-align: center; margin: 0 auto; line-height: 32px; height: 100px;">'+msg+'</div>';
    sfrm += '<div style="text-align: center; margin: 0 auto; margin-top: 5px; margin-bottom: 5px; height: 30px;">';
    sfrm += '<button class="btn-confs" onclick="$.modal.close();">Отмена</button>';
    sfrm += '<button class="btn-confs" onclick="'+sends+'$.modal.close();">Подтверждаю</button>';
    sfrm += '</div>';
    sfrm += '</div>';
    var sz = {};
    sz.weight = 300;
    sz.height= 200;
    shows_confirmsform(sz,sfrm);
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

var changes_mod = function (module) {
    "use strict";
    window.location = ''+module+'';
};

var select_modpg = function (module) {
    "use strict";
    selindex = 0;
    clearstimeouts();
    cleartimearr();
    if(init_module){
        init_module(module);
    }
};

var select_mainpg = function (page) {
    "use strict";
    selindex = 0;
    select_sysmenu(page,'');
};

var init_page = function(mod,pg)
{
    "use strict";
    upd_toptime();
    if(mod.trim() != ""){
        select_modpg(mod);
    } else {
        select_mainpg(pg);
    }

};

var replcur = function(objid,key) {
    if(key==0){
        if(/[^А-ЯЁа-яё]/.test(getObj(objid).value[getObj(objid).value.length-1])){
            getObj(objid).value = getObj(objid).value.slice(0,-1);
        }
    }
    if(key==1){
        if(/[^0-9]/.test(getObj(objid).value[getObj(objid).value.length-1])){
            getObj(objid).value = getObj(objid).value.slice(0,-1);
        }
    }
    if(key==2){
        if(getObj(objid).value.length==1){
            if(/^[^0-9 ]$/.test(getObj(objid).value)){
                getObj(objid).value = "" ;
            }
        } else {
            if(/[^0-9(\.|\-|а-яё)]/.test(getObj(objid).value[getObj(objid).value.length-1])){
                getObj(objid).value = getObj(objid).value.slice(0,-1);
            }}
    }
    if(key==3){
        if(/[^0-9А-ЯЁ]/.test(getObj(objid).value[getObj(objid).value.length-1])){
            getObj(objid).value = getObj(objid).value.slice(0,-1);
        }
    }
    if(key==4){
        if(/[^0-9А-ЯЁа-яё\-]/.test(getObj(objid).value[getObj(objid).value.length-1])){
            getObj(objid).value = getObj(objid).value.slice(0,-1);
        }
    }
    if(key==5){
        if(/[^0-9А-ЯЁа-яё№\.\- ]/.test(getObj(objid).value[getObj(objid).value.length-1])){
            getObj(objid).value = getObj(objid).value.slice(0,-1);
        }
    }
    if(key==6){
        if(/[^0-9\(\)\+\-]/.test(getObj(objid).value[getObj(objid).value.length-1])){
            getObj(objid).value = getObj(objid).value.slice(0,-1);
        }
    }
};

var sendsreq = function(objs)
{
    "use strict";
	var outs = '';
	$.ajax({
        url: window.location.pathname,
        data: JSON.stringify(objs),
        type: 'POST',
        dataType: 'json',
        error: function(err){
            console.error(err);
        },
        success: function (result){
			if(result.cause)
			{
			    //console.log(result);

				if(result.cause === 'exit'){ window.location = '/logout'; }
                if(result.cause === 'firstpg'){ window.location = window.location.pathname; }
                if(result.cause === 'denyperm'){ window.location = ''+result.location+''; }
                if(result.cause === 'select'){
                    //console.error(result);
                    if(result.page.trim() != ""){
                        show_fpage(result);
                    }
                }
                if(result.cause === 'refresh'){
                    //console.log(result);
                    if(result.page.trim() != "" && result.subpg.trim() != ""){
                        show_dyncont(result);
                    }
                }
                if(result.cause === 'listacc'){
                    //console.log(result);
                    show_userform(result);
                }
                if(result.cause === 'listpermobj'){
                    //console.log(result);
                    show_permuser(result);
                }
                if(result.cause === 'listgrp'){
                    //console.log(result);
                    show_groupform(result);
                }
                if(result.cause === 'listpermgrp'){
                    //console.log(result);
                    show_permgroup(result);
                }
                if(result.cause === 'finduser') {
                    //console.log(result);
                    show_findsuser(result);
                }
                if(result.cause === 'error') {
                    console.error(result.errors);
                }
                if(result.cause === 'updpermits') {

                }
                if(result.cause === 'updnewusergroup') {
                    //console.log(result);
                    callback_usersgrp(result);
                }
                if(result.cause === 'delacc') {
                    //console.log(result);
                    ret_delusgrp(result);
                }
                if(result.cause === 'delgrp') {
                    //console.log(result);
                    ret_delusgrp(result);
                }
                if(result.cause === 'listconfmod') {
                    //console.log(result);
                    show_modcfgpgform(result);
                }
                if(result.cause === 'delconfval') {
                    //console.log(result);
                    ret_delusgrp(result);
                }
                if(result.cause === 'updconfval') {
                    //console.log(result);
                    callback_usersgrp(result);
                }
                if(result.cause === 'usedmod') {
                    //console.log(result);
                    print_usedmods(result);
                }
                if(result.cause === 'unusedmod') {
                    //console.log(result);
                    print_usedmods(result);
                }
                if(result.cause === 'enablemods') {
                    //console.log(result);
                    print_usedmods(result);
                }
                if(result.cause === 'deinstallmods') {
                    console.log(result);
                    print_usedmods(result);
                }
                if(result.cause === 'installmods') {
                    //console.log(result);
                    print_usedmods(result);
                }
			} else if(result.refresh){
			    if(result.refresh  === 'modselect') {
                    returnreloadmodselect(result.sels);
                }

            } else if(result.modcause) {
                callback_module(result);
            } else {
                for(var key in result)
                {
                    outs += "Ключ: " + key + " Значение: " + result[key] + "\n";
                }
                console.log(outs);
                console.log(result);
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
            {name: 'document', items: ['Source']},
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

var close_usgrpfrm = function()
{
    $('#usedfrm').html('');
};

var clear_block = function(objid)
{
    $('#'+objid).html('');
};

var clear_value = function(objid)
{
    $('#'+objid).val('');
};

var check_perminput = function(obj,typ)
{
    if(obj) {
        var parentn;
        var idi;
        if($(obj).prop("checked")){
            $(obj).val(1);
        } else {
            $(obj).val(0);
        }

        if (typ == 'list') {
            if (!$(obj).prop("checked")) {
                parentn = obj.parentNode.parentNode;
                var descCount = $(parentn).find('div input[type="checkbox"]').each(function(index, elem) {
                    idi = elem.id.split('_');
                    if(idi[idi.length-1] != 'list' && elem.checked) {
                        elem.checked = false;
                        elem.value = 0;
                    }
                }).length;
            }
        } else {
            if ($(obj).prop("checked")) {
                parentn = obj.parentNode.parentNode;
                var undescCount = $(parentn).find('div input[type="checkbox"]').each(function(index, elem) {
                    idi = elem.id.split('_');
                    if(idi[idi.length-1] == 'list' && !elem.checked) {
                        elem.checked = true;
                        elem.value = 1;
                    }
                }).length;
            }
        }
    }
};

var change_check_single = function(obj)
{
    if(obj) {
        if($(obj).prop("checked")){
            $(obj).val(0);
        } else {
            $(obj).val(1);
        }
    }
};

/* -----------  FORMS ------------- */
var userpage = {
    frmframe: function(lv, newobj)
    {
        var ltbl = "";
        ltbl += '<div class="divusfrm">';
        ltbl += '<div style="position: relative;"><img src="/bundles/admin/img/close.png" style="position: absolute; top: 1px; right: 5px; width: 20px; height: 20px; cursor: pointer;" title="Закрыть" onclick="close_usgrpfrm();"></div>';
        ltbl += '<div>'+this.userform(lv)+'</div>';
        if(newobj == 0) {
            ltbl += '<div>' + this.profileform(lv) + '</div>';
        }
        ltbl += '<div>';

        return ltbl;
    },
    userform: function (lv) {
        var tbl ="";
        var ens = ' disabled="disabled"';
        if(lv == 2){
            tbl += '<form method="post" id="userfrm" action="javascript:void(null);" onSubmit="save_usergrpinfo(this);">';
            tbl += '<table><tr>';
            ens = '';
        } else {
            tbl += '<table><tr>';
        }

        tbl += '<th colspan="2">Пользователь</th>';
        tbl += '</tr><tr>';
        tbl += '<td>Ф. И. О.</td>';
        tbl += '<td><input type="text" name="descr" id="idescr" value=""'+ens+' /></td>';
        tbl += '</tr><tr>';
        tbl += '<td>Группа</td>';
        tbl += '<td><select name="group" id="igroup"'+ens+'></select></td>';
        tbl += '</tr><tr>';
        tbl += '<td>Логин</td>';
        tbl += '<td><input type="text" name="user" id="iuser" value=""'+ens+' /></td>';
        tbl += '</tr><tr>';
        if(lv == 2) {
            tbl += '<td>Пароль</td>';
            tbl += '<td><input type="password" name="passwd" id="ipasswd" value=""'+ens+' /></td>';
            tbl += '</tr><tr>';
        }
        tbl += '<td>Статус пользователя</td>';
        tbl += '<td id="currstat"></td>';
        if(lv == 2) {
            tbl += '</tr><tr>';
            tbl += '<td colspan="2" style="text-align: center;"><input type="submit" id="usersub" value="Сохранить" /><input type="hidden" name="dstv" id="idstv" value="0" /></td>';
            tbl += '</tr></table>';
            tbl += '</form>';
        } else {
            tbl += '</tr></table>';
        }

        return tbl;

    },
    profileform: function (lv) {
        var tbl ="";
        var ens = ' disabled="disabled"';
        if(lv == 2){
            tbl += '<form method="post" id="proffrm" action="javascript:void(null);" onSubmit="save_usergrpinfo(this);">';
            tbl += '<table><tr>';
            ens = '';
        } else {
            tbl += '<table><tr>';
        }

        tbl += '<th colspan="2">Профиль</th>';
        tbl += '</tr><tr>';
        tbl += '<td>Телефон</td>';
        tbl += '<td><input type="text" name="phone" id="ifone" value=""'+ens+' /></td>';
        tbl += '</tr><tr>';
        tbl += '<td>Email</td>';
        tbl += '<td><input type="text" name="mails" id="imails" value=""'+ens+' /></td>';
        tbl += '</tr><tr>';
        tbl += '<td>Общая информация</td>';
        tbl += '<td><input type="text" name="inform" id="iinform" value=""'+ens+' /></td>';

        if(lv == 2) {
            tbl += '</tr><tr>';
            tbl += '<td colspan="2" style="text-align: center;"><input type="submit" id="infsub" value="Сохранить" /><input type="hidden" name="infdstv" id="iinfdstv" value="0" /><input type="hidden" name="idprof" id="iidprof" value="0" /></td>';
            tbl += '</tr></table>';
            tbl += '</form>';
        } else {
            tbl += '</tr></table>';
        }
            return tbl;
        },
    groupfrm: function(){
        var tbl ="";
        tbl += '<div class="divusfrm">';
        tbl += '<div style="position: relative;"><img src="/bundles/admin/img/close.png" style="position: absolute; top: 1px; right: 5px; width: 20px; height: 20px; cursor: pointer;" title="Закрыть" onclick="close_usgrpfrm();"></div>';
        tbl += '<form method="post" id="groupfrm" action="javascript:void(null);" onSubmit="save_usergrpinfo(this);">';
        tbl += '<table><tr>';
        tbl += '<th colspan="2">Группа пользователей</th>';
        tbl += '</tr><tr>';
        tbl += '<td>Группа</td>';
        tbl += '<td><input type="text" name="groups" id="igroups" value="" /></td>';
        tbl += '</tr><tr>';
        tbl += '<td colspan="2" style="text-align: center;"><input type="submit" id="grpsub" value="Сохранить" /><input type="hidden" name="gdstv" id="igdstv" value="0" /></td>';
        tbl += '</tr></table>';
        tbl += '</form>';
        tbl += '</div>';

        return tbl;
    }
};

var permform = {
    showfrm: function(lv,obj){
        var ltbl = "";
        ltbl += '<div class="divusfrm">';
        ltbl += '<div style="position: relative;"><img src="/bundles/admin/img/close.png" style="position: absolute; top: 1px; right: 5px; width: 20px; height: 20px; cursor: pointer;" title="Закрыть" onclick="close_usgrpfrm();"></div>';
        if(lv == 2) {
            ltbl += '<div>' + this.readwritefrm(obj) + '</div>';
        } else {
            ltbl += '<div>' + this.readfrm(obj) + '</div>';
        }
        ltbl += '<div>';

        return ltbl;
    },
    showgrpfrm: function(lv,obj){
        var ltbl = "";
        ltbl += '<div class="divusfrm">';
        ltbl += '<div style="position: relative;"><img src="/bundles/admin/img/close.png" style="position: absolute; top: 1px; right: 5px; width: 20px; height: 20px; cursor: pointer;" title="Закрыть" onclick="close_usgrpfrm();"></div>';
        if(lv == 2) {
            ltbl += '<div>' + this.readwritegrpfrm(obj) + '</div>';
        } else {
            ltbl += '<div>' + this.readgrpfrm(obj) + '</div>';
        }
        ltbl += '<div>';

        return ltbl;
    },
    readfrm: function(obj){
        var tbl = "";
        tbl += '<table><tr>';
        tbl += '<th colspan="2" style="cursor: default;" unselectable="on">Текущие права доступа ('+obj.name.name+')</th>';
        tbl += '</tr><tr>';
        tbl += '<td colspan="2" class="heads" style="text-align: center; color: #ffffff !important; cursor: default;" unselectable="on">Система</td>';
        tbl += '</tr><tr>';
        tbl += '<td style="cursor: default;" unselectable="on">Управление пользователями</td>';
        tbl += '<td>'+this.printsysread(obj.perms.sysperm.users)+'</td>';
        tbl += '</tr><tr>';
        tbl += '<td style="cursor: default;" unselectable="on">Управление модулями</td>';
        tbl += '<td>'+this.printsysread(obj.perms.sysperm.admmod)+'</td>';
        tbl += '</tr><tr>';
        tbl += '<td colspan="2" class="heads" style="text-align: center; color: #ffffff !important; cursor: default;" unselectable="on">Модули</td>';
        tbl += '</tr><tr>';
        tbl += '<td colspan="2">';
        tbl += '<div class="listmodperm">';
        if(obj.perms.userprm && obj.perms.userprm.length) {
            var mlen = obj.perms.userprm.length;
            tbl += '<div>';
            tbl += '<div class="headmod"  id="fixedtmod" unselectable="on">';
            tbl += '<div style="width: 380px;">&nbsp;</div>';
            tbl += '<div title="Просмотр">П.</div>';
            tbl += '<div title="Вставка">В.</div>';
            tbl += '<div title="Изменение">И.</div>';
            tbl += '<div title="Удаление">У.</div>';
            tbl += '<div title="Экстра">Э.</div>';
            tbl += '<div title="Спец. Флаг">С.</div>';
            tbl += '</div>';

            for(var m=0;m<mlen;m++){
                tbl += '<div>';
                tbl += '<div class="heads" style="text-align: center; cursor: default;" unselectable="on">'+obj.perms.userprm[m].name+'</div>';

                if(obj.perms.userprm[m].pages && obj.perms.userprm[m].pages.length) {
                    var pglen = obj.perms.userprm[m].pages.length;
                    for(var p=0;p<pglen;p++){
                        tbl += '<div class="shmods">';

                        tbl += '<div style="width: 380px; padding-left: 20px; text-align: left; border: 1px solid transparent; cursor: default;" unselectable="on">'+obj.perms.userprm[m].pages[p].name+'</div>';
                        if(obj.perms.userprm[m].pages[p].permits && obj.perms.userprm[m].pages[p].permits.length) {
                            tbl += '<div>'+this.printread(obj.perms.userprm[m].pages[p].permits[0].list)+'</div>';
                            tbl += '<div>'+this.printread(obj.perms.userprm[m].pages[p].permits[0].ins)+'</div>';
                            tbl += '<div>'+this.printread(obj.perms.userprm[m].pages[p].permits[0].upd)+'</div>';
                            tbl += '<div>'+this.printread(obj.perms.userprm[m].pages[p].permits[0].del)+'</div>';
                            tbl += '<div>'+this.printread(obj.perms.userprm[m].pages[p].permits[0].extra)+'</div>';
                            tbl += '<div>'+this.printread(obj.perms.userprm[m].pages[p].permits[0].accsext)+'</div>';
                        } else {
                            tbl += '<div>-</div>';
                            tbl += '<div>-</div>';
                            tbl += '<div>-</div>';
                            tbl += '<div>-</div>';
                            tbl += '<div>-</div>';
                            tbl += '<div>-</div>';
                        }

                        tbl += '</div>';
                    }
                }

                tbl += '</div>';
            }
            tbl += '</div>';
        }
        tbl += '</div>';
        tbl += '</td></tr></table>';
        return tbl;
    },
    readgrpfrm: function(obj){
        var tbl = "";
        tbl += '<table><tr>';
        tbl += '<th colspan="2" style="cursor: default;" unselectable="on">Текущие права доступа ('+obj.name.name+')</th>';
        tbl += '</tr><tr>';
        tbl += '<td colspan="2" class="heads" style="text-align: center; color: #ffffff !important; cursor: default;" unselectable="on">Модули</td>';
        tbl += '</tr><tr>';
        tbl += '<td colspan="2">';
        tbl += '<div class="listmodperm">';
        if(obj.perms && obj.perms.length) {
            var mlen = obj.perms.length;
            tbl += '<div>';
            tbl += '<div class="headmod"  id="fixedtmod" unselectable="on">';
            tbl += '<div style="width: 380px;">&nbsp;</div>';
            tbl += '<div title="Просмотр">П.</div>';
            tbl += '<div title="Вставка">В.</div>';
            tbl += '<div title="Изменение">И.</div>';
            tbl += '<div title="Удаление">У.</div>';
            tbl += '<div title="Экстра">Э.</div>';
            tbl += '<div title="Спец. Флаг">С.</div>';
            tbl += '</div>';

            for(var m=0;m<mlen;m++){
                tbl += '<div>';
                tbl += '<div class="heads" style="text-align: center; cursor: default;" unselectable="on">'+obj.perms[m].name+'</div>';

                if(obj.perms[m].pages && obj.perms[m].pages.length) {
                    var pglen = obj.perms[m].pages.length;
                    for(var p=0;p<pglen;p++){
                        tbl += '<div class="shmods">';

                        tbl += '<div style="width: 380px; padding-left: 20px; text-align: left; border: 1px solid transparent; cursor: default;" unselectable="on">'+obj.perms[m].pages[p].name+'</div>';
                        if(obj.perms[m].pages[p].permits && obj.perms[m].pages[p].permits.length) {
                            tbl += '<div>'+this.printread(obj.perms[m].pages[p].permits[0].list)+'</div>';
                            tbl += '<div>'+this.printread(obj.perms[m].pages[p].permits[0].ins)+'</div>';
                            tbl += '<div>'+this.printread(obj.perms[m].pages[p].permits[0].upd)+'</div>';
                            tbl += '<div>'+this.printread(obj.perms[m].pages[p].permits[0].del)+'</div>';
                            tbl += '<div>'+this.printread(obj.perms[m].pages[p].permits[0].extra)+'</div>';
                            tbl += '<div>'+this.printread(obj.perms[m].pages[p].permits[0].accsext)+'</div>';
                        } else {
                            tbl += '<div>-</div>';
                            tbl += '<div>-</div>';
                            tbl += '<div>-</div>';
                            tbl += '<div>-</div>';
                            tbl += '<div>-</div>';
                            tbl += '<div>-</div>';
                        }

                        tbl += '</div>';
                    }
                }

                tbl += '</div>';
            }
            tbl += '</div>';
        }
        tbl += '</div>';
        tbl += '</td></tr></table>';
        return tbl;
    },
    readwritefrm: function(obj){
        var tbl = "";
        tbl += '<table><tr>';
        tbl += '<th colspan="2" style="cursor: default;" unselectable="on">Текущие права доступа ('+obj.name.name+')</th>';
        tbl += '</tr><tr>';
        tbl += '<td colspan="2">';

        tbl += '<div><form method="post" id="syspermfrm" action="javascript:void(null);" onSubmit="save_permuser(\''+obj.page+'\', \''+obj.subpg+'\',0,'+obj.name.id+',this);">';
        tbl += '<div class="heads" style="text-align: center; cursor: default; position: relative;" unselectable="on">Система<input type="submit" class="headsubm" style="position: absolute; top: 1px; right: 15px;" value="Сохранить" /></div>';
        tbl += '<table><tr>';
        tbl += '<td style="cursor: default;" unselectable="on">Управление пользователями</td>';
        tbl += '<td>'+this.printsysreadwrite(obj.perms.sysperm.users,'user')+'</td>';
        tbl += '</tr><tr>';
        tbl += '<td style="cursor: default;" unselectable="on">Управление модулями</td>';
        tbl += '<td>'+this.printsysreadwrite(obj.perms.sysperm.admmod,'mods')+'</td>';
        tbl += '</tr></table>';

        tbl += '</form>';
        tbl += '</td></tr><tr>';
        tbl += '<td colspan="2" class="heads" style="text-align: center; color: #ffffff !important; cursor: default;" unselectable="on">Модули</td>';
        tbl += '</tr><tr>';
        tbl += '<td colspan="2">';
        tbl += '<div class="listmodperm">';
        if(obj.perms.userprm && obj.perms.userprm.length) {
            var mlen = obj.perms.userprm.length;
            var prm = "";
            var mid = 0;
            var pg_id = 0;
            tbl += '<div>';
            tbl += '<div class="headmod"  id="fixedtmod" unselectable="on">';
            tbl += '<div style="width: 380px;">&nbsp;</div>';
            tbl += '<div title="Просмотр">П.</div>';
            tbl += '<div title="Вставка">В.</div>';
            tbl += '<div title="Изменение">И.</div>';
            tbl += '<div title="Удаление">У.</div>';
            tbl += '<div title="Экстра">Э.</div>';
            tbl += '<div title="Спец. Флаг">С.</div>';
            tbl += '</div>';

            for(var m=0;m<mlen;m++){
                tbl += '<div><form method="post" id="mods_'+obj.perms.userprm[m].id+'" action="javascript:void(null);" onSubmit="save_permuser(\''+obj.page+'\', \''+obj.subpg+'\','+obj.perms.userprm[m].id+','+obj.name.id+',this);">';
                tbl += '<div class="heads" style="text-align: center; cursor: default; position: relative;" unselectable="on">'+obj.perms.userprm[m].name+'<input type="submit" class="headsubm" style="position: absolute; top: 1px; right: 15px;" id="imod'+obj.perms.userprm[m].id+'" value="Сохранить" /></div>';

                if(obj.perms.userprm[m].pages && obj.perms.userprm[m].pages.length) {
                    var pglen = obj.perms.userprm[m].pages.length;
                    for(var p=0;p<pglen;p++){
                        tbl += '<div class="shmods">';

                        tbl += '<div style="width: 380px; padding-left: 20px; text-align: left; border: 1px solid transparent; cursor: default;" unselectable="on">'+obj.perms.userprm[m].pages[p].name+'</div>';
                        if(obj.perms.userprm[m].pages[p].permits && obj.perms.userprm[m].pages[p].permits.length) {
                            prm = obj.perms.userprm[m].pages[p].permits[0];
                            mid = obj.perms.userprm[m].id;
                            pg_id = obj.perms.userprm[m].pages[p].id;
                            tbl += '<div>'+this.printcheck(prm.list,mid,pg_id,'list')+'</div>';
                            tbl += '<div>'+this.printcheck(prm.ins,mid,pg_id,'ins')+'</div>';
                            tbl += '<div>'+this.printcheck(prm.upd,mid,pg_id,'upd')+'</div>';
                            tbl += '<div>'+this.printcheck(prm.del,mid,pg_id,'del')+'</div>';
                            tbl += '<div>'+this.printcheck(prm.extra,mid,pg_id,'extra')+'</div>';
                            tbl += '<div>'+this.printcheck(prm.accsext,mid,pg_id,'accsext')+'</div>';
                        } else {
                            tbl += '<div>-</div>';
                            tbl += '<div>-</div>';
                            tbl += '<div>-</div>';
                            tbl += '<div>-</div>';
                            tbl += '<div>-</div>';
                            tbl += '<div>-</div>';
                        }

                        tbl += '</div>';
                    }
                }
                tbl += '<input type="hidden" name="id" id="iid" value="'+obj.perms.userprm[m].id+'" /></form></div>';
            }
            tbl += '</div>';
        }
        tbl += '</div>';
        tbl += '</td>';
        tbl += '</tr></table>';

        return tbl;
    },
    readwritegrpfrm: function(obj){
        var tbl = "";
        tbl += '<table><tr>';
        tbl += '<th colspan="2" style="cursor: default;" unselectable="on">Текущие права доступа ('+obj.name.name+')</th>';
        tbl += '</tr><tr>';
        tbl += '<td colspan="2" class="heads" style="text-align: center; color: #ffffff !important; cursor: default;" unselectable="on">Модули</td>';
        tbl += '</tr><tr>';
        tbl += '<td colspan="2">';
        tbl += '<div class="listmodperm">';
        if(obj.perms && obj.perms.length) {
            var mlen = obj.perms.length;
            var prm = "";
            var mid = 0;
            var pg_id = 0;
            tbl += '<div>';
            tbl += '<div class="headmod"  id="fixedtmod" unselectable="on">';
            tbl += '<div style="width: 380px;">&nbsp;</div>';
            tbl += '<div title="Просмотр">П.</div>';
            tbl += '<div title="Вставка">В.</div>';
            tbl += '<div title="Изменение">И.</div>';
            tbl += '<div title="Удаление">У.</div>';
            tbl += '<div title="Экстра">Э.</div>';
            tbl += '<div title="Спец. Флаг">С.</div>';
            tbl += '</div>';

            for(var m=0;m<mlen;m++){
                tbl += '<div><form method="post" id="mods_'+obj.perms[m].id+'" action="javascript:void(null);" onSubmit="save_permuser(\''+obj.page+'\', \''+obj.subpg+'\','+obj.perms[m].id+','+obj.name.id+',this);">';
                tbl += '<div class="heads" style="text-align: center; cursor: default; position: relative;" unselectable="on">'+obj.perms[m].name+'<input type="submit" class="headsubm" style="position: absolute; top: 1px; right: 15px;" id="imod'+obj.perms[m].id+'" value="Сохранить" /></div>';

                if(obj.perms[m].pages && obj.perms[m].pages.length) {
                    var pglen = obj.perms[m].pages.length;
                    for(var p=0;p<pglen;p++){
                        tbl += '<div class="shmods">';

                        tbl += '<div style="width: 380px; padding-left: 20px; text-align: left; border: 1px solid transparent; cursor: default;" unselectable="on">'+obj.perms[m].pages[p].name+'</div>';
                        if(obj.perms[m].pages[p].permits && obj.perms[m].pages[p].permits.length) {
                            prm = obj.perms[m].pages[p].permits[0];
                            mid = obj.perms[m].id;
                            pg_id = obj.perms[m].pages[p].id;
                            tbl += '<div>'+this.printcheck(prm.list,mid,pg_id,'list')+'</div>';
                            tbl += '<div>'+this.printcheck(prm.ins,mid,pg_id,'ins')+'</div>';
                            tbl += '<div>'+this.printcheck(prm.upd,mid,pg_id,'upd')+'</div>';
                            tbl += '<div>'+this.printcheck(prm.del,mid,pg_id,'del')+'</div>';
                            tbl += '<div>'+this.printcheck(prm.extra,mid,pg_id,'extra')+'</div>';
                            tbl += '<div>'+this.printcheck(prm.accsext,mid,pg_id,'accsext')+'</div>';
                        } else {
                            tbl += '<div>-</div>';
                            tbl += '<div>-</div>';
                            tbl += '<div>-</div>';
                            tbl += '<div>-</div>';
                            tbl += '<div>-</div>';
                            tbl += '<div>-</div>';
                        }
                        tbl += '</div>';
                    }
                }
                tbl += '<input type="hidden" name="id" id="iid" value="'+obj.perms[m].id+'" /></form></div>';
            }
            tbl += '</div>';
        }
        tbl += '</div>';
        tbl += '</td></tr></table>';

        return tbl;
    },
    printcheck: function(st,mod,id,pos){
        var check = "";
        var ch = ' value="0"';
        if(st == 1){
            ch = ' value="1" checked="checked"';
        }
        check = '<input type="checkbox" id="i_'+id+'_'+pos+'" name="'+id+'_'+pos+'"'+ch+' onchange="check_perminput(this,\''+pos+'\');" />';

        return check;
    },
    printread: function(val){
        var ret = "-";
        if(val == 1){
            ret = "v";
        }
        return ret;
    },
    printsysread: function(val){
        var retstr = ['Закрыто','Только чтение','Полный доступ'];
        return retstr[val];
    },
    printsysreadwrite: function(val,id){
        var ret = '<select id="isys'+id+'" name="sys'+id+'">';
        for(var s=0;s<3;s++){
            if(s == val){
                ret += '<option selected value="'+s+'">'+this.printsysread(s)+'</option>';
            } else {
                ret += '<option value="'+s+'">'+this.printsysread(s)+'</option>';
            }
        }
        ret += '</select>';

        return ret;
    }
};

var modconfform = {
    printfrm: function(lv){
        var ltbl = "";
        ltbl += '<div class="divusfrm" style="width: 400px; margin-top: 10px;">';
        ltbl += '<div style="position: relative;"><img src="/bundles/admin/img/close.png" style="position: absolute; top: 1px; right: 5px; width: 20px; height: 20px; cursor: pointer;" title="Закрыть" onclick="clear_block(\'mcfgblk\');"></div>';
        if(lv == 2) {
            ltbl += '<div style="display: block;">' + this.createform() + '</div>';
        }
        ltbl += '<div>';

        return ltbl;
    },
    createform: function(){
        var tbl ="";
        tbl += '<form method="post" id="modconfident" action="javascript:void(null);" onSubmit="save_currconfmod(this);">';
        tbl += '<div class="ttlmodcfg">';
        tbl += '<div style="width: 100px;">Ключ</div>';
        tbl += '<div style="width: 260px;">Значение</div>';
        tbl += '</div>';
        tbl += '<div class="inpmodcfg">';
        tbl += '<div><input type="text" style="width: 100px;" name="keys" id="ikeys" value="" /></div>';
        tbl += '<div><input type="text" style="width: 260px;" name="names" id="inames" value="" /></div>';
        tbl += '</div>';
        tbl += '<div><input type="submit" class="headsubm" value="Сохранить" /><input type="hidden" name="mpgid" id="impgid" value="0" /></div>';
        tbl += '</form>';

        return tbl;
    }
};

var templmodules = {
    usemodules: function(){
        var tbl ="";
        tbl += '<div style="width: 340px; margin: 0 auto;">';
        tbl += '<div class="toptitle">Установленные модули</div>';
        tbl += '<div class="fixheuhtauto" id="upmodule"></div>';
        tbl += '</div>';

        return tbl;
    },
    unusemodule: function(){
        var tbl ="";
        tbl += '<div style="width: 340px; margin: 0 auto;">';
        tbl += '<div class="toptitle">Доступные модули</div>';
        tbl += '<div class="fixheuhtauto" id="downmodule"></div>';
        tbl += '</div>';

        return tbl;
    },
    shedules: function(idone,idtwo){
        rfrarr[0] = setTimeout(function(){show_modules_struct(idone,idtwo);}, 100);
    },
    usedlist: function(objs){
        var tbl = "";
        var chh = '';
        if(objs) {
            tbl = '';
            tbl += '<div>';

            tbl += '<div class="tline  headlines">';
            tbl += '<div style="width: 30px;" unselectable="on">&nbsp;</div>';
            tbl += '<div style="width: 250px;" unselectable="on">Название модуля</div>';
            tbl += '<div style="width: 30px;" unselectable="on">&nbsp;</div>';
            tbl += '</div>';
            var inobj = objs.objs;
            if(inobj && inobj.length){
                var tblen = inobj.length;
                for(var un=0;un<tblen;un++){
                    if(objs.lv == 2) {
                        chh = '';
                        if(inobj[un].enables == 1){
                            chh = ' checked="checked"';
                        }
                        tbl += '<div class="tline celline">';
                        tbl += '<div style="width: 30px;" unselectable="on"><input type="checkbox" onchange="disenmod(this,'+inobj[un].id+','+objs.indx+', \''+objs.page+'\', \''+objs.subpg+'\', \''+objs.module+'\', \''+objs.cssid+'\', '+objs.lv+');"'+chh+' /></div>';
                        tbl += '<div style="width: 250px; cursor: pointer;" unselectable="on">'+inobj[un].displays+'</div>';
                        tbl += '<div style="width: 30px;" unselectable="on"><img src="/bundles/admin/img/unused.png" title="Удалить модуль" alt="удалить" onclick="deinstallmod('+inobj[un].id+','+objs.indx+', \''+objs.page+'\', \''+objs.subpg+'\', \''+objs.module+'\', \''+objs.cssid+'\', '+objs.lv+');" /></div>';
                        tbl += '</div>';
                    } else {
                        tbl += '<div class="tline celline">';
                        tbl += '<div style="width: 30px;" unselectable="on">'+this.changereads(inobj[un].enables)+'</div>';
                        tbl += '<div style="width: 250px;" unselectable="on">'+inobj[un].displays+'</div>';
                        tbl += '<div style="width: 30px;" unselectable="on">&nbsp;</div>';
                        tbl += '</div>';
                    }
                }
            }
            tbl += '</div>';

            $('#'+objs.cssid).html(tbl);
            tbl = '';
            rfrarr[objs.indx] = setTimeout(function () {
                select_opertemod(objs.indx, objs.cause, objs.cssid);
            }, 10000);
        }
    },
    unusedlist: function(objs){
        if(objs) {
            var tbl = "";
            tbl += '<div>';

            tbl += '<div class="tline headlines">';
            tbl += '<div style="width: 30px;" unselectable="on">&nbsp;</div>';
            tbl += '<div style="width: 250px;" unselectable="on">Название модуля</div>';
            tbl += '</div>';
            var inobj = objs.objs;
            if(inobj && inobj.length){
                var tblen = inobj.length;
                for(var un=0;un<tblen;un++){
                    if(objs.lv == 2) {
                        tbl += '<div class="tline celline">';
                        tbl += '<div style="width: 30px;" unselectable="on"><img src="/bundles/admin/img/used.png" title="Установить модуль" alt="установить" onclick="installmod(\''+inobj[un].bundle+'\','+objs.indx+', \''+objs.page+'\', \''+objs.subpg+'\', \''+objs.module+'\', \''+objs.cssid+'\', '+objs.lv+')" /></div>';
                        tbl += '<div style="width: 250px;" unselectable="on">'+inobj[un].displays+'</div>';
                        tbl += '</div>';
                    } else {
                        tbl += '<div class="tline celline">';
                        tbl += '<div style="width: 30px;" unselectable="on">&nbsp;</div>';
                        tbl += '<div style="width: 250px;" unselectable="on">'+inobj[un].displays+'</div>';
                        tbl += '</div>';
                    }

                }
            }
            tbl += '</div>';

            $('#'+objs.cssid).html(tbl);
            tbl = '';
            rfrarr[objs.indx] = setTimeout(function () {
                select_opertemod(objs.indx, objs.cause, objs.cssid);
            }, 10000);
        }
    },
    changereads: function(keys){
        var ch = "";
        if(keys == 1){
            ch = '<span style="width: 18px; height: 18px; border: 1px solid #b6bfc0; padding-left: 5px; padding-right: 5px; cursor: default;" unselectable="on">v</span>';
        } else {
            ch = '<span style="width: 18px; height: 18px; border: 1px solid #b6bfc0; padding-left: 6px; padding-right: 6px; cursor: default;" unselectable="on">&nbsp;</span>';
        }

        return ch;
    }
};
/* -----------  FORMS END ------------- */
var show_modules_struct = function(idone,idtwo)
{
    cleartimearr();
    rfrarr[0] = setTimeout(function(){select_opertemod(0,'usedmod',idone);}, 100);
    rfrarr[1] = setTimeout(function(){select_opertemod(1,'unusedmod',idtwo);}, 100);
};

var print_usedmods = function(obj)
{
    if(obj.cause == "usedmod"){
        templmodules.usedlist(obj);
    }
    if(obj.cause == "enablemods"){
        obj.cause = "usedmod";
        templmodules.usedlist(obj);
    }
    if(obj.cause == "unusedmod"){
        templmodules.unusedlist(obj);
    }
    if(obj.cause == "deinstallmods"){
        obj.cause = "usedmod";
        templmodules.usedlist(obj);
        reloadmodselect(obj.lv);
    }
    if(obj.cause == "installmods"){
        obj.cause = "unusedmod";
        templmodules.unusedlist(obj);
        reloadmodselect(obj.lv);
    }
};

var returnreloadmodselect = function(obj)
{
    if(obj && obj.length){
        var currsel = $('#slmod').val();
        var usesel = false;
        $('#slmod').empty();
        for(var opt in obj){
            $('#slmod').append($("<option></option>").attr("value", obj[opt].id).text(obj[opt].name));
            if(obj[opt].id == currsel){
                usesel = true;
            }
        }
        if(usesel){
            $('#slmod').val(currsel);
        } else {
            $('#slmod').val(0);
            //change_fgrp(0,'admmod','mods');
        }
    }
};

var modgen_startpg = function(obj)
{
    if(obj){
        var tmpl = "";
        if(obj.objs && obj.objs.length) {
            var len = obj.objs.length;
            var menus = obj.objs;
            var starts = "";
            for (var m = 0; m < len; m++) {
                if (m == 0) {
                    starts = menus[m].mkey;
                    tmpl = '<li><div id="men_'+menus[m].mkey+'" class="pgsel" unselectable=on onclick="change_modulepage(\'' + menus[m].mkey + '\'); $(\'#fmpgid li div.pgsel\').removeClass(\'pgsel\'); $(this).addClass(\'pgsel\');">' + menus[m].mval + '</div></li>';
                } else {
                    tmpl += '<li><div id="men_'+menus[m].mkey+'" unselectable=on onclick="change_modulepage(\'' + menus[m].mkey + '\'); $(\'#fmpgid li div.pgsel\').removeClass(\'pgsel\'); $(this).addClass(\'pgsel\');">' + menus[m].mval + '</div></li>';
                }
            }
        }

        $('#fmpgid').html(tmpl);
        change_modulepage(starts);
    }
};

var show_fpage = function(objs)
{
    var grar = [];
    var tmpl = "";
    var edtbtn = "";
    var $pdd;
    if(objs.page.trim() != ""){
        if(objs.groups){
            grar = objs.groups;
        }
        if(objs.page.trim() == "users") {
            if(objs.subpg.trim() == "" || objs.subpg.trim() == "usedt") {
                edtbtn = "";
                if(objs.flv == 2) {
                    edtbtn = '<div class="fpgsys" style="position: relative;"><select id="sgrp" onchange="selindex = 0; change_selfgrp(\'#sgrp\',\'' + objs.page + '\',\'usedt\');"></select><img src="/bundles/admin/img/add.png" style="position: absolute; top: 3px; right: 15px; width: 34px; height: 34px; cursor: pointer;" title="Добавить пользователя" onclick="new_userform('+objs.flv+');" /></div>';
                } else {
                    edtbtn = '<div class="fpgsys"><select id="sgrp" onchange="change_selfgrp(\'#sgrp\',\'' + objs.page + '\',\'usedt\');"></select></div>';
                }

                tmpl = '<div class="fpglists">' +
                    '<table>' +
                    '<tr>' +
                    '<td style="width: 400px;">'+edtbtn+'<div id="uslist"></div></td>' +
                    '<td><div id="usedfrm"></div></td>' +
                    '</tr></table></div>';
                $('#functpg').html(tmpl);

                tmpl = '<input type="text" id="faindus" value="" onkeydown="if(event.keyCode==13){show_search_user(\'faindus\');}" /><button onclick="show_search_user(\'faindus\');">Искать</button>';
                $('#findfrm').html(tmpl);

                $pdd = $('#sgrp');
                if (grar && grar.length) {
                    for (var g = 0; g < grar.length; g++) {
                        $pdd.append($("<option></option>").attr("value", grar[g].id).text(grar[g].name));
                    }
                }
                change_fgrp($('#sgrp').val(),objs.page,'usedt');
            } else {
                edtbtn = "";
                if(objs.flv == 2) {
                    edtbtn = '<div class="fpgsys" style="position: relative; height: 40px;"><img src="/bundles/admin/img/add.png" style="position: absolute; top: 3px; right: 15px; width: 34px; height: 34px; cursor: pointer;" title="Добавить пользователя" onclick="new_groupform();" /></div>';
                }
                tmpl = '<div class="fpglists">' +
                    '<table>' +
                    '<tr>' +
                    '<td style="width: 400px;">'+edtbtn+'<div id="uslist"></div></td>' +
                    '<td><div id="usedfrm"></div></td>' +
                    '</tr></table></div>';

                $('#functpg').html(tmpl);
                tmpl = '';
                $('#findfrm').html(tmpl);
                change_fgrp(1,objs.page,'grpdt');
            }
        }
        if(objs.page.trim() == "admmod") {
            //console.log(objs);
            if(objs.flv == 2) {
                edtbtn = '<div class="fpgsys" style="position: relative;"><select id="slmod" onchange="selindex = 0; change_selfgrp(\'#slmod\',\'' + objs.page + '\',\'mods\');"></select><img src="/bundles/admin/img/add.png" style="position: absolute; top: 3px; right: 15px; width: 34px; height: 34px; cursor: pointer;" title="Добавить Параметры" onclick="new_modcfgfrm('+objs.flv+');" /></div>';
            } else {
                edtbtn = '<div class="fpgsys"><select id="slmod" onchange="change_selfgrp(\'#slmod\',\'' + objs.page + '\',\'mods\');"></select></div>';
            }

            tmpl = '<div class="fpglists">' +
                '<table>' +
                '<tr>' +
                '<td><div style="width: 400px; margin: 0 auto;">'+edtbtn+'<div id="mcfgblk"></div><div id="uslist"></div><div></div></td>' +
                '<td><div id="usedmod"></div></td>' +
                '<td><div id="unusedmod"></div></td>' +
                '</tr></table></div>';

            $('#functpg').html(tmpl);
            tmpl = '';
            $('#findfrm').html(tmpl);

            $('#usedmod').html(templmodules.usemodules());
            $('#unusedmod').html(templmodules.unusemodule());
            templmodules.shedules('upmodule','downmodule');
            //templmodules
            $pdd = $('#slmod');
            if (grar && grar.length) {
                for (var g = 0; g < grar.length; g++) {
                    $pdd.append($("<option></option>").attr("value", grar[g].id).text(grar[g].name));
                }
                $pdd.val(0);
            }

            change_fgrp(0,objs.page,'mods');
        }
        if(objs.page.trim() == "proff") {

        }
        if(objs.page.trim() == "index") {
            tmpl = '<div id="modicons" class="imgmods"></div>';
            if($('#functpg')){
                $('#functpg').html(tmpl);
                change_fgrp(0,objs.page,'main');
            }
        }
    }
};

var show_dyncont = function(objs)
{
    "use strict";
    var grar = [];
    var tmpl = "";
    var g = 0;
    if(objs.page.trim() != "") {
        if(objs.groups){
            grar = objs.groups;
        }
        if(objs.page.trim() == "index") {
            if(objs.objs && objs.objs.length){
                var dv = getElementPosition('functpg'), curcnt = 0, wd = 0, tr = 0;
                wd = dv.width;
                tr = Math.floor(wd/120);
                var len = objs.objs.length;
                tmpl = '<table>';
                //console.log(objs.objs);
                for(var m=0;m<len;m++){
                    if(curcnt==0){
                        tmpl += '<tr>';
                    }

                    tmpl += '<td style="width: 120px;">';
                    tmpl += '<div class="iconm">';
                    tmpl += '<div><img src="'+objs.objs[m].imgsrc+'" title="'+objs.objs[m].moddisp+'" style="width: 64px; height: 64px;" alt="module" onclick="changes_mod(\''+objs.objs[m].link+'\');" /></div>';
                    tmpl += '<div onclick="changes_mod(\''+objs.objs[m].link+'\');">'+objs.objs[m].moddisp+'</div>';
                    tmpl += '</div>';
                    tmpl += '</td>';

                    if(curcnt==(tr-1)){
                        tmpl += '</tr>';
                        curcnt = 0;
                    } else {
                        curcnt++;
                    }
                }

                if(curcnt<(tr-1)){
                    for(var dop=curcnt;dop<tr;dop++){
                        tmpl += '<td style="width: 110px;">&nbsp;</td>';
                        if(dop==(tr-1)){
                            tmpl += '</tr>';
                        }}}
                tmpl += '</table>';

                $('#modicons').html(tmpl);
                refresh_toppgcont('',objs.page,objs.subpg);
            }
        }
        if (objs.page.trim() == "users") {
            if (objs.subpg.trim() == "usedt") {
                tmpl = '<table>';
                tmpl += '<tr>';
                tmpl += '<th>Пользователь</th>';
                tmpl += '<th>Статус</th>';
                tmpl += '<th style="width: 25px;"></th>';
                tmpl += '<th style="width: 25px;"></th>';
                tmpl += '</tr>';

                if (grar && grar.length) {
                    for (g = 0; g < grar.length; g++) {
                        if(selindex > 0 && selindex == grar[g].id){
                            tmpl += '<tr class="selus">';
                        } else {
                            tmpl += '<tr>';
                        }
                        tmpl += '<td style="cursor: pointer;" onclick="select_us(this,'+grar[g].id+'); show_faccount(\''+objs.page+'\',\''+objs.subpg+'\','+grar[g].id+',\'listacc\');">'+grar[g].name+'</td>';
                        tmpl += '<td style="cursor: pointer;" onclick="select_us(this,'+grar[g].id+'); show_faccount(\''+objs.page+'\',\''+objs.subpg+'\','+grar[g].id+',\'listacc\');">'+usstatus[parseInt(grar[g].actives)]+'</td>';
                        if(grar[g].lv == 2) {
                            tmpl += '<td><img src="/bundles/admin/img/edite.png" style="cursor: pointer; width: 20px; height: 20px;" title="Права доступа" alt="" onclick="select_pus(this,'+grar[g].id+'); show_faccount(\''+objs.page+'\',\''+objs.subpg+'\','+grar[g].id+',\'listpermobj\');" /></td>';
                            tmpl += '<td><img src="/bundles/admin/img/del.png" style="cursor: pointer; width: 20px; height: 20px;" title="Удалить" alt="" onclick="show_faccount(\''+objs.page+'\',\''+objs.subpg+'\','+grar[g].id+',\'delacc\');" /></td>';
                        } else {
                            tmpl += '<td><img src="/bundles/admin/img/edite.png" style="cursor: pointer; width: 20px; height: 20px;" title="Права доступа" alt="" onclick="select_pus(this,'+grar[g].id+'); show_faccount(\''+objs.page+'\',\''+objs.subpg+'\','+grar[g].id+',\'listpermobj\');" /></td>';
                            tmpl += '<td></td>';
                        }
                        tmpl += '</tr>';
                    }
                }
                tmpl += '</table>';

                $('#uslist').html(tmpl);
                refresh_toppgcont('#sgrp',objs.page,objs.subpg);

            } else {
                tmpl = '<table>';
                tmpl += '<tr>';
                tmpl += '<th>Группа</th>';
                tmpl += '<th style="width: 25px;"></th>';
                tmpl += '<th style="width: 25px;"></th>';
                tmpl += '</tr>';
                if (grar && grar.length) {
                    for (g = 0; g < grar.length; g++) {
                        if(selindex > 0 && selindex == grar[g].id){
                            tmpl += '<tr class="selus">';
                        } else {
                            tmpl += '<tr>';
                        }
                        if(grar[g].lv == 2) {
                            tmpl += '<td style="cursor: pointer;" onclick="select_us(this,'+grar[g].id+'); show_faccount(\''+objs.page+'\',\''+objs.subpg+'\','+grar[g].id+',\'listgrp\');">'+grar[g].name+'</td>';
                            tmpl += '<td><img src="/bundles/admin/img/edite.png" style="cursor: pointer; width: 20px; height: 20px;" title="Права доступа" alt="" onclick="select_pus(this,'+grar[g].id+'); show_faccount(\''+objs.page+'\',\''+objs.subpg+'\','+grar[g].id+',\'listpermgrp\');" /></td>';
                            tmpl += '<td><img src="/bundles/admin/img/del.png" style="cursor: pointer; width: 20px; height: 20px;" title="Удалить" alt="" onclick="show_faccount(\''+objs.page+'\',\''+objs.subpg+'\','+grar[g].id+',\'delgrp\');" /></td>';
                        } else {
                            tmpl += '<td style="cursor: default;">'+grar[g].name+'</td>';
                            tmpl += '<td><img src="/bundles/admin/img/edite.png" style="cursor: pointer; width: 20px; height: 20px;" title="Права доступа" alt="" onclick="select_pus(this,'+grar[g].id+'); show_faccount(\''+objs.page+'\',\''+objs.subpg+'\','+grar[g].id+',\'listpermgrp\');" /></td>';
                            tmpl += '<td></td>';
                        }
                        tmpl += '</tr>';
                    }
                }
                tmpl += '</table>';

                $('#uslist').html(tmpl);
                refresh_toppgcont('',objs.page,objs.subpg);
            }
        }
        if (objs.page.trim() == "admmod") {
            if (objs.subpg.trim() == "" || objs.subpg.trim() == "mods") {
                tmpl = '<table>';
                tmpl += '<tr>';
                tmpl += '<th>Ключ</th>';
                tmpl += '<th style="width: 35px;"></th>';
                tmpl += '<th>Значение</th>';
                tmpl += '<th style="width: 25px;"></th>';
                tmpl += '</tr>';

                if (grar && grar.length) {
                    for (g = 0; g < grar.length; g++) {
                        if(selindex > 0 && selindex == grar[g].id){
                            tmpl += '<tr class="selus">';
                        } else {
                            tmpl += '<tr>';
                        }
                        if(grar[g].lv == 2) {
                            tmpl += '<td style="cursor: pointer;" onclick="select_us(this,'+grar[g].id+'); show_faccount(\'' + objs.page + '\',\'' + objs.subpg + '\',' + grar[g].id + ',\'listconfmod\');">' + grar[g].keys + '</td>';
                            tmpl += '<td style="cursor: pointer;" onclick="select_us(this,'+grar[g].id+'); show_faccount(\'' + objs.page + '\',\'' + objs.subpg + '\',' + grar[g].id + ',\'listconfmod\');">=</td>';
                            tmpl += '<td style="cursor: pointer;" onclick="select_us(this,'+grar[g].id+'); show_faccount(\'' + objs.page + '\',\'' + objs.subpg + '\',' + grar[g].id + ',\'listconfmod\');">' + grar[g].values + '</td>';
                            tmpl += '<td><img src="/bundles/admin/img/del.png" style="cursor: pointer; width: 20px; height: 20px;" title="Удалить" alt="" onclick="show_faccount(\'' + objs.page + '\',\'' + objs.subpg + '\',' + grar[g].id + ',\'delconfval\');" /></td>';
                        } else {
                            tmpl += '<td style="cursor: default;">' + grar[g].keys + '</td>';
                            tmpl += '<td style="cursor: default;">=</td>';
                            tmpl += '<td style="cursor: default;">' + grar[g].values + '</td>';
                            tmpl += '<td></td>';
                        }
                        tmpl += '</tr>';
                    }
                }
                tmpl += '</table>';

                $('#uslist').html(tmpl);
                refresh_toppgcont('#slmod',objs.page,objs.subpg);

            }
        }
    }
};

var select_us = function(objs, selid)
{
    $('#uslist tr.selus').removeClass('selus'); $(objs.parentNode).addClass('selus');
    selindex = selid;
};

var select_pus = function(objs, selid)
{
    $('#uslist tr.selus').removeClass('selus'); $(objs.parentNode.parentNode).addClass('selus');
    selindex = selid;
};

var show_findsuser = function(robj)
{
    if(robj.user.info.group.id) {
        $('#sgrp').val(robj.user.info.group.id);
        selindex = robj.uid;
        change_selfgrp('#sgrp',robj.page,'usedt');
        show_userform(robj);
    }
};

var show_userform = function(objs)
{
    if(objs) {
        var frm = "";
        frm = userpage.frmframe(objs.flv,0);
        $('#usedfrm').html(frm);
        var $grp = $('#igroup');
        $grp.empty();
        var sgrpn = getObj('sgrp').options;
        for(var opt=0;opt<sgrpn.length;opt++){
            $grp.append($("<option></option>").attr("value", sgrpn[opt].value).text(sgrpn[opt].text));
        }

        if(objs.flv == 2){
            if(objs.user.info) {
                $('#idescr').val(objs.user.info.descr);
                $('#igroup').val(objs.user.info.group.id);
                $('#iuser').val(objs.user.info.login);
                $('#iuser').prop("disabled", "disabled");
                $('#idstv').val(objs.user.info.id);
                if(objs.user.info.activate == 0){
                    $('#currstat').html('<input type="checkbox" id="iactv" name="actv" value="0" onchange="change_check_single(this);" checked />');
                } else {
                    $('#currstat').html('<input type="checkbox" id="iactv" name="actv" value="1" onchange="change_check_single(this);" />');
                }
            }
            if(objs.user.proff) {
                $('#ifone').val(objs.user.proff.phone);
                $('#imails').val(objs.user.proff.email);
                $('#iinform').val(objs.user.proff.info);
                $('#iinfdstv').val(objs.user.proff.userid);
                $('#iidprof').val(objs.user.proff.id);
            }
        } else {
            if(objs.user.info) {
                $('#idescr').val(objs.user.info.descr);
                $('#igroup').val(objs.user.info.group.id);
                $('#iuser').val(objs.user.info.login);
                $('#currstat').html(usstatus[objs.user.info.activate]);
            }
            if(objs.user.proff) {
                $('#ifone').val(objs.user.proff.phone);
                $('#imails').val(objs.user.proff.email);
                $('#iinform').val(objs.user.proff.info);
            }
        }
    }
};

var show_groupform = function(objs)
{
    if(objs) {
        if(objs.flv == 2){
            var frm = "";
            frm = userpage.groupfrm();
            $('#usedfrm').html(frm);
            $('#igroups').val(objs.group.name);
            $('#igdstv').val(objs.group.id);
        }
    }
};

var show_modcfgpgform = function(objs)
{
    if(objs) {
        if(objs.flv == 2){
            var frm = "";
            frm = modconfform.printfrm(objs.flv);
            $('#mcfgblk').html(frm);
            $('#ikeys').val(objs.modpgcfg.keys);
            $('#ikeys').prop("disabled","disabled");
            $('#inames').val(objs.modpgcfg.values);
            $('#impgid').val(objs.modpgcfg.id);
        }
    }
};

var new_userform = function(flv)
{
    var frm = "";
    frm = userpage.frmframe(flv,1);
    $('#usedfrm').html(frm);
    var $grp = $('#igroup');
    var sgrpn = getObj('sgrp').options;
    for(var opt=0;opt<sgrpn.length;opt++){
        $grp.append($("<option></option>").attr("value", sgrpn[opt].value).text(sgrpn[opt].text));
    }
    $('#currstat').html('<input type="checkbox" id="iactv" name="actv" value="1" onchange="change_check_single(this);" />');
};

var new_modcfgfrm = function(lv)
{
    var frm = "";
    frm = modconfform.printfrm(lv);
    $('#mcfgblk').html(frm);
};

var new_groupform = function()
{
    var frm = "";
    frm = userpage.groupfrm();
    $('#usedfrm').html(frm);
};

var show_permuser = function (pobj) {
    if(pobj) {
        clear_block('usedfrm');
        var frm = permform.showfrm(pobj.flv,pobj);
        $('#usedfrm').html(frm);
        //$("div").stickyTableHeaders({ scrollableArea: $("#fixedtmod")[0], "fixedOffset": 2 });

    }
};

var show_permgroup = function (pobj) {
    if(pobj) {
        clear_block('usedfrm');
        var frm = permform.showgrpfrm(pobj.flv,pobj);
        $('#usedfrm').html(frm);

    }
};

var callback_usersgrp = function(obj)
{
    if(obj && obj.upuser){
        var locid;
        if(obj.upuser == "refrgrp"){
            change_fgrp(1,'users','grpdt');
            close_usgrpfrm();
        }
        if(obj.upuser == "hidepw"){
            locid = selindex;
            if(parseInt($('#sgrp').val()) != obj.group){
                clearstimeouts();
                $('#sgrp').val(obj.group);
                change_selfgrp('#sgrp','users','usedt');
                selindex = locid;
            }
        }
        if(obj.upuser == "closeform"){
            if(parseInt($('#sgrp').val()) != obj.group){
                //clearstimeouts();
                $('#sgrp').val(obj.group);
                close_usgrpfrm();
                selindex = 0;
            }
        }
        if(obj.upuser == "closeformmcfg"){
            if(parseInt($('#slmod').val()) != obj.modid) {
                $('#slmod').val(obj.modid);
            }
            change_selfgrp('#slmod', 'admmod', 'mods');
            clear_block('mcfgblk');
            selindex = 0;
        }
    }

};

var ret_delusgrp = function(obj)
{
    if(obj && obj.cause) {
        var locid;
        if(obj.cause == 'delacc'){
            clearstimeouts();
            change_selfgrp('#sgrp','users','usedt');
        }
        if(obj.cause == 'delgrp'){
            clearstimeouts();
            change_fgrp(1,'users','grpdt');
        }
        if(obj.cause == 'delconfval'){
            clearstimeouts();
            change_selfgrp('#slmod', 'admmod', 'mods');
        }
    }
};

var disenmod = function(curobj,modid,indx,page,subpg,module,cssid,lv)
{
    "use strict";
    clearcutttm(indx);
    var enbl = 0;
    if($(curobj).prop("checked")){
        enbl = 1;
    }
    var sendobj = {"module": module, "page": page, "subpg": subpg, "cause": 'enablemods', "indx": indx, "cssid": cssid, "lv": lv, "modid": modid, "stat": enbl};
    //console.log(sendobj);
    sendsreq(sendobj);
};

var deinstallmod = function(modid,indx,page,subpg,module,cssid,lv)
{
    "use strict";
    clearcutttm(indx);
    var sendobj = {"module": module, "page": page, "subpg": subpg, "cause": 'deinstallmods', "indx": indx, "cssid": cssid, "lv": lv, "modid": modid, "bundle": ""};
    //console.log(sendobj);
    sendsreq(sendobj);
};

var installmod = function(bundle,indx,page,subpg,module,cssid,lv)
{
    "use strict";
    clearcutttm(indx);
    var sendobj = {"module": module, "page": page, "subpg": subpg, "cause": 'installmods', "indx": indx, "cssid": cssid, "lv": lv, "modid": 0, "bundle": bundle};
    //console.log(sendobj);
    sendsreq(sendobj);
};

var change_fgrp = function(grpval,page,spage)
{
    "use strict";
    clearstimeouts();
    var sendobj = {"module": '', "page": page, "subpg": spage, "group": grpval, "cause": 'refresh'};
    //console.log(sendobj);
    sendsreq(sendobj);
};

var change_selfgrp = function(selid,page,spage)
{
    "use strict";
    clearstimeouts();
    var selval = "";
    if(selid.trim() != ""){
        selval = $(selid).val();
    }
    var sendobj = {"module": '', "page": page, "subpg": spage, "group": selval, "cause": 'refresh'};
    sendsreq(sendobj);
};

var select_sysmenu = function(page,spage)
{
    "use strict";
    selindex = 0;
    clearstimeouts();
    cleartimearr();
    var sendobj = {"module": '', "page": page, "subpg": spage, "group": '', "cause": 'select'};
    sendsreq(sendobj);
};

var show_faccount = function(page,spage,id,causes)
{
    "use strict";
    var sendobj = {"module": '', "page": page, "subpg": spage, "cause": causes, "id": id};
    //console.log(sendobj);
    sendsreq(sendobj);
};

var show_search_user = function(objserch)
{
    "use strict";
    if(objserch.trim() != ''){
        var findus = $('#'+objserch).val();
        var sendobj = {"module": '', "page": 'users', "subpg": 'usedt', "cause": 'finduser', "user": findus};
        sendsreq(sendobj);
    }
};

var save_permuser = function(fpage,fsubpg,modid,userid,currobj)
{
    var send = $(currobj).serializeJSON({ checkboxUncheckedValue: "0" });
    //console.error(send);
    var sendobj = {"module": '', "page": fpage, "subpg": fsubpg, "cause": 'updpermits', "userid": userid, "params": { "type": modid, "form": send}};
    //console.log(sendobj);
    sendsreq(sendobj);
};

var save_currconfmod = function(currobj)
{
    var send = $(currobj).serializeJSON({ checkboxUncheckedValue: "0" });
    var sendbool = true;
    var sendobj = {"module": '', "page": 'admmod', "subpg": 'mods', "modid": $('#slmod').val(), "cause": 'updconfval', "objs": send};
    if(send.impgid == 0) {
        if (send.keys.trim() == "") {
            sendbool = false;
            alert('Необходимо указать Ключ конфигурации !');
        }
    } else {
        send.keys = $('#ikeys').val();
    }
    if(send.names.trim() == ""){
        sendbool = false;
        alert('Необходимо указать значение ключа конфигурации !');
    }

    if(sendbool) {
        //console.log(sendobj);
        sendsreq(sendobj);
    }
};

var save_usergrpinfo = function(currobj)
{
    var send = $(currobj).serializeJSON({ checkboxUncheckedValue: "1" });
    var attr = $(currobj).attr("id");
    var sendbool = true;
    var supage = 'usedt';
    if(attr == 'groupfrm'){
        supage = 'grpdt';
    }
    var sendobj = {"module": '', "page": 'users', "subpg": supage, "formid": attr, "cause": 'updnewusergroup', "objs": send};

    if(sendobj.formid == "userfrm"){
        if(send.descr.trim() == ""){
            sendbool = false;
            alert('Необходимо указать Ваше имя и фамилию !');
        }
        if(send.dstv == 0) {
            if (send.user.trim() == "") {
                sendbool = false;
                alert('Необходимо указать Ваш логин для доступа в систему !');
            }
            if (send.passwd.trim() == "") {
                sendbool = false;
                alert('Необходимо указать Ваш пароль для доступа в систему !');
            }
        }
    } else if(sendobj.formid == "groupfrm"){
        if(send.groups.trim() == ""){
            sendbool = false;
            alert('Поле названия группы не может быть пустым !');
        }
    }

    if(sendbool) {
        //console.log(sendobj);
        sendsreq(sendobj);
    }
};

var select_opertemod = function(indx,types,cssid)
{
    "use strict";
    clearcutttm(indx);
    var sendobj = {"module": '', "page": 'admmod', "subpg": 'mods', "cause": types, "indx": indx, "cssid": cssid};
    //console.log(sendobj);
    sendsreq(sendobj);
};

var reloadmodselect = function(lv)
{
    "use strict";
    var sendobj = {"refresh": 'modselect', "lv": lv};
    //console.log(sendobj);
    sendsreq(sendobj);
};

var change_modpage = function(sobj)
{
    clearstimeouts();
    sendsreq(sobj);
};
