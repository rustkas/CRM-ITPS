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
var     loadreftm;
var     currmn      = ['Января','Февраля','Марта','Апреля','Мая','Июня','Июля','Августа','Сентрября','Октября','Ноября','Декабря'];
var     mn          = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентрябрь','Октябрь','Ноябрь','Декабрь'];
var     usstatus    = ['Активен','Заблокирован'];

var livepanel = function() {
    if (!(this instanceof livepanel)) {
        return new livepanel();
    }
    var selindex = 0;
    var adms = this;

    this.setindex = function(idx)
    {
        selindex = parseInt(idx);
    };

    this.getindex = function()
    {
        return parseInt(selindex);
    };

    this.changes_mod = function (module) {
        window.location = ''+module+'';
    };

    this.select_modpg = function (module) {
        this.setindex(0);
        clearstimeouts();
        cleartimearr();
        if(init_module){
            init_module(module);
        }
    };

    this.select_mainpg = function (page) {
        this.setindex(0);
        this.select_sysmenu(page,'');
    };

    this.init_page = function(mod,pg)
    {
        upd_toptime();
        if(String(mod).trim() !== ""){
            this.select_modpg(mod);
        } else {
            this.select_mainpg(pg);
        }

    };

    this.callback_panel = function(result)
    {
        if (result.cause === 'select') {
            //console.error(result);
            if (String(result.page).trim() !== "") {
                this.show_fpage(result);
            }
        }
        if (result.cause === 'refresh') {
            //console.log(result);
            if (String(result.page).trim() !== "" && String(result.subpg).trim() !== "") {
                this.show_dyncont(result);
            }
        }
        if (result.cause === 'listacc') {
            //console.log(result);
            this.show_userform(result);
        }
        if (result.cause === 'listpermobj') {
            //console.log(result);
            this.show_permuser(result);
        }
        if (result.cause === 'listgrp') {
            //console.log(result);
            this.show_groupform(result);
        }
        if (result.cause === 'listpermgrp') {
            //console.log(result);
            this.show_permgroup(result);
        }
        if (result.cause === 'finduser') {
            //console.log(result);
            this.show_findsuser(result);
        }
        if (result.cause === 'updpermits') {

        }
        if (result.cause === 'updnewusergroup') {
            //console.log(result);
            this.callback_usersgrp(result);
        }
        if (result.cause === 'delacc') {
            //console.log(result);
            this.ret_delusgrp(result);
        }
        if (result.cause === 'delgrp') {
            //console.log(result);
            this.ret_delusgrp(result);
        }
        if (result.cause === 'listconfmod') {
            //console.log(result);
            this.show_modcfgpgform(result);
        }
        if (result.cause === 'delconfval') {
            //console.log(result);
            this.ret_delusgrp(result);
        }
        if (result.cause === 'updconfval') {
            //console.log(result);
            this.callback_usersgrp(result);
        }
        if (result.cause === 'usedmod') {
            //console.log(result);
            this.print_usedmods(result);
        }
        if (result.cause === 'unusedmod') {
            //console.log(result);
            this.print_usedmods(result);
        }
        if (result.cause === 'enablemods') {
            //console.log(result);
            this.print_usedmods(result);
        }
        if (result.cause === 'deinstallmods') {
            //console.log(result);
            this.print_usedmods(result);
        }
        if (result.cause === 'installmods') {
            //console.log(result);
            this.print_usedmods(result);
        }
    };

    var tmpshows = {
        frmframe: function(lv, newobj)
        {
            var ltbl = "";
            ltbl += '<div class="divusfrm">';
            ltbl += '<div style="position: relative;"><img src="/bundles/admin/img/close.png" id="closefrm" style="position: absolute; top: 1px; right: 5px; width: 20px; height: 20px; cursor: pointer;" title="Закрыть"></div>';
            ltbl += '<div>'+this.userform(lv)+'</div>';
            if(parseInt(newobj) === 0) {
                ltbl += '<div>' + this.profileform(lv) + '</div>';
            }
            ltbl += '<div>';

            return ltbl;
        },
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
            rfrarr[0] = setTimeout(function(){adms.show_modules_struct(idone,idtwo);}, 100);
        },
        usedlist: function(objs){
            var tbl = "";
            var chh = '';
            if(objs) {
                tbl = '';
                tbl += '<div id="usesmodules">';

                tbl += '<div class="tline  headlines">';
                tbl += '<div style="width: 30px;" unselectable="on">&nbsp;</div>';
                tbl += '<div style="width: 250px;" unselectable="on">Название модуля</div>';
                tbl += '<div style="width: 30px;" unselectable="on">&nbsp;</div>';
                tbl += '</div>';
                var inobj = objs.objs;
                if(inobj && inobj.length){
                    var tblen = inobj.length;
                    for(var un=0;un<tblen;un++){
                        if(parseInt(objs.lv) === 2) {
                            chh = '';
                            if(parseInt(inobj[un].enables) === 1){
                                chh = ' checked="checked"';
                            }
                            tbl += '<div class="tline celline">';
                            tbl += '<div style="width: 30px;" unselectable="on"><input type="checkbox" id="'+inobj[un].id+'|'+objs.indx+'|'+objs.page+'|'+objs.subpg+'|'+objs.module+'|'+objs.cssid+'|'+objs.lv+'"'+chh+' /></div>';
                            tbl += '<div style="width: 250px; cursor: pointer;" unselectable="on">'+inobj[un].displays+'</div>';
                            tbl += '<div style="width: 30px;" unselectable="on"><img src="/bundles/admin/img/unused.png" id="'+inobj[un].id+'|'+objs.indx+'|'+objs.page+'|'+objs.subpg+'|'+objs.module+'|'+objs.cssid+'|'+objs.lv+'" title="Удалить модуль" alt="удалить" /></div>';
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
                var $usesmodules = $("#usesmodules");
                $usesmodules.find("input[type='checkbox']").change(function(){
                    if($(this).attr("id")){
                        if(String($(this).attr("id")).trim() !== ""){
                            var params = String($(this).attr("id")).trim().split("|");
                            if(params.length === 7){
                                adms.disenmod(this,params[0],params[1],params[2],params[3],params[4],params[5],params[6]);
                            }
                        }
                    }
                });
                $usesmodules.find("img").click(function(){
                    if($(this).attr("id")){
                        if(String($(this).attr("id")).trim() !== ""){
                            var params = String($(this).attr("id")).trim().split("|");
                            if(params.length === 7){
                                adms.deinstallmod(params[0],params[1],params[2],params[3],params[4],params[5],params[6]);
                            }
                        }
                    }
                });

                rfrarr[objs.indx] = setTimeout(function () {
                    adms.select_opertemod(objs.indx, objs.cause, objs.cssid);
                }, 10000);
            }
        },
        unusedlist: function(objs){
            if(objs) {
                var tbl = "";
                tbl += '<div id="unusesmodules">';

                tbl += '<div class="tline headlines">';
                tbl += '<div style="width: 30px;" unselectable="on">&nbsp;</div>';
                tbl += '<div style="width: 250px;" unselectable="on">Название модуля</div>';
                tbl += '</div>';
                var inobj = objs.objs;
                if(inobj && inobj.length){
                    var tblen = inobj.length;
                    for(var un=0;un<tblen;un++){
                        if(parseInt(objs.lv) === 2) {
                            tbl += '<div class="tline celline">';
                            tbl += '<div style="width: 30px;" unselectable="on"><img src="/bundles/admin/img/used.png" id="'+inobj[un].bundle+'|'+objs.indx+'|'+objs.page+'|'+objs.subpg+'|'+objs.module+'|'+objs.cssid+'|'+objs.lv+'" title="Установить модуль" alt="установить" /></div>';
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
                var $unusesmodules = $("#unusesmodules");
                $unusesmodules.find("img").click(function(){
                    if($(this).attr("id")){
                        if(String($(this).attr("id")).trim() !== ""){
                            var params = String($(this).attr("id")).trim().split("|");
                            if(params.length === 7){
                                adms.installmod(params[0],params[1],params[2],params[3],params[4],params[5],params[6]);
                            }
                        }
                    }
                });

                rfrarr[objs.indx] = setTimeout(function () {
                    adms.select_opertemod(objs.indx, objs.cause, objs.cssid);
                }, 10000);
            }
        },
        changereads: function(keys){
            var ch = "";
            if(parseInt(keys) === 1){
                ch = '<span style="width: 18px; height: 18px; border: 1px solid #b6bfc0; padding-left: 5px; padding-right: 5px; cursor: default;" unselectable="on">v</span>';
            } else {
                ch = '<span style="width: 18px; height: 18px; border: 1px solid #b6bfc0; padding-left: 6px; padding-right: 6px; cursor: default;" unselectable="on">&nbsp;</span>';
            }

            return ch;
        },
        printfrm: function(lv){
            var ltbl = "";
            ltbl += '<div class="divusfrm" style="width: 400px; margin-top: 10px;">';
            ltbl += '<div style="position: relative;"><img src="/bundles/admin/img/close.png" id="closefrm" style="position: absolute; top: 1px; right: 5px; width: 20px; height: 20px; cursor: pointer;" title="Закрыть"></div>';
            if(parseInt(lv) === 2) {
                ltbl += '<div style="display: block;">' + this.createform() + '</div>';
            }
            ltbl += '<div>';

            return ltbl;
        },
        createform: function(){
            var tbl ="";
            tbl += '<form method="post" id="modconfident" action="javascript:void(null);">';
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
        },
        showfrm: function(lv,obj){
            var ltbl = "";
            ltbl += '<div class="divusfrm">';
            ltbl += '<div style="position: relative;"><img src="/bundles/admin/img/close.png" id="closefrm" style="position: absolute; top: 1px; right: 5px; width: 20px; height: 20px; cursor: pointer;" title="Закрыть"></div>';
            if(parseInt(lv) === 2) {
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
            ltbl += '<div style="position: relative;"><img src="/bundles/admin/img/close.png" id="closefrm" style="position: absolute; top: 1px; right: 5px; width: 20px; height: 20px; cursor: pointer;" title="Закрыть"></div>';
            if(parseInt(lv) === 2) {
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

            tbl += '<div><form method="post" id="syspermfrm" action="javascript:void(null);">';
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
                tbl += '<div id="formperms">';
                for(var m=0;m<mlen;m++){
                    tbl += '<div><form method="post" id="'+obj.perms.userprm[m].id+'|'+obj.page+'|'+obj.subpg+'|'+obj.name.id+'" action="javascript:void(null);">';
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
                tbl += '<div id="formperms">';
                for(var m=0;m<mlen;m++){
                    tbl += '<div><form method="post" id="'+obj.perms[m].id+'|'+obj.page+'|'+obj.subpg+'|'+obj.name.id+'" action="javascript:void(null);">';
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
                tbl += '</div>';
            }
            tbl += '</div>';
            tbl += '</td></tr></table>';

            return tbl;
        },
        printcheck: function(st,mod,id,pos){
            var check = "";
            var ch = ' value="0"';
            if(parseInt(st) === 1){
                ch = ' value="1" checked="checked"';
            }
            check = '<input type="checkbox" id="i_'+id+'_'+pos+'" name="'+id+'_'+pos+'"'+ch+' />';

            return check;
        },
        printread: function(val){
            var ret = "-";
            if(parseInt(val) === 1){
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
                if(s === parseInt(val)){
                    ret += '<option selected value="'+s+'">'+this.printsysread(s)+'</option>';
                } else {
                    ret += '<option value="'+s+'">'+this.printsysread(s)+'</option>';
                }
            }
            ret += '</select>';

            return ret;
        },
        userform: function (lv) {
            var tbl ="";
            var ens = ' disabled="disabled"';
            if(parseInt(lv) === 2){
                tbl += '<form method="post" id="userfrm" action="javascript:void(null);">';
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
            if(parseInt(lv) === 2) {
                tbl += '<td>Пароль</td>';
                tbl += '<td><input type="password" name="passwd" id="ipasswd" value=""'+ens+' /></td>';
                tbl += '</tr><tr>';
            }
            tbl += '<td>Статус пользователя</td>';
            tbl += '<td id="currstat"></td>';
            if(parseInt(lv) === 2) {
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
            if(parseInt(lv) === 2){
                tbl += '<form method="post" id="proffrm" action="javascript:void(null);">';
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

            if(parseInt(lv) === 2) {
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
            tbl += '<div style="position: relative;"><img src="/bundles/admin/img/close.png" id="closefrm" style="position: absolute; top: 1px; right: 5px; width: 20px; height: 20px; cursor: pointer;" title="Закрыть"></div>';
            tbl += '<form method="post" id="groupfrm" action="javascript:void(null);">';
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

    this.print_usedmods = function(obj)
    {
        if(String(obj.cause).trim() === "usedmod"){
            tmpshows.usedlist(obj);
        }
        if(String(obj.cause).trim() === "enablemods"){
            obj.cause = "usedmod";
            tmpshows.usedlist(obj);
        }
        if(String(obj.cause).trim() === "unusedmod"){
            tmpshows.unusedlist(obj);
        }
        if(String(obj.cause).trim() === "deinstallmods"){
            obj.cause = "usedmod";
            tmpshows.usedlist(obj);
            this.reloadmodselect(obj.lv);
        }
        if(String(obj.cause).trim() === "installmods"){
            obj.cause = "unusedmod";
            tmpshows.unusedlist(obj);
            this.reloadmodselect(obj.lv);
        }
    };

    this.show_modules_struct = function(idone,idtwo)
    {
        cleartimearr();
        rfrarr[0] = setTimeout(function(){adms.select_opertemod(0,'usedmod',idone);}, 100);
        rfrarr[1] = setTimeout(function(){adms.select_opertemod(1,'unusedmod',idtwo);}, 100);
    };

    this.show_fpage = function(objs)
    {
        var tmpl = '';
        var edtbtn = '';
        var g = 0;
        var $functpg = $("#functpg");
        var $findfrm = $("#findfrm");
        if(String(objs.page).trim() !== ""){
            if(String(objs.page).trim() === "users") {
                if (String(objs.subpg).trim() === "" || String(objs.subpg).trim() === "usedt") {

                    if(parseInt(objs.flv) === 2) {
                        edtbtn = '<div class="fpgsys" style="position: relative;"><select id="sgrp"></select><img src="/bundles/admin/img/add.png" id="addusers" style="position: absolute; top: 3px; right: 15px; width: 34px; height: 34px; cursor: pointer;" title="Добавить пользователя" /></div>';
                    } else {
                        edtbtn = '<div class="fpgsys"><select id="sgrp"></select></div>';
                    }

                    tmpl = '<div class="fpglists">';
                    tmpl += '<table>';
                    tmpl += '<tr>';
                    tmpl += '<td style="width: 400px;">';
                    tmpl += edtbtn;
                    tmpl += '<div id="uslist"></div>';
                    tmpl += '</td>';
                    tmpl += '<td><div id="usedfrm"></div></td>';
                    tmpl += '</tr>';
                    tmpl += '</table>';
                    tmpl += '</div>';

                    if(String(tmpl).trim() !== "") {
                        $functpg.html(tmpl);
                        var $sgrp = $('#sgrp');
                        $sgrp.empty();
                        if(objs.groups && objs.groups.length){
                            for (g = 0; g < objs.groups.length; g++) {
                                $sgrp.append($("<option></option>").attr("value", objs.groups[g].id).text(objs.groups[g].name));
                            }
                        }
                        $sgrp.change(function(){
                            adms.setindex(0);
                            adms.change_selfgrp('#sgrp','' + objs.page + '','usedt');
                        });
                        if(parseInt(objs.flv) === 2) {
                            $("#addusers").click(function () {
                                adms.new_userform('+objs.flv+');
                            });
                        }

                    } else {
                        $functpg.html('');
                    }

                    $findfrm.html('<input type="text" id="faindus" value="" /><button id="searchusers">Искать</button>');
                    $findfrm.click(function(){
                        if(parseInt(event.keyCode)===13) {
                            var sendobj = {
                                "module": '',
                                "page": 'users',
                                "subpg": 'usedt',
                                "cause": 'finduser',
                                "user": $('#faindus').val()
                            };
                            sendsreq(sendobj);
                        }
                    });
                    $("#searchusers").click(function(){
                        var sendobj = {
                            "module": '',
                            "page": 'users',
                            "subpg": 'usedt',
                            "cause": 'finduser',
                            "user": $('#faindus').val()
                        };
                        sendsreq(sendobj);
                    });
                    this.change_fgrp($sgrp.val(),objs.page,'usedt');
                } else {
                    if(parseInt(objs.flv) === 2) {
                        edtbtn = '<div class="fpgsys" style="position: relative; height: 40px;"><img src="/bundles/admin/img/add.png" id="addgroups" style="position: absolute; top: 3px; right: 15px; width: 34px; height: 34px; cursor: pointer;" title="Добавить пользователя" /></div>';
                    }

                    tmpl = '<div class="fpglists">';
                    tmpl += '<table>';
                    tmpl += '<tr>';
                    tmpl += '<td style="width: 400px;">';
                    tmpl += edtbtn;
                    tmpl += '<div id="uslist"></div>';
                    tmpl += '</td>';
                    tmpl += '<td><div id="usedfrm"></div></td>';
                    tmpl += '</tr>';
                    tmpl += '</table>';
                    tmpl += '</div>';

                    if(String(tmpl).trim() !== "") {
                        $functpg.html(tmpl);
                        $("#addgroups").click(function(){
                            new_groupform();
                        });
                        $findfrm.html('');
                        this.change_fgrp(1,objs.page,'grpdt');
                    } else {
                        $functpg.html('');
                        $findfrm.html('');
                    }
                }
            }
            if(String(objs.page).trim() === "admmod") {
                if(parseInt(objs.flv) === 2) {
                    edtbtn = '<div class="fpgsys" style="position: relative;"><select id="slmod"></select><img src="/bundles/admin/img/add.png" id="addparams" style="position: absolute; top: 3px; right: 15px; width: 34px; height: 34px; cursor: pointer;" title="Добавить Параметры" /></div>';
                } else {
                    edtbtn = '<div class="fpgsys"><select id="slmod"></select></div>';
                }
                tmpl = '<div class="fpglists">';
                tmpl += '<table>';
                tmpl += '<tr>';
                tmpl += '<td style="width: 400px; margin: 0 auto;">';
                tmpl += edtbtn;
                tmpl += '<div id="mcfgblk"></div>';
                tmpl += '<div id="uslist"></div>';
                tmpl += '<div></div>';
                tmpl += '</td>';
                tmpl += '<td><div id="usedmod"></div></td>';
                tmpl += '<td><div id="unusedmod"></div></td>';
                tmpl += '</tr>';
                tmpl += '</table>';
                tmpl += '</div>';

                if(String(tmpl).trim() !== "") {
                    $functpg.html(tmpl);
                    $findfrm.html('');

                    $('#usedmod').html(tmpshows.usemodules());
                    $('#unusedmod').html(tmpshows.unusemodule());
                    tmpshows.shedules('upmodule','downmodule');

                    var $slmod = $("#slmod");
                    $slmod.empty();

                    if (objs.groups && objs.groups.length) {
                        for (g = 0; g < objs.groups.length; g++) {
                            $slmod.append($("<option></option>").attr("value", objs.groups[g].id).text(objs.groups[g].name));
                        }
                        $slmod.val(0);
                    }
                    $slmod.change(function(){
                        adms.setindex(0);
                        $("#mcfgblk").html('');
                        adms.change_selfgrp('#slmod','' + objs.page + '','mods');
                    });
                    if(parseInt(objs.flv) === 2) {
                        $("#addparams").click(function(){
                            adms.new_modcfgfrm(objs.flv);
                        });
                    }

                    this.change_fgrp(0, objs.page, 'mods');
                } else {
                    $functpg.html('');
                    $findfrm.html('');
                }
            }
            if(String(objs.page).trim() === "proff") {


                $functpg.html('');
                $findfrm.html('');
                this.change_fgrp(0,objs.page,'profile');
            }
            if(String(objs.page).trim() === "index") {
                tmpl = '<div id="modicons" class="imgmods"></div>';
                if(String(tmpl).trim() !== "") {
                    $functpg.html(tmpl);
                    this.change_fgrp(0, objs.page, 'main');
                } else {
                    $functpg.html('');
                }
            }
        }
    };

    this.show_dyncont = function(objs)
    {
        var tmpl = "";
        var g = 0;
        if(String(objs.page).trim() !== "") {
            if(String(objs.page).trim() === "index") {
                if (objs.objs && objs.objs.length) {
                    var dv = getElementPosition('functpg'), curcnt = 0, wd = 0, tr = 0;
                    wd = dv.width;
                    tr = Math.floor(wd/120);
                    var len = objs.objs.length;
                    tmpl = '<table id="lsmod">';
                    //console.log(objs.objs);
                    for(var m=0;m<len;m++){
                        if(parseInt(curcnt)===0){
                            tmpl += '<tr>';
                        }

                        tmpl += '<td style="width: 120px;">';
                        tmpl += '<div class="iconm" id="'+m+'|'+objs.objs[m].link+'">';
                        tmpl += '<div><img src="'+objs.objs[m].imgsrc+'" title="'+objs.objs[m].moddisp+'" style="width: 64px; height: 64px; margin: 2px auto;" alt="module" /></div>';
                        tmpl += '<div>'+objs.objs[m].moddisp+'</div>';
                        tmpl += '</div>';
                        tmpl += '</td>';

                        if(parseInt(curcnt)===(parseInt(tr)-1)){
                            tmpl += '</tr>';
                            curcnt = 0;
                        } else {
                            curcnt++;
                        }
                    }

                    if(curcnt<(tr-1)){
                        for(var dop=curcnt;dop<tr;dop++){
                            tmpl += '<td style="width: 110px;">&nbsp;</td>';
                            if(parseInt(dop)===(parseInt(tr)-1)){
                                tmpl += '</tr>';
                            }}}
                    tmpl += '</table>';

                    $('#modicons').html(tmpl);
                    $("#lsmod").find("tr td div").click(function(){
                        if($(this).attr("id")){
                            if(String($(this).attr("id")).trim() !== ""){
                                var modnames = String($(this).attr("id")).trim().split("|");
                                if(modnames.length === 2){
                                    adms.changes_mod(modnames[1]);
                                }
                            }
                        }
                    });
                    this.refresh_toppgcont('',objs.page,objs.subpg);
                }
            }
            if (String(objs.page).trim() === "users") {
                if (String(objs.subpg).trim() === "usedt") {
                    tmpl = '<table>';
                    tmpl += '<thead>';
                    tmpl += '<tr>';
                    tmpl += '<th>Пользователь</th>';
                    tmpl += '<th>Статус</th>';
                    tmpl += '<th style="width: 25px;"></th>';
                    tmpl += '<th style="width: 25px;"></th>';
                    tmpl += '</tr>';
                    tmpl += '</thead>';
                    tmpl += '<tbody id="shuserlist">';

                    if (objs.groups && objs.groups.length) {
                        for (g = 0; g < objs.groups.length; g++) {
                            if(this.getindex() > 0 && this.getindex() === parseInt(objs.groups[g].id)){
                                tmpl += '<tr id="'+objs.groups[g].id+'|'+objs.page+'|'+objs.subpg+'|listacc" class="selus">';
                            } else {
                                tmpl += '<tr id="'+objs.groups[g].id+'|'+objs.page+'|'+objs.subpg+'|listacc">';
                            }
                            tmpl += '<td style="cursor: pointer;">'+objs.groups[g].name+'</td>';
                            tmpl += '<td style="cursor: pointer;">'+usstatus[parseInt(objs.groups[g].actives)]+'</td>';
                            if(parseInt(objs.groups[g].lv) === 2) {
                                tmpl += '<td><img src="/bundles/admin/img/edite.png" id="'+objs.groups[g].id+'|'+objs.page+'|'+objs.subpg+'|listpermobj" style="cursor: pointer; width: 20px; height: 20px;" title="Права доступа" alt="" /></td>';
                                tmpl += '<td><img src="/bundles/admin/img/del.png" id="'+objs.groups[g].id+'|'+objs.page+'|'+objs.subpg+'|delacc" style="cursor: pointer; width: 20px; height: 20px;" title="Удалить" alt="" /></td>';
                            } else {
                                tmpl += '<td><img src="/bundles/admin/img/edite.png" id="'+objs.groups[g].id+'|'+objs.page+'|'+objs.subpg+'|listpermobj" style="cursor: pointer; width: 20px; height: 20px;" title="Права доступа" alt="" /></td>';
                                tmpl += '<td></td>';
                            }
                            tmpl += '</tr>';
                        }
                    }
                    tmpl += '</tbody>';
                    tmpl += '</table>';

                    $('#uslist').html(tmpl);
                    var $shuserlist = $("#shuserlist");
                    $shuserlist.find("tr").click(function(e){
                        if($(this).attr("id")) {
                            if(String($(this).attr("id")).trim() !== "") {
                                var params = String($(this).attr("id")).trim().split("|");
                                if(params.length === 4) {
                                    $('#uslist').find("tr.selus").removeClass('selus');
                                    $(this).addClass('selus');
                                    adms.setindex(parseInt(params[0]));
                                    adms.show_faccount(params[1],params[2],params[0],params[3]);
                                }
                            }
                        }
                    });
                    $shuserlist.find("tr td img").click(function(e){
                        if($(this).attr("id")) {
                            if (String($(this).attr("id")).trim() !== "") {
                                var params = String($(this).attr("id")).trim().split("|");
                                if (params.length === 4) {
                                    if(String(params[3]).trim() === "listpermobj"){
                                        $('#uslist').find("tr.selus").removeClass('selus');
                                        $(this).parent().parent().addClass('selus');
                                        adms.setindex(parseInt(params[0]));
                                    }
                                    adms.show_faccount(params[1],params[2],params[0],params[3]);
                                }
                            }
                        }
                        e.stopPropagation();
                    });

                    this.refresh_toppgcont('#sgrp',objs.page,objs.subpg);
                } else {
                    tmpl = '<table>';
                    tmpl += '<thead>';
                    tmpl += '<tr>';
                    tmpl += '<th>Группа</th>';
                    tmpl += '<th style="width: 25px;"></th>';
                    tmpl += '<th style="width: 25px;"></th>';
                    tmpl += '</tr>';
                    tmpl += '</thead>';
                    tmpl += '<tbody id="shgrouplist">';

                    if (objs.groups && objs.groups.length) {
                        for (g = 0; g < objs.groups.length; g++) {
                            if(this.getindex() > 0 && this.getindex() === parseInt(objs.groups[g].id)){
                                tmpl += '<tr id="'+objs.groups[g].id+'|'+objs.page+'|'+objs.subpg+'|listgrp" class="selus">';
                            } else {
                                tmpl += '<tr id="'+objs.groups[g].id+'|'+objs.page+'|'+objs.subpg+'|listgrp">';
                            }
                            if(parseInt(objs.groups[g].lv) === 2) {
                                tmpl += '<td style="cursor: pointer;">'+objs.groups[g].name+'</td>';
                                tmpl += '<td><img src="/bundles/admin/img/edite.png" id="'+objs.groups[g].id+'|'+objs.page+'|'+objs.subpg+'|listpermgrp" style="cursor: pointer; width: 20px; height: 20px;" title="Права доступа" alt="" /></td>';
                                tmpl += '<td><img src="/bundles/admin/img/del.png" id="'+objs.groups[g].id+'|'+objs.page+'|'+objs.subpg+'|delgrp" style="cursor: pointer; width: 20px; height: 20px;" title="Удалить" alt="" /></td>';
                            } else {
                                tmpl += '<td style="cursor: default;">'+objs.groups[g].name+'</td>';
                                tmpl += '<td><img src="/bundles/admin/img/edite.png" id="'+objs.groups[g].id+'|'+objs.page+'|'+objs.subpg+'|listpermgrp" style="cursor: pointer; width: 20px; height: 20px;" title="Права доступа" alt="" /></td>';
                                tmpl += '<td></td>';
                            }
                            tmpl += '</tr>';
                        }
                    }
                    tmpl += '</tbody>';
                    tmpl += '</table>';

                    $('#uslist').html(tmpl);
                    var $shgrouplist = $("#shgrouplist");
                    $shgrouplist.find("tr").click(function(e){
                        if($(this).attr("id")) {
                            if(String($(this).attr("id")).trim() !== "") {
                                var params = String($(this).attr("id")).trim().split("|");
                                if(params.length === 4) {
                                    $('#uslist').find("tr.selus").removeClass('selus');
                                    $(this).addClass('selus');
                                    adms.setindex(parseInt(params[0]));
                                    adms.show_faccount(params[1],params[2],params[0],params[3]);
                                }
                            }
                        }
                    });
                    $shgrouplist.find("tr td img").click(function(e){
                        if($(this).attr("id")) {
                            if (String($(this).attr("id")).trim() !== "") {
                                var params = String($(this).attr("id")).trim().split("|");
                                if (params.length === 4) {
                                    if(String(params[3]).trim() === "listpermobj"){
                                        $('#uslist').find("tr.selus").removeClass('selus');
                                        $(this).parent().parent().addClass('selus');
                                        adms.setindex(parseInt(params[0]));
                                    }
                                    adms.show_faccount(params[1],params[2],params[0],params[3]);
                                }
                            }
                        }
                        e.stopPropagation();
                    });


                    this.refresh_toppgcont('',objs.page,objs.subpg);
                }
            }
            if (String(objs.page).trim() === "admmod") {
                if (String(objs.subpg).trim() === "" || String(objs.subpg).trim() === "mods") {
                    tmpl = '<table>';
                    tmpl += '<thead>';
                    tmpl += '<tr>';
                    tmpl += '<th>Ключ</th>';
                    tmpl += '<th style="width: 35px;"></th>';
                    tmpl += '<th>Значение</th>';
                    tmpl += '<th style="width: 25px;"></th>';
                    tmpl += '</tr>';
                    tmpl += '</thead>';
                    tmpl += '<tbody id="shconflist">';

                    if (objs.groups && objs.groups.length) {
                        for (g = 0; g < objs.groups.length; g++) {
                            if(this.getindex() > 0 && this.getindex() === parseInt(objs.groups[g].id)){
                                tmpl += '<tr id="'+objs.groups[g].id+'|'+objs.page+'|'+objs.subpg+'|listconfmod" class="selus">';
                            } else {
                                tmpl += '<tr id="'+objs.groups[g].id+'|'+objs.page+'|'+objs.subpg+'|listconfmod">';
                            }
                            if(parseInt(objs.groups[g].lv) === 2) {
                                tmpl += '<td style="cursor: pointer;">' + objs.groups[g].keys + '</td>';
                                tmpl += '<td style="cursor: pointer;">=</td>';
                                tmpl += '<td style="cursor: pointer;">' + objs.groups[g].values + '</td>';
                                tmpl += '<td><img src="/bundles/admin/img/del.png" id="'+objs.groups[g].id+'|'+objs.page+'|'+objs.subpg+'|delconfval" style="cursor: pointer; width: 20px; height: 20px;" title="Удалить" alt="" /></td>';
                            } else {
                                tmpl += '<td style="cursor: default;">' + objs.groups[g].keys + '</td>';
                                tmpl += '<td style="cursor: default;">=</td>';
                                tmpl += '<td style="cursor: default;">' + objs.groups[g].values + '</td>';
                                tmpl += '<td></td>';
                            }
                            tmpl += '</tr>';
                        }
                    }
                    tmpl += '</tbody>';
                    tmpl += '</table>';

                    $('#uslist').html(tmpl);
                    var $shconflist = $("#shconflist");
                    $shconflist.find("tr").click(function(e){
                        if($(this).attr("id")) {
                            if(String($(this).attr("id")).trim() !== "") {
                                var params = String($(this).attr("id")).trim().split("|");
                                //console.log(params);
                                if(params.length === 4) {
                                    $('#uslist').find("tr.selus").removeClass('selus');
                                    $(this).addClass('selus');
                                    adms.setindex(parseInt(params[0]));
                                    adms.show_faccount(params[1],params[2],params[0],params[3]);
                                }
                            }
                        }
                    });
                    $shconflist.find("tr td img").click(function(e){
                        if($(this).attr("id")) {
                            if (String($(this).attr("id")).trim() !== "") {
                                var params = String($(this).attr("id")).trim().split("|");
                                //console.log(params);
                                if (params.length === 4) {
                                    adms.show_faccount(params[1],params[2],params[0],params[3]);
                                }
                            }
                        }
                        e.stopPropagation();
                    });

                    this.refresh_toppgcont('#slmod',objs.page,objs.subpg);
                }
            }
        }
    };

    this.refresh_toppgcont = function(selid,page,spage){
        refdt = setTimeout(function(){adms.change_selfgrp(selid,page,spage);}, 10000);
    };

    this.new_userform = function(flv)
    {
        var frm = "";
        frm = tmpshows.frmframe(flv,1);
        $('#usedfrm').html(frm);
        var $grp = $('#igroup');
        var sgrpn = getObj('sgrp').options;
        for(var opt=0;opt<sgrpn.length;opt++){
            $grp.append($("<option></option>").attr("value", sgrpn[opt].value).text(sgrpn[opt].text));
        }
        $('#currstat').html('<input type="checkbox" id="iactv" name="actv" value="1" />');
        $("#iactv").change(function(){
            adms.change_check_single(this);
        });
        $("#userfrm").submit(function(){
            adms.save_usergrpinfo(this);
        });
        $("#proffrm").submit(function(){
            adms.save_usergrpinfo(this);
        });
        $("#closefrm").click(function(){
            $('#usedfrm').html('');
        });
    };

    this.change_check_single = function(obj)
    {
        if(obj) {
            if($(obj).prop("checked")){
                $(obj).val(0);
            } else {
                $(obj).val(1);
            }
        }
    };

    this.select_sysmenu = function(page,spage)
    {
        this.setindex(0);
        clearstimeouts();
        cleartimearr();
        var sendobj = {"module": '', "page": page, "subpg": spage, "group": '', "cause": 'select'};
        sendsreq(sendobj);
    };

    this.change_fgrp = function(grpval,page,spage)
    {
        "use strict";
        clearstimeouts();
        var sendobj = {"module": '', "page": page, "subpg": spage, "group": grpval, "cause": 'refresh'};
        sendsreq(sendobj);
    };

    this.change_selfgrp = function(selid,page,spage)
    {
        clearstimeouts();
        var selval = "";
        if(String(selid).trim() !== ""){
            selval = $(selid).val();
        }
        var sendobj = {"module": '', "page": page, "subpg": spage, "group": selval, "cause": 'refresh'};
        sendsreq(sendobj);
    };

    this.select_opertemod = function(indx,types,cssid)
    {
        clearcutttm(indx);
        var sendobj = {"module": '', "page": 'admmod', "subpg": 'mods', "cause": types, "indx": indx, "cssid": cssid};
        //console.log(sendobj);
        sendsreq(sendobj);
    };

    this.disenmod = function(curobj,modid,indx,page,subpg,module,cssid,lv)
    {
        clearcutttm(indx);
        var enbl = 0;
        if($(curobj).prop("checked")){
            enbl = 1;
        }
        var sendobj = {"module": module, "page": page, "subpg": subpg, "cause": 'enablemods', "indx": indx, "cssid": cssid, "lv": lv, "modid": modid, "stat": enbl};
        //console.log(sendobj);
        sendsreq(sendobj);
    };

    this.deinstallmod = function(modid,indx,page,subpg,module,cssid,lv)
    {
        clearcutttm(indx);
        var sendobj = {"module": module, "page": page, "subpg": subpg, "cause": 'deinstallmods', "indx": indx, "cssid": cssid, "lv": lv, "modid": modid, "bundle": ""};
        //console.log(sendobj);
        sendsreq(sendobj);
    };

    this.installmod = function(bundle,indx,page,subpg,module,cssid,lv)
    {
        clearcutttm(indx);
        var sendobj = {"module": module, "page": page, "subpg": subpg, "cause": 'installmods', "indx": indx, "cssid": cssid, "lv": lv, "modid": 0, "bundle": bundle};
        //console.log(sendobj);
        sendsreq(sendobj);
    };

    this.ret_delusgrp = function(obj)
    {
        if(obj && obj.cause) {
            var locid;
            if(String(obj.cause).trim() === 'delacc'){
                clearstimeouts();
                this.change_selfgrp('#sgrp','users','usedt');
            }
            if(String(obj.cause).trim() === 'delgrp'){
                clearstimeouts();
                this.change_fgrp(1,'users','grpdt');
            }
            if(String(obj.cause).trim() === 'delconfval'){
                clearstimeouts();
                this.change_selfgrp('#slmod', 'admmod', 'mods');
            }
        }
    };

    this.show_userform = function(objs)
    {
        if(objs) {
            var frm = "";
            frm = tmpshows.frmframe(objs.flv,0);
            $('#usedfrm').html(frm);
            var $grp = $('#igroup');
            var $iuser = $("#iuser");
            $grp.empty();
            var sgrpn = getObj('sgrp').options;
            for(var opt=0;opt<sgrpn.length;opt++){
                $grp.append($("<option></option>").attr("value", sgrpn[opt].value).text(sgrpn[opt].text));
            }

            if(parseInt(objs.flv) === 2){
                if(objs.user.info) {
                    $('#idescr').val(objs.user.info.descr);
                    $grp.val(objs.user.info.group.id);
                    $iuser.val(objs.user.info.login);
                    $iuser.prop("disabled", "disabled");
                    $('#idstv').val(objs.user.info.id);
                    if(parseInt(objs.user.info.activate) === 0){
                        $('#currstat').html('<input type="checkbox" id="iactv" name="actv" value="0" checked />').change(function(){
                            adms.change_check_single(this);
                        });
                    } else {
                        $('#currstat').html('<input type="checkbox" id="iactv" name="actv" value="1" />').change(function(){
                            adms.change_check_single(this);
                        });
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
                    $grp.val(objs.user.info.group.id);
                    $iuser.val(objs.user.info.login);
                    $('#currstat').html(usstatus[objs.user.info.activate]);
                }
                if(objs.user.proff) {
                    $('#ifone').val(objs.user.proff.phone);
                    $('#imails').val(objs.user.proff.email);
                    $('#iinform').val(objs.user.proff.info);
                }
            }
            $("#userfrm").submit(function(){
                adms.save_usergrpinfo(this);
            });
            $("#proffrm").submit(function(){
                adms.save_usergrpinfo(this);
            });
        }
    };

    this.show_groupform = function(objs)
    {
        if(objs) {
            if(parseInt(objs.flv) === 2){
                var frm = "";
                frm = tmpshows.groupfrm();
                $('#usedfrm').html(frm);
                $('#igroups').val(objs.group.name);
                $('#igdstv').val(objs.group.id);
                $("#groupfrm").submit(function(){
                    adms.save_usergrpinfo(this);
                });
                $("#closefrm").click(function(){
                    $('#usedfrm').html('');
                });
            }
        }
    };

    this.show_modcfgpgform = function(objs)
    {
        if(objs) {
            //console.log(objs.modpgcfg);
            if(parseInt(objs.flv) === 2){
                var frm = "";
                frm = tmpshows.printfrm(objs.flv);
                $('#mcfgblk').html(frm);
                var $ikeys = $("#ikeys");
                $ikeys.val(objs.modpgcfg.keys);
                $ikeys.prop("disabled","disabled");
                $('#inames').val(objs.modpgcfg.values);
                $('#impgid').val(objs.modpgcfg.id);
                var $modconfident = $("#modconfident");
                $modconfident.submit(function(){
                    adms.save_currconfmod(this);
                });
                $("#closefrm").click(function(){
                    $('#mcfgblk').html('');
                });
            }
        }
    };

    this.new_modcfgfrm = function(lv)
    {
        var frm = "";
        frm = tmpshows.printfrm(lv);
        $('#mcfgblk').html(frm);
        var $modconfident = $("#modconfident");
        $modconfident.submit(function(){
            adms.save_currconfmod(this);
        });
        $("#closefrm").click(function(){
            $('#mcfgblk').html('');
        });
    };

    this.new_groupform = function()
    {
        var frm = "";
        frm = tmpshows.groupfrm();
        $('#usedfrm').html(frm);
        $("#groupfrm").submit(function(){
            adms.save_usergrpinfo(this);
        });
    };

    this.show_permuser = function (pobj) {
        if(pobj) {
            clear_block('usedfrm');
            var frm = tmpshows.showfrm(pobj.flv,pobj);
            $('#usedfrm').html(frm);
            $("#closefrm").click(function(){
                $('#usedfrm').html('');
            });
            if(parseInt(pobj.flv) === 2){
                $("#syspermfrm").submit(function(){
                    adms.save_permuser(pobj.page,pobj.subpg,0,pobj.name.id,this);
                });
                var $formperms = $("#formperms");
                $formperms.find("form").submit(function(){
                    if($(this).attr("id")){
                        if(String($(this).attr("id")).trim() !== ""){
                            var params = String($(this).attr("id")).trim().split("|");
                            if(params.length === 4){
                                adms.save_permuser(params[1],params[2],params[0],params[3],this);
                            }
                        }
                    }
                });
                $formperms.find("form input[type='checkbox']").change(function(){
                    if($(this).attr("id")) {
                        if (String($(this).attr("id")).trim() !== "") {
                            var chkset = String($(this).attr("id")).trim().split("_");
                            if(chkset.length === 3){
                                adms.check_perminput(this,chkset[2]);
                            }
                        }
                    }
                });
            }
        }
    };

    this.show_permgroup = function (pobj) {
        if(pobj) {
            clear_block('usedfrm');
            var frm = tmpshows.showgrpfrm(pobj.flv,pobj);
            $('#usedfrm').html(frm);
            $("#closefrm").click(function(){
                $('#usedfrm').html('');
            });
            if(parseInt(pobj.flv) === 2){
                var $formperms = $("#formperms");
                $formperms.find("form").submit(function(){
                    if($(this).attr("id")){
                        if(String($(this).attr("id")).trim() !== ""){
                            var params = String($(this).attr("id")).trim().split("|");
                            if(params.length === 4){
                                adms.save_permuser(params[1],params[2],params[0],params[3],this);
                            }
                        }
                    }
                });
                $formperms.find("form input[type='checkbox']").change(function(){
                    if($(this).attr("id")) {
                        if (String($(this).attr("id")).trim() !== "") {
                            var chkset = String($(this).attr("id")).trim().split("_");
                            if(chkset.length === 3){
                                adms.check_perminput(this,chkset[2]);
                            }
                        }
                    }
                });
            }
        }
    };

    this.callback_usersgrp = function(obj)
    {
        if(obj && obj.upuser){
            var locid;
            var $slmod = $("#slmod");
            var $sgrp = $("#sgrp");
            if(String(obj.upuser).trim() === "refrgrp"){
                this.change_fgrp(1,'users','grpdt');
                $('#usedfrm').html('');
            }
            if(String(obj.upuser).trim() === "hidepw"){
                locid = this.getindex();
                if(parseInt($slmod.val()) !== parseInt(obj.group)){
                    clearstimeouts();
                    $sgrp.val(obj.group);
                    this.change_selfgrp('#sgrp','users','usedt');
                    this.setindex(locid);
                }
            }
            if(String(obj.upuser).trim() === "closeform"){
                if(parseInt($slmod.val()) !==  parseInt(obj.group)){
                    //clearstimeouts();
                    $sgrp.val(obj.group);
                    $('#usedfrm').html('');
                    this.setindex(0);
                }
            }
            if(String(obj.upuser).trim() === "closeformmcfg"){
                if(parseInt($slmod.val()) !== parseInt(obj.modid)) {
                    $slmod.val(obj.modid);
                }
                this.change_selfgrp('#slmod', 'admmod', 'mods');
                clear_block('mcfgblk');
                this.setindex(0);
            }
        }

    };

    this.show_faccount = function(page,spage,id,causes)
    {
        var sendobj = {"module": '', "page": page, "subpg": spage, "cause": causes, "id": id};
        //console.log(sendobj);
        sendsreq(sendobj);
    };

    this.save_permuser = function(fpage,fsubpg,modid,userid,currobj)
    {
        var send = $(currobj).serializeJSON({ checkboxUncheckedValue: "0" });
        var sendobj = {"module": '', "page": fpage, "subpg": fsubpg, "cause": 'updpermits', "userid": userid, "params": { "type": modid, "form": send}};
        //console.log(sendobj);
        sendsreq(sendobj);
    };

    this.reloadmodselect = function(lv)
    {
        "use strict";
        var sendobj = {"refresh": 'modselect', "lv": lv};
        //console.log(sendobj);
        sendsreq(sendobj);
    };

    this.show_findsuser = function(robj)
    {
        if(robj.user.info.group.id) {
            $('#sgrp').val(robj.user.info.group.id);
            this.setindex(robj.uid);
            this.change_selfgrp('#sgrp',robj.page,'usedt');
            this.show_userform(robj);
        }
    };

    this.save_currconfmod = function(currobj)
    {
        var send = $(currobj).serializeJSON({ checkboxUncheckedValue: "0" });
        var sendbool = true;
        var sendobj = {"module": '', "page": 'admmod', "subpg": 'mods', "modid": $('#slmod').val(), "cause": 'updconfval', "objs": send};
        if(parseInt(send.impgid) === 0) {
            if (String(send.keys).trim() === "") {
                sendbool = false;
                alert('Необходимо указать Ключ конфигурации !');
            }
        } else {
            send.keys = $('#ikeys').val();
        }
        if(String(send.names).trim() === ""){
            sendbool = false;
            alert('Необходимо указать значение ключа конфигурации !');
        }

        if(sendbool) {
            //console.log(sendobj);
            sendsreq(sendobj);
        }
    };

    this.save_usergrpinfo = function(currobj)
    {
        var send = $(currobj).serializeJSON({ checkboxUncheckedValue: "1" });
        var attr = $(currobj).attr("id");
        var sendbool = true;
        var supage = 'usedt';
        if(String(attr).trim() === 'groupfrm'){
            supage = 'grpdt';
        }
        var sendobj = {"module": '', "page": 'users', "subpg": supage, "formid": attr, "cause": 'updnewusergroup', "objs": send};

        if(String(sendobj.formid).trim() === "userfrm"){
            if(String(send.descr).trim() === ""){
                sendbool = false;
                alert('Необходимо указать Ваше имя и фамилию !');
            }
            if(parseInt(send.dstv) === 0) {
                if (String(send.user).trim() === "") {
                    sendbool = false;
                    alert('Необходимо указать Ваш логин для доступа в систему !');
                }
                if (String(send.passwd).trim() === "") {
                    sendbool = false;
                    alert('Необходимо указать Ваш пароль для доступа в систему !');
                }
            }
        } else if(String(sendobj.formid).trim() === "groupfrm"){
            if(String(send.groups).trim() === ""){
                sendbool = false;
                alert('Поле названия группы не может быть пустым !');
            }
        }

        if(sendbool) {
            //console.log(sendobj);
            sendsreq(sendobj);
        }
    };

    this.check_perminput = function(obj,typ)
    {
        if(obj) {
            var parentn;
            var idi;
            if($(obj).prop("checked")){
                $(obj).val(1);
            } else {
                $(obj).val(0);
            }

            if (String(typ).trim() === 'list') {
                if (!$(obj).prop("checked")) {
                    parentn = $(obj).parent().parent();
                    var descCount = $(parentn).find('div input[type="checkbox"]').each(function(index, elem) {
                        idi = elem.id.split('_');
                        if(String(idi[idi.length-1]).trim() !== 'list' && elem.checked) {
                            elem.checked = false;
                            elem.value = 0;
                        }
                    }).length;
                }
            } else {
                if ($(obj).prop("checked")) {
                    parentn = $(obj).parent().parent();
                    var undescCount = $(parentn).find('div input[type="checkbox"]').each(function(index, elem) {
                        idi = elem.id.split('_');
                        if(String(idi[idi.length-1]).trim() === 'list' && !elem.checked) {
                            elem.checked = true;
                            elem.value = 1;
                        }
                    }).length;
                }
            }
        }
    };

};
