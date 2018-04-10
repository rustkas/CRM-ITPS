<?php
namespace Site\AdminBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Systems\SysFunctions;


class AdminsController extends Controller
{
    public function loginAction(Request $request)
    {
        if($request->isXMLHttpRequest())
        {
            $response = new JsonResponse();
            return $response->setData(array("cause" => 'exit'));
        } else {
            $session = $request->getSession();
            $authenticationCheck = $this->get('security.authorization_checker');
            if (!$authenticationCheck->isGranted('IS_AUTHENTICATED_FULLY')) {
                $session->set('panel_data', array());
                $authenticationUtils = $this->get('security.authentication_utils');
                $lastUsername = $authenticationUtils->getLastUsername();
                if ($authenticationUtils->getLastAuthenticationError()) {
                    $error = 'Ошибка, Не правильный логин или пароль "' . $lastUsername . '"';
                } else {
                    $error = '';
                }

                return $this->render('AdminBundle:security:login.html.twig', array(
                    'last_username' => $lastUsername,
                    'error' => $error,
                ));

            } else {
                return $this->redirect($this->generateUrl('panel_homepage'), 301);
            }
        }
    }

	/**
	 * @param Request $request
	 * @return \Symfony\Component\HttpFoundation\RedirectResponse|Response
     */
	public function adminsAction(Request $request)
    {
        $session = $request->getSession();
        $authenticationCheck = $this->get('security.authorization_checker');

        if($authenticationCheck->isGranted('ROLE_SUPER_ADMIN') || $authenticationCheck->isGranted('ROLE_ADMIN') || $authenticationCheck->isGranted('ROLE_USER'))
        {
            $conbd = $this->container->getParameter('connbd');
            $sysfn = new SysFunctions();
            $stores = $session->get('panel_data', array());
            $user = $this->get('security.token_storage')->getToken()->getUser();

            if(!$sysfn->getActives($stores[0], $request->getClientIp(), $conbd, $user->getId()))
            {
                $session->set('panel_data', array());
                if($request->isMethod('GET'))
                {
                    return $this->redirect($this->generateUrl('logout'), 301);
                } else {
                    $response = new JsonResponse();
                    return $response->setData(array("cause" => 'exit'));
                }
            }

            $userinfo = $sysfn->ShowUserInfo($user->getId(),$conbd,1);
            if($request->isMethod('GET'))
            {
                return $this->render('AdminBundle:security:index.html.twig', array(
                    "menutop" => $sysfn->getTopmenu($user->getId(), $user->getRole(), $this->generateUrl('panel_homepage'),$conbd),
                    'usinfo' => $userinfo,
                    "admfrm" => "",
                    "stpage" => $this->generateUrl('panel_homepage'),
                    "listadm" => $user,
                    "statblk" => "main",
                ));
            }
            if ($request->isMethod('POST') && $request->isXMLHttpRequest()) {
                $datasets = array("cause" => 'nomethods');
                $datain = json_decode($request->getContent());
                if(!empty($datain)) {
                    if($datain->cause == "select"){
                        $datasets = array(
                            "cause" => $datain->cause,
                            "mod" => '',
                            "page" => 'index',
                            "subpg" => 'main',
                            "flv" => 0,
                            "groups" => '',
                            );
                    } else {
                        if ($datain->cause == "refresh") {
                            $datasets = $sysfn->getListModIndexPage($datain,$user->getId(),$conbd,0,$this->generateUrl('panel_homepage'));
                        }
                    }

                    $response = new JsonResponse();
                    $response->setCharset('utf-8');
                    $response->setEncodingOptions(JSON_UNESCAPED_UNICODE);
                    $response->setData($datasets);
                    return $response;
                } else {
                    $response = new JsonResponse();
                    return $response->setData($datasets);
                }
            }
            return $this->redirect($this->generateUrl('panel_homepage'), 301);
        }
        return $this->redirect($this->generateUrl('logout'), 301);
    }

