"use strict";

var init_module = function(mods)
{
    //console.log('Запущен модуль'+mods+'!');
    var sends = datamod;
    sends.modcause = "selectmenu";
    sends.module = mods;
    sends.page = 'top';
    //console.log(sends);
    sendsreq(sends);
};

var callback_module = function(objects)
{
    if(objects.modcause === 'error') {
        console.error(objects.errors);
    }
    if(objects.modcause === 'selectmenu') {
        console.log(objects);
        modgen_startpg(objects);
    }
};

var change_modulepage = function(mkey)
{

};