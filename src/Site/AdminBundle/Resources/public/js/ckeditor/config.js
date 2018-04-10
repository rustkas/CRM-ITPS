/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
config.language = 'ru';
//config.width = 600;
config.skin = 'moono';
//config.uiColor = '#AADC6E';
config.toolbar = 'Full';

config.toolbar_Full = [
	{ name: 'document', items : [ 'Source' ] },
	{ name: 'clipboard', items : [ 'Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
	{ name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote','CreateDiv','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ] },
	"/",
	{ name: 'basicstyles', items : [ 'Bold','Italic','Underline' ] },
	{ name: 'styles', items : [ 'Styles','Font','FontSize' ] },
	{ name: 'colors', items : [ 'TextColor','BGColor' ] }
];

//config.mathJaxLib = 'http://cdn.mathjax.org/mathjax/2.6-latest/MathJax.js?config=TeX-AMS_HTML';,mathjax,widget,basewidget
config.extraPlugins = 'clipboard,dialog,colordialog,image,div,find,link,liststyle,magicline,preview,scayt,youtube';
config.enterMode = CKEDITOR.ENTER_BR;
config.shiftEnterMode = CKEDITOR.ENTER_BR;

config.smiley_columns = 10; //Столбики со смайлами
config.scayt_uiTabs = '1,0,1';
config.toolbarStartupExpanded = false; //Прятать панель инстр. (по дефолту true)
config.resize_enabled = false;
config.allowedContent = true;
//config.resize_minWidth = 900;
//config.resize_minHeight = 900;
//config.resize_dir = 'vertical'; //Изменять размер редактора только по высоте
//config.height = '360px'; //Высота редактора
};