    public function proffAction(Request $request)
    {
        $session = $request->getSession();
        $authenticationCheck = $this->get('security.authorization_checker');

        if($authenticationCheck->isGranted('ROLE_SUPER_ADMIN') || $authenticationCheck->isGranted('ROLE_ADMIN') || $authenticationCheck->isGranted('ROLE_USER'))
        {
            $conbd = $this->container->getParameter('connbd');
            $sysfn = new SysFunctions();
            $stores = $session->get('panel_data', array());
            $user = $this->get('security.token_storage')->getToken()->getUser();

            if(!$sysfn->getActives($stores[0], $request->getClientIp(), $conbd, $user->getId()))
            {
                $session->set('panel_data', array());
                if($request->isMethod('GET'))
                {
                    return $this->redirect($this->generateUrl('logout'), 301);
                } else {
                    $response = new JsonResponse();
                    return $response->setData(array("cause" => 'exit'));
                }
            }
            //print_r($this->container->getParameter('connbd'));

            $userinfo = $sysfn->ShowUserInfo($user->getId(),$conbd,2);
            if($request->isMethod('GET'))
            {
                return $this->render('AdminBundle:security:proff.html.twig', array(
                    "menutop" => $sysfn->getTopmenu($user->getId(), $user->getRole(), $this->generateUrl('panel_homepage'),$conbd),
                    'usinfo' => $userinfo,
                    "admfrm" => "",
                    "stpage" => $this->generateUrl('panel_homepage'),
                    "listadm" => $user,
                    "statblk" => "proff",
                ));
            }
            if ($request->isMethod('POST') && $request->isXMLHttpRequest()) {
                $datasets = array("cause" => 'nomethods');
                $datain = json_decode($request->getContent());
                if(!empty($datain)) {

                    $response = new JsonResponse();
                    $response->setCharset('utf-8');
                    $response->setEncodingOptions(JSON_UNESCAPED_UNICODE);
                    $response->setData($datasets);
                    return $response;
                } else {
                    $response = new JsonResponse();
                    return $response->setData($datasets);
                }
            }
            return $this->redirect($this->generateUrl('panel_homepage'), 301);
        }
        return $this->redirect($this->generateUrl('logout'), 301);
    }

    public function pagesAction(Request $request, $page)
    {
        $session = $request->getSession();
        $authenticationCheck = $this->get('security.authorization_checker');

        if($authenticationCheck->isGranted('ROLE_SUPER_ADMIN') || $authenticationCheck->isGranted('ROLE_ADMIN') || $authenticationCheck->isGranted('ROLE_USER')) {
            $conbd = $this->container->getParameter('connbd');
            $sysfn = new SysFunctions();
            $stores = $session->get('panel_data', array());
            $user = $this->get('security.token_storage')->getToken()->getUser();

            if (!$sysfn->getActives($stores[0], $request->getClientIp(), $conbd, $user->getId())) {
                $session->set('panel_data', array());
                if ($request->isMethod('GET')) {
                    return $this->redirect($this->generateUrl('logout'), 301);
                } else {
                    $response = new JsonResponse();
                    return $response->setData(array("cause" => 'exit'));
                }
            }

            if(!$sysfn->TryFirstPG($user->getId(), $user->getRole(), $page, $conbd)){
                if ($request->isMethod('GET')) {
                    return $this->redirect($this->generateUrl('panel_homepage'), 301);
                } else {
                    $response = new JsonResponse();
                    return $response->setData(array("cause" => 'firstpg'));
                }
            }

            $acclv = $sysfn->getFirstPerm($user->getId(), $user->getRole(), $page, $conbd);
            $userinfo = $sysfn->ShowUserInfo($user->getId(),$conbd, $acclv);
            if ($request->isMethod('GET')) {

                return $this->render('AdminBundle:security:pages.html.twig', array(
                    "page" => $request->getBaseUrl() . $request->getPathInfo(),
                    "usinfo" => $userinfo,
                    "stpage" => $this->generateUrl('panel_homepage'),
                    "menutop" => $sysfn->getTopmenu($user->getId(), $user->getRole(), $this->generateUrl('panel_homepage'),$conbd),
                    "statblk" => $page,
                    "lmenu" => $sysfn->getSysSubmenu($page),
                ));
            }

            if ($request->isMethod('POST') && $request->isXMLHttpRequest()) {
                $datasets = array("cause" => 'nomethods');
                $datain = json_decode($request->getContent());
                if(!empty($datain)) {
                    if(isset($datain->module) &&  isset($datain->page) && $datain->page == $page) {

                        if($datain->cause == "select"){
                            $datasets = $sysfn->getFPgContent($user->getId(), $page, $conbd, $this->generateUrl('panel_homepage'), $datain->cause, $datain->subpg);
                        } else {
                            if($datain->cause == "refresh") {
                                if ($datain->subpg != "") {
                                    if($acclv>0) {
                                        $datasets = $sysfn->getFContentRefresh($conbd, $datain, $acclv);
                                    } else {
                                        $datasets = array("cause" => 'denyperm',"location" => $this->generateUrl('panel_homepage'));
                                    }
                                } else {
                                    $datasets = array("cause" => 'firstpg');
                                }
                            } else if($datain->cause == "listacc") {
                                $datasets = $sysfn->showAccGrpDetails($datain,$conbd,$acclv);
                            } else if($datain->cause == "listpermobj") {
                                $datasets = $sysfn->showAccGrpDetails($datain,$conbd,$acclv);
                            } else if($datain->cause == "delacc") {
                                $datasets = $sysfn->delUserGroup($datain,$conbd,$acclv);
                            } else if($datain->cause == "listgrp") {
                                $datasets = $sysfn->showAccGrpDetails($datain,$conbd,$acclv);
                            } else if($datain->cause == "listpermgrp") {
                                $datasets = $sysfn->showAccGrpDetails($datain,$conbd,$acclv);
                            } else if($datain->cause == "updpermits") {
                                $datasets = $sysfn->setUpdatePermits($datain,$conbd,$acclv);
                            } else if($datain->cause == "delgrp") {
                                $datasets = $sysfn->delUserGroup($datain,$conbd,$acclv);
                            } else if($datain->cause == "finduser") {
                                $datasets = $sysfn->getFindUser($datain,$conbd,$acclv);
                            } else if($datain->cause == "updnewusergroup") {
                                $datasets = $sysfn->updUsersGroups($datain,$conbd,$acclv);
                            } else if($datain->cause == "listconfmod") {
                                $datasets = $sysfn->showModCurrConfNode($datain,$conbd,$acclv);
                            } else if($datain->cause == "delconfval") {
                                $datasets = $sysfn->setDeleteConfMods($datain,$conbd,$acclv);
                            } else if($datain->cause == "updconfval") {
                                $datasets = $sysfn->setConfModPG($datain,$conbd,$acclv);
                            } else if($datain->cause == "usedmod") {
                                $datasets = $sysfn->getListModInstalls($datain,$conbd,$acclv);
                            } else if($datain->cause == "unusedmod") {
                                $datasets = $sysfn->getListModUnInstalls($datain,$conbd,$acclv);
                            } else if($datain->cause == "enablemods") {
                                $datasets = $sysfn->setDisEnblModule($datain,$conbd,$acclv);
                            } else if($datain->cause == "deinstallmods") {
                                $datasets = $sysfn->DeinstallModule($datain,$conbd,$acclv);
                            } else if($datain->cause == "installmods") {
                                $datasets = $sysfn->InstallModule($datain,$conbd,$acclv);
                            } else {
                                $datasets = array("cause" => 'firstpg');
                            }
                        }
                    } else if(isset($datain->refresh)){
                        if($datain->refresh == "modselect"){
                            $datasets = array("refresh" => 'modselect', "sels" => $sysfn->getListModSelect($conbd,$acclv));
                        } else {
                            $datasets = array("ncause" => 'firstpg');
                        }
                    }

                    $response = new JsonResponse();
                    $response->setCharset('utf-8');
                    $response->setEncodingOptions(JSON_UNESCAPED_UNICODE);
                    $response->setData($datasets);
                    return $response;
                } else {
                    $response = new JsonResponse();
                    return $response->setData($datasets);
                }
            }
            return $this->redirect($this->generateUrl('panel_homepage'), 301);
        }
        return $this->redirect($this->generateUrl('logout'), 301);
    }

    public function modulsAction(Request $request, $mods)
    {
        $session = $request->getSession();
        $authenticationCheck = $this->get('security.authorization_checker');

        if($authenticationCheck->isGranted('ROLE_SUPER_ADMIN') || $authenticationCheck->isGranted('ROLE_ADMIN') || $authenticationCheck->isGranted('ROLE_USER')) {
            $conbd = $this->container->getParameter('connbd');
            $sysfn = new SysFunctions();
            $stores = $session->get('panel_data', array());
            $user = $this->get('security.token_storage')->getToken()->getUser();

            if (!$sysfn->getActives($stores[0], $request->getClientIp(), $conbd, $user->getId())) {
                $session->set('panel_data', array());
                if ($request->isMethod('GET')) {
                    return $this->redirect($this->generateUrl('logout'), 301);
                } else {
                    $response = new JsonResponse();
                    return $response->setData(array("cause" => 'exit'));
                }
            }
            if(!$sysfn->TryModPg($user->getId(), $user->getRole(), $mods, $conbd)){
                if ($request->isMethod('GET')) {
                    return $this->redirect($this->generateUrl('panel_homepage'), 301);
                } else {
                    $response = new JsonResponse();
                    return $response->setData(array("cause" => 'firstpg'));
                }
            }
            $userinfo = $sysfn->ShowUserInfo($user->getId(),$conbd,1);
            if ($request->isMethod('GET')) {
                $csslink = "/modules/".$mods."/css/mstyle.css";
                $jslink = "/modules/".$mods."/js/mscript.js";

                return $this->render('AdminBundle:security:modules.html.twig', array(
                    "cssres" => $csslink,
                    "jsres" => $jslink,
                    "usinfo" => $userinfo,
                    "page" => $request->getBaseUrl() . $request->getPathInfo(),
                    "stpage" => $this->generateUrl('panel_homepage'),
                    "menutop" => $sysfn->getTopmenu($user->getId(), $user->getRole(), $this->generateUrl('panel_homepage'),$conbd),
                    "statblk" => $mods,
                ));
            }

            if ($request->isMethod('POST') && $request->isXMLHttpRequest()) {
                $datasets = array("cause" => 'nomethods');
                $datain = json_decode($request->getContent());
                if(!empty($datain)) {
                    if(isset($datain->module) &&  isset($datain->page) && $datain->module == $mods) {
                        $objmod = $sysfn->getModuleObject($user->getId(), $mods, $conbd);
                        $datasets = $objmod->ModuleFunction($datain,$this->generateUrl('panel_homepage'));
                        //$datasets = array("modcause" => "error", "errors" => var_dump($objmod));
                    }
                    $response = new JsonResponse();
                    $response->setCharset('utf-8');
                    $response->setEncodingOptions(JSON_UNESCAPED_UNICODE);
                    $response->setData($datasets);
                    return $response;
                } else {
                    $response = new JsonResponse();
                    return $response->setData($datasets);
                }
            }
            return $this->redirect($this->generateUrl('panel_homepage'), 301);
        }
        return $this->redirect($this->generateUrl('logout'), 301);
    }
}