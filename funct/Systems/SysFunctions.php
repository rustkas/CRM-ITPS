<?php
/**
 * Created by PhpStorm.
 * User: zevs5
 * Date: 05.11.2016
 * Time: 1:00
 */

namespace Systems;
use Systems\MyQueries;
use Systems\SysObjs;


class SysFunctions
{
    private $llen = 6;

    private $plen = 8;

    private $log;

    public function __construct()
    {
        $this->log = new ModLogger('sysfuncts','systems');
    }

    /**
     * @param $usid
     * @param $modid
     * @param $pgid
     * @param $objparam
     * @param $connpr
     * @param null $link
     * @return bool
     */
    private function setPermUser($usid, $modid, $pgid, $objparam, $connpr, $link = null)
    {
        $ret = false;
        if(!empty($objparam)) {
            if (!is_null($link)) {
                $bdqr = $link;
            } else {
                $bdqr = new MyQueries($connpr);
            }

            $sql = "insert into " . $connpr[1] . ".accessus (" . $connpr[1] . ".accessus.modid," . $connpr[1] . ".accessus.usid," . $connpr[1] . ".accessus.modpg," . $connpr[1] . ".accessus.list," . $connpr[1] . ".accessus.ins," . $connpr[1] . ".accessus.upd," . $connpr[1] . ".accessus.del," . $connpr[1] . ".accessus.extra," . $connpr[1] . ".accessus.accsext) values (" . $modid . "," . $usid . "," . $pgid . "," . $objparam->list . "," . $objparam->ins . "," . $objparam->upd . "," . $objparam->del . "," . $objparam->extra . "," . $objparam->accsext . ")";
            $bdqr->setQuery($sql);
            $ret = true;
        }

        return $ret;
    }

    /**
     * @param $usid
     * @param $modid
     * @param $pgid
     * @param $objparam
     * @param $connpr
     * @param null $link
     * @return bool
     */
    private function updPermUser($usid, $modid, $pgid, $objparam, $connpr, $link = null)
    {
        $ret = false;
        if(!empty($objparam)) {
            if (!is_null($link)) {
                $bdqr = $link;
            } else {
                $bdqr = new MyQueries($connpr);
            }
            $updsql = "";
            $sql = "select * from " . $connpr[1] . ".accessus where " . $connpr[1] . ".accessus.modid=" . $modid . " and " . $connpr[1] . ".accessus.usid=" . $usid . " and " . $connpr[1] . ".accessus.modpg=" . $pgid . " limit 1";
            $accsm = $bdqr->getSingleResult($sql);
            if (!is_null($accsm) && !empty($accsm)) {
                $upd = array();
                foreach ($objparam as $key => $val){
                    if($accsm[$key] != $val){
                        $upd[] = $connpr[1] . ".accessus.".$key."='".$bdqr->EscapedStr($val)."'";
                    }
                }
                if(count($upd)>0){
                    foreach($upd as $ins){
                        $updsql .= $ins.",";
                    }

                    if(trim($updsql) != ""){
                        $sqlup = "update " . $connpr[1] . ".accessus set ".trim($updsql,",")." where " . $connpr[1] . ".accessus.modid=" . $modid . " and " . $connpr[1] . ".accessus.usid=" . $usid . " and " . $connpr[1] . ".accessus.modpg=" . $pgid. "";
                        $bdqr->setQuery($sqlup);
                        $ret = true;
                    }
                } else {
                    $ret = true;
                }


            } else {
                $ret = $this->setPermUser($usid, $modid, $pgid, $objparam, $connpr, $bdqr);
            }
        }

        return $ret;
    }

    /**
     * @param $grpid
     * @param $modid
     * @param $pgid
     * @param $objparam
     * @param $connpr
     * @param null $link
     * @return bool
     */
    private function setPermGroup($grpid, $modid, $pgid, $objparam, $connpr, $link = null)
    {
        $ret = false;
        if(!empty($objparam)) {
            if (!is_null($link)) {
                $bdqr = $link;
            } else {
                $bdqr = new MyQueries($connpr);
            }
            $sql = "insert into " . $connpr[1] . ".accessgrp (" . $connpr[1] . ".accessgrp.modid," . $connpr[1] . ".accessgrp.grpid," . $connpr[1] . ".accessgrp.modpg," . $connpr[1] . ".accessgrp.list," . $connpr[1] . ".accessgrp.ins," . $connpr[1] . ".accessgrp.upd," . $connpr[1] . ".accessgrp.del," . $connpr[1] . ".accessgrp.extra," . $connpr[1] . ".accessgrp.accsext) values (" . $modid . "," . $grpid . "," . $pgid . "," . $objparam->list . "," . $objparam->ins . "," . $objparam->upd . "," . $objparam->del . "," . $objparam->extra . "," . $objparam->accsext . ")";
            $bdqr->setQuery($sql);
            $ret = true;
        }

        return $ret;
    }

    /**
     * @param $grpid
     * @param $modid
     * @param $pgid
     * @param $objparam
     * @param $connpr
     * @param null $link
     * @return bool
     */
    private function updPermGroup($grpid, $modid, $pgid, $objparam, $connpr, $link = null)
    {
        $ret = false;
        if(!empty($objparam)) {
            if (!is_null($link)) {
                $bdqr = $link;
            } else {
                $bdqr = new MyQueries($connpr);
            }
            $updsql = "";
            $sql = "select * from " . $connpr[1] . ".accessgrp where " . $connpr[1] . ".accessgrp.modid=" . $modid . " and " . $connpr[1] . ".accessgrp.grpid=" . $grpid . " and " . $connpr[1] . ".accessgrp.modpg=" . $pgid . " limit 1";
            $accsm = $bdqr->getSingleResult($sql);
            if (!is_null($accsm) && !empty($accsm)) {
                $upd = array();
                foreach ($objparam as $key => $val){
                    if($accsm[$key] != $val){
                        $upd[] = $connpr[1] . ".accessgrp.".$key."='".$bdqr->EscapedStr($val)."'";
                    }
                }
                if(count($upd)>0){
                    foreach($upd as $ins){
                        $updsql .= $ins.",";
                    }

                    if(trim($updsql) != ""){
                        $sqlup = "update " . $connpr[1] . ".accessgrp set ".trim($updsql,",")." where " . $connpr[1] . ".accessgrp.modid=" . $modid . " and " . $connpr[1] . ".accessgrp.grpid=" . $grpid . " and " . $connpr[1] . ".accessgrp.modpg=" . $pgid. "";
                        $bdqr->setQuery($sqlup);
                    }
                }
                $ret = true;

            } else {
                $ret = $this->setPermGroup($grpid, $modid, $pgid, $objparam, $connpr, $bdqr);
            }
        }

        return $ret;
    }

    /**
     * @param $usid
     * @param $objparam
     * @param $connpr
     * @param null $link
     * @return bool
     */
    private function setSysPerms($usid, $objparam, $connpr, $link = null)
    {
        $ret = false;
        if(!empty($objparam)) {
            if (!is_null($link)) {
                $bdqr = $link;
            } else {
                $bdqr = new MyQueries($connpr);
            }
            $sql = "insert into " . $connpr[1] . ".accesses (" . $connpr[1] . ".accesses.iduser," . $connpr[1] . ".accesses.users," . $connpr[1] . ".accesses.admmod) values (" . $usid . "," . $objparam->users . "," . $objparam->admmod . ")";
            $bdqr->setQuery($sql);
            $ret = true;
        }

        return $ret;
    }

    /**
     * @param $usid
     * @param $objparam
     * @param $connpr
     * @param null $link
     * @return bool
     */
    private function updSysPerms($usid, $objparam, $connpr, $link = null)
    {
        $ret = false;
        if(!empty($objparam)) {
            if (!is_null($link)) {
                $bdqr = $link;
            } else {
                $bdqr = new MyQueries($connpr);
            }
            $updsql = "";
            $sql = "select * from " . $connpr[1] . ".accesses where " . $connpr[1] . ".accesses.iduser=" . $usid . " limit 1";
            $accsm = $bdqr->getSingleResult($sql);
            if (!is_null($accsm) && !empty($accsm)) {
                $upd = array();
                foreach ($objparam as $key => $val){
                    if($accsm[$key] != $val){
                        $upd[] = $connpr[1] . ".accesses.".$key."='".$bdqr->EscapedStr($val)."'";
                    }
                }
                if(count($upd)>0){
                    foreach($upd as $ins){
                        $updsql .= $ins.",";
                    }

                    if(trim($updsql) != ""){
                        $sqlup = "update " . $connpr[1] . ".accesses set ".trim($updsql,",")." where " . $connpr[1] . ".accesses.iduser=" . $usid . "";
                        $bdqr->setQuery($sqlup);
                    }
                }
                $ret = true;
            } else {
                $ret = $this->setSysPerms($usid, $objparam, $connpr, $bdqr);
            }
        }

        return $ret;
    }

    /**
     * @param $objparam
     * @param $connpr
     * @param null $link
     * @return bool
     */
    private function setAddUpdUserGroup($objparam, $connpr, $link = null)
    {
        $ret = false;
        if(!empty($objparam)) {
            if (!is_null($link)) {
                $bdqr = $link;
            } else {
                $bdqr = new MyQueries($connpr);
            }
            if($objparam->formid == "userfrm"){
                if($objparam->objs->dstv == 0){
                    $sql = "select * from " . $connpr[1] . ".users where " . $connpr[1] . ".users.userr like '%" . $objparam->objs->user . "%' order by " . $connpr[1] . ".users.userr asc";
                    $accsm = $bdqr->getResult($sql);
                    if (is_null($accsm) || empty($accsm)) {
                        $ins = "insert into " . $connpr[1] . ".users (" . $connpr[1] . ".users.userr," . $connpr[1] . ".users.passwd," . $connpr[1] . ".users.descr," . $connpr[1] . ".users.activ," . $connpr[1] . ".users.groups) values ('".$bdqr->EscapedStr($objparam->objs->user)."','".$this->setEcodePasswd($objparam->objs->passwd)."','".$bdqr->EscapedStr($objparam->objs->descr)."',".$objparam->objs->actv.",".$objparam->objs->group.")";
                        $bdqr->setQuery($ins);
                        $ret = true;
                    }
                } else {
                    $updsql = "";
                    $sendobj = array(
                        "passwd" => $objparam->objs->passwd,
                        "descr" => $objparam->objs->descr,
                        "activ" => $objparam->objs->actv,
                        "groups" => $objparam->objs->group,
                    );
                    $sql = "select * from " . $connpr[1] . ".users where " . $connpr[1] . ".users.id=" . $objparam->objs->dstv . " limit 1";
                    $accsm = $bdqr->getSingleResult($sql);
                    if (!is_null($accsm) && !empty($accsm)) {
                        $upd = array();
                        foreach ($sendobj as $key => $val){
                            if($key == "passwd"){
                                if (trim($objparam->objs->passwd) != "" && $accsm[$key] != $this->setEcodePasswd($val)) {
                                    $upd[] = $connpr[1] . ".users." . $key . "='" . $this->setEcodePasswd($val) . "'";
                                }
                            } else {
                                if ($key != "passwd" && $accsm[$key] != $val) {
                                    $upd[] = $connpr[1] . ".users." . $key . "='" . $bdqr->EscapedStr($val) . "'";
                                }
                            }
                        }
                        if(count($upd)>0) {
                            foreach ($upd as $ins) {
                                $updsql .= $ins . ",";
                            }

                            if (trim($updsql) != "") {
                                $sqlup = "update " . $connpr[1] . ".users set ".trim($updsql,",")." where " . $connpr[1] . ".users.id=" . $objparam->objs->dstv . "";
                                $bdqr->setQuery($sqlup);
                            }
                        }
                        $ret = true;
                    }
                }
            }
            if($objparam->formid == "proffrm"){
                $sql = "select * from " . $connpr[1] . ".profiles where " . $connpr[1] . ".profiles.id=" . $objparam->objs->idprof . " limit 1";
                $accsm = $bdqr->getSingleResult($sql);
                if (!is_null($accsm) && !empty($accsm)) {
                    $updsql = "";
                    $sendobj = array(
                        "phone" => $objparam->objs->phone,
                        "info" => $objparam->objs->inform,
                        "email" => $objparam->objs->mails,
                    );
                    $upd = array();
                    foreach ($sendobj as $key => $val){
                        if ($accsm[$key] != $val) {
                            $upd[] = $connpr[1] . ".profiles." . $key . "='" . $bdqr->EscapedStr($val) . "'";
                        }
                    }

                    if(count($upd)>0) {
                        foreach ($upd as $ins) {
                            $updsql .= $ins . ",";
                        }

                        if (trim($updsql) != "") {
                            $sqlup = "update " . $connpr[1] . ".profiles set ".trim($updsql,",")." where " . $connpr[1] . ".profiles.id=" . $objparam->objs->idprof . "";
                            $bdqr->setQuery($sqlup);
                            //Logger::getLogger('debug')->log($sqlup);
                            $ret = true;
                        }
                    }
                    //Logger::getLogger('debug')->log($sql);
                    //Logger::getLogger('debug')->log($updsql);
                } else {
                    $ins = "insert into " . $connpr[1] . ".profiles (usid,phone,info,email) values (".$objparam->objs->infdstv.",'".$bdqr->EscapedStr($objparam->objs->phone)."',".$bdqr->EscapedStr($objparam->objs->inform).",".$bdqr->EscapedStr($objparam->objs->mails).")";
                    $bdqr->setQuery($ins);
                    $ret = true;
                }
            }
            if($objparam->formid == "groupfrm"){
                if($objparam->objs->gdstv == 0){
                    $sql = "select * from " . $connpr[1] . ".group where " . $connpr[1] . ".group.gname like '%" . $objparam->objs->groups . "%' order by " . $connpr[1] . ".group.gname asc";
                    $accsm = $bdqr->getResult($sql);
                    if (is_null($accsm) || empty($accsm)) {
                        $ins = "insert into " . $connpr[1] . ".group (" . $connpr[1] . ".group.gname) values ('".$bdqr->EscapedStr($objparam->objs->groups)."')";
                        $bdqr->setQuery($ins);
                        $ret = true;
                    }
                } else {
                    $sql = "select * from " . $connpr[1] . ".group where " . $connpr[1] . ".group.id=" . $objparam->objs->gdstv . " limit 1";
                    $accsm = $bdqr->getSingleResult($sql);
                    if (!is_null($accsm) && !empty($accsm)) {
                        if($accsm["gname"] != $objparam->objs->groups) {
                            $sqlup = "update " . $connpr[1] . ".group set " . $connpr[1] . ".group.gname='".$bdqr->EscapedStr($objparam->objs->groups)."' where " . $connpr[1] . ".group.id=" . $objparam->objs->gdstv . "";
                            $bdqr->setQuery($sqlup);
                        }
                        $ret = true;
                    }
                }
            }
        }

        return $ret;
    }

    /**
     * @param $passwd
     * @return string
     */
    private function setEcodePasswd($passwd)
    {
        $sha_stage1 = sha1($passwd,true);
        $output = sha1($sha_stage1,false);
        return "*".strtoupper($output);
    }

    /**
     * @param $itemid
     * @param $connpr
     * @param null $link
     * @return bool
     */
    private function setDeleteAccount($itemid, $connpr, $link = null)
    {
        $ret = false;
        if((int)$itemid > 0){
            if (!is_null($link)) {
                $bdqr = $link;
            } else {
                $bdqr = new MyQueries($connpr);
            }
            /** @var TYPE_NAME $bdqr */
            $role = $bdqr->getCurrRole($connpr[1], $itemid);
            if($role != "ROLE_SUPER_ADMIN"){
                $del = "delete from ".$connpr[1].".accesses where ".$connpr[1].".accesses.iduser=".$itemid." order by ".$connpr[1].".accesses.iduser asc";
                $bdqr->setQuery($del);

                $del = "delete from ".$connpr[1].".accessus where ".$connpr[1].".accessus.usid=".$itemid." order by ".$connpr[1].".accessus.usid asc";
                $bdqr->setQuery($del);

                $del = "delete from ".$connpr[1].".profiles where ".$connpr[1].".profiles.usid=".$itemid." order by ".$connpr[1].".profiles.usid asc";
                $bdqr->setQuery($del);

                $del = "delete from ".$connpr[1].".users where ".$connpr[1].".users.id=".$itemid." order by ".$connpr[1].".users.id asc";
                $bdqr->setQuery($del);

                $ret = true;
            }
        }
        return $ret;
    }

    /**
     * @param $itemid
     * @param $connpr
     * @param null $link
     * @return bool
     */
    private function setDeleteGroup($itemid, $connpr, $link = null)
    {
        $ret = false;
        if((int)$itemid > 1){
            if (!is_null($link)) {
                $bdqr = $link;
            } else {
                $bdqr = new MyQueries($connpr);
            }
            $upd = "update ".$connpr[1].".users set ".$connpr[1].".users.groups=1 where ".$connpr[1].".users.groups=".$itemid."  order by ".$connpr[1].".users.id asc";
            $bdqr->setQuery($upd);
            $del = "delete from ".$connpr[1].".accessgrp where ".$connpr[1].".accessgrp.grpid=".$itemid." order by ".$connpr[1].".accessgrp.id asc";
            $bdqr->setQuery($del);

            $del = "delete from ".$connpr[1].".group where ".$connpr[1].".group.id=".$itemid." order by ".$connpr[1].".group.id asc";
            $bdqr->setQuery($del);

            $ret = true;
        }
        return $ret;
    }

    /**
     * @param $objparam
     * @param $connpr
     * @param null $link
     * @return bool
     */
    private function setAddUpdConfMod($objparam, $connpr, $link = null)
    {
        $ret = false;
        if(!empty($objparam)) {
            if (!is_null($link)) {
                $bdqr = $link;
            } else {
                $bdqr = new MyQueries($connpr);
            }
            if($objparam->objs->mpgid == 0){
                $sql = "select * from " . $connpr[1] . ".configtbl where " . $connpr[1] . ".configtbl.keys like '%" . $objparam->objs->keys . "%' and " . $connpr[1] . ".configtbl.idmod=".$objparam->modid." order by " . $connpr[1] . ".configtbl.idmod asc";
                $accsm = $bdqr->getResult($sql);
                if (is_null($accsm) || empty($accsm)) {
                    $ins = "insert into " . $connpr[1] . ".configtbl (" . $connpr[1] . ".configtbl.idmod," . $connpr[1] . ".configtbl.keys," . $connpr[1] . ".configtbl.values) values (".$objparam->modid.",'".$bdqr->EscapedStr($objparam->objs->keys)."','".$bdqr->EscapedStr($objparam->objs->names)."')";
                    $bdqr->setQuery($ins);
                    $ret = true;
                }
            } else {
                $sql = "select * from " . $connpr[1] . ".configtbl where " . $connpr[1] . ".configtbl.idmod=" . $objparam->modid . " and " . $connpr[1] . ".configtbl.keys='" . $objparam->objs->keys . "' limit 1";
                $accsm = $bdqr->getSingleResult($sql);
                if (!is_null($accsm) && !empty($accsm)) {
                    if($accsm['values'] != $objparam->objs->names){
                        $sqlup = "update " . $connpr[1] . ".configtbl set " . $connpr[1] . ".configtbl.values='".$bdqr->EscapedStr($objparam->objs->names)."' where " . $connpr[1] . ".configtbl.idmod=" . $objparam->modid . " and " . $connpr[1] . ".configtbl.keys='" . $objparam->objs->keys . "'";
                        $bdqr->setQuery($sqlup);
                    }
                    $ret = true;
                }
            }

        }

        return $ret;
    }

    /**
     * @param $itemid
     * @param $connpr
     * @param null $link
     * @return bool
     */
    private function setDeleteKeyMod($itemid, $connpr, $link = null)
    {
        $ret = false;
        if((int)$itemid > 1){
            if (!is_null($link)) {
                $bdqr = $link;
            } else {
                $bdqr = new MyQueries($connpr);
            }
            $del = "delete from ".$connpr[1].".configtbl where ".$connpr[1].".configtbl.id=".$itemid."";
            $bdqr->setQuery($del);

            $ret = true;
        }
        return $ret;
    }

    /**
     * @param $itemid
     * @param $connpr
     * @param null $link
     * @return bool
     */
    private function setDeinstallModule($itemid, $connpr, $link = null)
    {
        if((int)$itemid > 1){
            if (!is_null($link)) {
                $bdqr = $link;
            } else {
                $bdqr = new MyQueries($connpr);
            }

            $del = "delete from ".$connpr[1].".accessgrp where ".$connpr[1].".accessgrp.modid=".$itemid."";
            $bdqr->setQuery($del);

            $del = "delete from ".$connpr[1].".accessus where ".$connpr[1].".accessus.modid=".$itemid."";
            $bdqr->setQuery($del);

            $del = "delete from ".$connpr[1].".configtbl where ".$connpr[1].".configtbl.idmod=".$itemid."";
            $bdqr->setQuery($del);

            $del = "delete from ".$connpr[1].".menumod where ".$connpr[1].".menumod.modid=".$itemid."";
            $bdqr->setQuery($del);

            $del = "delete from ".$connpr[1].".modules where ".$connpr[1].".modules.id=".$itemid."";
            $bdqr->setQuery($del);

            return true;
        }
        return false;
    }

    /**
     * @param $bundlename
     * @param $connpr
     * @param null $link
     * @return bool
     */
    private function setInstallModule($bundlename, $connpr, $link = null)
    {
        if(trim($bundlename) != ""){
            $infoarr = array();
            $instarr = array();
            $loadsm = "Moduls\\".$bundlename."";
            $instarr = $loadsm::installmod();
            $infoarr = $loadsm::infomod();
            if(!is_null($instarr) && !empty($instarr) && !is_null($infoarr) && !empty($infoarr)){
                if (!is_null($link)) {
                    $bdqr = $link;
                } else {
                    $bdqr = new MyQueries($connpr);
                }
                $sql = "select * from ".$connpr[1].".modules where ".$connpr[1].".modules.names='".$infoarr['names']."' limit 1";
                $accsm = $bdqr->getSingleResult($sql);
                if(!is_null($accsm) && !empty($accsm)){
                    return false;
                } else {
                    $ins = "insert into ".$connpr[1].".modules (".$connpr[1].".modules.names,".$connpr[1].".modules.displays,".$connpr[1].".modules.enables,".$connpr[1].".modules.bundle,".$connpr[1].".modules.namespase) values ('".$bdqr->EscapedStr($infoarr['names'])."','".$bdqr->EscapedStr($infoarr['displays'])."',0,'".$bdqr->EscapedStr($infoarr['bundle'])."','".$bdqr->EscapedStr($infoarr['namespase'])."')";
                    $bdqr->setQuery($ins);
                    $sql = "select ".$connpr[1].".modules.id from ".$connpr[1].".modules where ".$connpr[1].".modules.names='".$infoarr['names']."' limit 1";
                    $accsm = $bdqr->getSingleResult($sql);
                    if(!is_null($accsm) && !empty($accsm)) {
                        $modid = $accsm['id'];

                        foreach ($instarr['pages'] as $pkey => $pval){
                            $ins = "insert into ".$connpr[1].".menumod (".$connpr[1].".menumod.modid,".$connpr[1].".menumod.mkey,".$connpr[1].".menumod.mval) values (".$modid.",'".$bdqr->EscapedStr($pkey)."','".$bdqr->EscapedStr($pval)."')";
                            $bdqr->setQuery($ins);
                        }

                        foreach ($instarr['conf'] as $ckey => $cval){
                            $ins = "insert into ".$connpr[1].".configtbl (".$connpr[1].".configtbl.idmod,".$connpr[1].".configtbl.keys,".$connpr[1].".configtbl.values) values (".$modid.",'".$bdqr->EscapedStr($ckey)."','".$bdqr->EscapedStr($cval)."')";
                            $bdqr->setQuery($ins);
                        }
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * @param $store
     * @param $clip
     * @param $conns
     * @param $usid
     * @return bool
     */
    public function getActives($store, $clip, $conns, $usid)
    {
        if(!empty($store) && isset($store['starttime']) && isset($store['userip']) && isset($store['expires']))
        {
            $ctm = (int)time();
            if(((int)$store['starttime'] + (int)$store['expires']) < $ctm || $store['userip'] != $clip)
            {
                return false;
            } else {
                if(!empty($conns)) {
                    $bdqr = new MyQueries($conns);
                    $sql = "select " . $conns[1] . ".users.activ from " . $conns[1] . ".users where " . $conns[1] . ".users.id=".$usid." limit 1";
                    $accsm = $bdqr->getSingleResult($sql);

                    if($accsm['activ'] == 0){
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * @param $usid
     * @param $role
     * @param $baseurl
     * @param $connpr
     * @return array
     */
    public function getTopmenu($usid, $role, $baseurl, $connpr)
    {
        $menuItems = array();
        if(!empty($connpr)) {
            $bdqr = new MyQueries($connpr);
            $sql = "SELECT ".$connpr[1].".fmenu.fkey,".$connpr[1].".fmenu.fname FROM ".$connpr[1].".fmenu ORDER BY ".$connpr[1].".fmenu.id ASC";
            $listm = $bdqr->getResult($sql);
            $menuItems[] = array("name" => "Главная", "page" => "", "path" => $baseurl);
            foreach ($listm as $menu){
                if ($role == 'ROLE_SUPER_ADMIN') {
                    $menuItems[] = array("name" => $menu['fname'], "page" => $menu['fkey'], "path" => $baseurl);
                } else {
                    $sql_m = "SELECT ".$connpr[1].".accesses.".$menu['fkey']." AS mnu FROM ".$connpr[1].".accesses WHERE ".$connpr[1].".accesses.iduser=".$usid." LIMIT 1";
                    $accsm = $bdqr->getSingleResult($sql_m);
                    if((int)$accsm['mnu'] > 0){
                        $menuItems[] = array("name" => $menu['fname'], "page" => $menu['fkey'], "path" => $baseurl);
                    }
                }
            }

            $menuItems[] = array("name" => "Профиль", "page" => "proff", "path" => $baseurl);
            $menuItems[] = array("name" => "Выход", "page" => "logout", "path" => $baseurl);
        }

        return $menuItems;
    }

    /**
     * @param $usid
     * @param $role
     * @param $pgident
     * @param $connpr
     * @return bool
     */
    public function TryFirstPG($usid, $role, $pgident, $connpr)
    {
        $ret = false;
        if ($role == 'ROLE_SUPER_ADMIN') {
            $ret = true;
        } else {
            $bdqr = new MyQueries($connpr);
            $sql = "select " . $connpr[1] . ".accesses." . $pgident . " from " . $connpr[1] . ".accesses where " . $connpr[1] . ".accesses.iduser=" . $usid . " limit 1";
            $accsm = $bdqr->getSingleResult($sql);

            if(!is_null($accsm) && !empty($accsm) && isset($accsm[$pgident])){
                if((int)$accsm[$pgident] > 0){
                    $ret = true;
                }
            }
        }

        return $ret;
    }

    /**
     * @param $usid
     * @param $role
     * @param $modident
     * @param $connpr
     * @param string $modpg
     * @return bool
     */
    public function TryModPg($usid, $role, $modident, $connpr, $modpg="")
    {
        $ret = false;
        if ($role == 'ROLE_SUPER_ADMIN') {
            $ret = true;
        } else {
            $bdqr = new MyQueries($connpr);
            if(trim($modpg) != ""){
                if($bdqr->SelUsMod($modident,$connpr[1],$usid)>0 && $bdqr->SelUsModPg($modident,$modpg,$connpr[1],$usid)>0){
                    $ret = true;
                }
            } else {
                if($bdqr->SelUsMod($modident,$connpr[1],$usid)>0){
                    $ret = true;
                }
            }
        }

        return $ret;
    }

    /**
     * @param $usid
     * @param $connpr
     * @param null $link
     * @return array
     */
    public function ShowCurrUser($usid, $connpr, $link = null)
    {
        $ret = array("id" => 0, "name" => '',);
        if($usid > 0) {
            if (!is_null($link)) {
                $bdqr = $link;
            } else {
                $bdqr = new MyQueries($connpr);
            }
            $sql = "select * from " . $connpr[1] . ".users where " . $connpr[1] . ".users.id=" . $usid . " limit 1";
            $accsm = $bdqr->getSingleResult($sql);

            if (!is_null($accsm) && !empty($accsm)) {
                $ret = array(
                    "id" => $accsm['id'],
                    "name" => $accsm['descr'],
                );
            }
        }

        return $ret;
    }

    /**
     * @param $usid
     * @param $connpr
     * @param $lv
     * @param null $link
     * @return array
     */
    public function ShowUserInfo($usid, $connpr, $lv, $link = null)
    {
        $ret = array();
        if($usid > 0){
            if(!is_null($link)){
                $bdqr = $link;
            } else {
                $bdqr = new MyQueries($connpr);
            }
            $sql = "select * from " . $connpr[1] . ".users where " . $connpr[1] . ".users.id=".$usid." limit 1";
            $accsm = $bdqr->getSingleResult($sql);

            if(!is_null($accsm) && !empty($accsm)){ //$accsm
                if($lv == 2) {
                    $ret = array(
                        "id" => $accsm['id'],
                        "login" => $accsm['userr'],
                        "descr" => $accsm['descr'],
                        "activate" => $accsm['activ'],
                        "group" => $this->getListCurrGroups($accsm['groups'], $connpr, $lv, $bdqr),
                    );
                } else {
                    $ret = array(
                        "login" => $accsm['userr'],
                        "descr" => $accsm['descr'],
                        "activate" => $accsm['activ'],
                        "group" => $this->getListCurrGroups($accsm['groups'], $connpr, $lv, $bdqr),
                    );
                }
            }
        }

        return $ret;
    }

    /**
     * @param $usid
     * @param $connpr
     * @param $lv
     * @param null $link
     * @return array
     */
    public function ShowUserProff($usid, $connpr, $lv, $link = null)
    {
        $ret = array();
        if($usid > 0){
            if(!is_null($link)){
                $bdqr = $link;
            } else {
                $bdqr = new MyQueries($connpr);
            }
            $sql = "select * from " . $connpr[1] . ".profiles where " . $connpr[1] . ".profiles.usid=".$usid." limit 1";
            $accsm = $bdqr->getSingleResult($sql);
            if(!is_null($accsm) && !empty($accsm)){ //$accsm
                if($lv == 2) {
                    $ret = array(
                        "id" => $accsm['id'],
                        "userid" => $accsm['usid'],
                        "phone" => $accsm['phone'],
                        "email" => $accsm['email'],
                        "info" => $accsm['info'],
                    );
                } else {
                    $ret = array(
                        "phone" => $accsm['phone'],
                        "email" => $accsm['email'],
                        "info" => $accsm['info'],
                    );
                }
            } else {
                $ins = "insert into " . $connpr[1] . ".profiles (usid,info) values (".$usid.",'')";
                $bdqr->setQuery($ins);
                $accsm = $bdqr->getSingleResult($sql);
                if(!is_null($accsm) && !empty($accsm)){ //$accsm
                    if($lv == 2) {
                        $ret = array(
                            "id" => $accsm['id'],
                            "userid" => $accsm['usid'],
                            "phone" => $accsm['phone'],
                            "email" => $accsm['email'],
                            "info" => $accsm['info'],
                        );
                    } else {
                        $ret = array(
                            "phone" => $accsm['phone'],
                            "email" => $accsm['email'],
                            "info" => $accsm['info'],
                        );
                    }
                }
            }
        }

        return $ret;
    }

    /**
     * @param $usid
     * @param $role
     * @param $pgident
     * @param $connpr
     * @return bool|int
     */
    public function getFirstPerm($usid, $role, $pgident, $connpr)
    {
        $ret = 0;
        if ($role == 'ROLE_SUPER_ADMIN') {
            $ret = 2;
        } else {
            $bdqr = new MyQueries($connpr);
            $sql = "select " . $connpr[1] . ".accesses." . $pgident . " from " . $connpr[1] . ".accesses where " . $connpr[1] . ".accesses.iduser=" . $usid . " limit 1";
            $accsm = $bdqr->getSingleResult($sql);

            if(!is_null($accsm) && !empty($accsm) && isset($accsm[$pgident])){
                if((int)$accsm[$pgident] > 0){
                    $ret = (int)$accsm[$pgident];
                }
            }
        }

        return $ret;
    }

    /**
     * @param $usid
     * @param $page
     * @param $connpr
     * @param $homepg
     * @param $cause
     * @param string $razd
     * @return array
     */
    public function getFPgContent($usid, $page, $connpr, $homepg, $cause, $razd = "")
    {
        if($usid > 0 && trim($page) != ""){
            $bdqr = new MyQueries($connpr);
            $acc = $bdqr->getFPerm($connpr[1], $usid, $page);
            if($acc == 1 || $acc == 2){
                $ret = $this->getFPgAll($page, $homepg, $connpr, $cause, $acc, $razd, $bdqr);
            } else {
                $ret = array(
                    "cause" => "denyperm",
                    "location" => $homepg,
                );
            }
        } else {
            $ret = array(
                "cause" => "denyperm",
                "location" => $homepg,
            );
        }

        return $ret;
    }

    /**
     * @param $page
     * @return array
     */
    public function getSysSubmenu($page)
    {
        $menuItems = array();
        if($page == "users"){
            $menuItems[] = array("name" => "Пользователи", "page" => "usedt");
            $menuItems[] = array("name" => "Группы", "page" => "grpdt");
        } else if($page == "admmod"){
            $menuItems[] = array("name" => "Модули", "page" => "mods");
        } else {
            $menuItems[] = array("name" => "Система", "page" => "syspg");
        }

        return $menuItems;
    }

    /**
     * @param $page
     * @param $homepg
     * @param $connpr
     * @param $cause
     * @param $acclv
     * @param string $razd
     * @param null $link
     * @return array
     */
    public function getFPgAll($page, $homepg, $connpr, $cause, $acclv, $razd = "", $link = null)
    {
        $ret = array(
            "cause" => "denyperm",
            "location" => $homepg,
        );
        if(trim($page) != "" && $acclv >= 1){
            if(!is_null($link)){
                $bdqr = $link;
            } else {
                $bdqr = new MyQueries($connpr);
            }
            if($page == "users") {
                $ret = array(
                    "cause" => $cause,
                    "mod" => '',
                    "page" => $page,
                    "subpg" => $razd,
                    "flv" => $acclv,
                    "groups" => $this->getListGroups($connpr, $acclv, $bdqr),
                );
            }
            if($page == "admmod") {
                $ret = array(
                    "cause" => $cause,
                    "mod" => '',
                    "page" => $page,
                    "subpg" => $razd,
                    "flv" => $acclv,
                    "groups" => $this->getListModSelect($connpr, $acclv, $bdqr),
                );
            }
            if($page == "proff") {

            }
        }

        return $ret;
    }

    /**
     * @param $connpr
     * @param $acclv
     * @param null $link
     * @return array
     */
    public function getListGroups($connpr, $acclv, $link = null)
    {
        $ret = array();
        if(!is_null($link)){
            $bdqr = $link;
        } else {
            $bdqr = new MyQueries($connpr);
        }
        $sql = "select * from ".$connpr[1].".group order by ".$connpr[1].".group.id asc";
        $accsm = $bdqr->getResult($sql);
        
        foreach($accsm as $item){
            $ret[] = array(
                "id" => $item['id'],
                "name" => $item['gname'],
                "lv" => $acclv,
            );
        }

        return $ret;
    }

    /**
     * @param $grpid
     * @param $connpr
     * @param $lv
     * @param null $link
     * @return array
     */
    public function getListCurrGroups($grpid, $connpr, $lv, $link = null)
    {
        $ret = array();
        if(!is_null($link)){
            $bdqr = $link;
        } else {
            $bdqr = new MyQueries($connpr);
        }
        $sql = "select * from ".$connpr[1].".group where ".$connpr[1].".group.id=".$grpid." limit 1";
        $accsm = $bdqr->getSingleResult($sql);
        if(!is_null($accsm) && !empty($accsm)) {
            if($lv == 2) {
                $ret = array(
                    "id" => $accsm['id'],
                    "name" => $accsm['gname'],
                );
            } else {
                $ret = array(
                    "id" => $accsm['id'],
                    "name" => $accsm['gname'],
                );
            }
        }

        return $ret;
    }

    /**
     * @param $connpr
     * @param $acclv
     * @param int $grpid
     * @param null $link
     * @return array
     */
    public function getListUsers($connpr, $acclv, $grpid = 1, $link = null)
    {
        $ret = array();
        if(!is_null($link)){
            $bdqr = $link;
        } else {
            $bdqr = new MyQueries($connpr);
        }
        $sql = "select * from ".$connpr[1].".users where ".$connpr[1].".users.groups=".$grpid." order by ".$connpr[1].".users.id asc";
        $accsm = $bdqr->getResult($sql);

        foreach($accsm as $item){
            $ret[] = array(
                "id" => $item['id'],
                "login" => $item['userr'],
                "name" => $item['descr'],
                "actives" => $item['activ'],
                "group" => $item['groups'],
                "lv" => $acclv,
            );
        }

        return $ret;
    }

    /**
     * @param $connpr
     * @param $inobj
     * @param $acclv
     * @return array
     */
    public function getFContentRefresh($connpr, $inobj, $acclv)
    {
        $ret = array();
        if(trim($inobj->page) != "" && $inobj->subpg != ""){
            if($inobj->page == "users"){
                if($inobj->subpg == "usedt"){
                    $ret = array(
                        "cause" => $inobj->cause,
                        "mod" => '',
                        "page" => $inobj->page,
                        "subpg" => $inobj->subpg,
                        "groups" => $this->getListUsers($connpr, $acclv, $inobj->group),
                    );
                } else {
                    $ret = array(
                        "cause" => $inobj->cause,
                        "mod" => '',
                        "page" => $inobj->page,
                        "subpg" => $inobj->subpg,
                        "groups" => $this->getListGroups($connpr, $acclv),
                    );
                }
            }
            if($inobj->page == "admmod"){
                $ret = array(
                    "cause" => $inobj->cause,
                    "mod" => '',
                    "page" => $inobj->page,
                    "subpg" => "mods",
                    "groups" => $this->getListModConfs($inobj->group, $connpr, $acclv),
                );
            }
        }

        return $ret;
    }

    /**
     * @param $objects
     * @param $connpr
     * @param $acclv
     * @return array
     */
    public function showAccGrpDetails($objects, $connpr, $acclv)
    {
        $ret = array();
        if(!is_null($objects) && !empty($objects)){
            if($objects->id>0){
                $bdqr = new MyQueries($connpr);
                if($objects->cause == "listacc"){
                    $ret = array(
                        "cause" => $objects->cause,
                        "mod" => '',
                        "page" => $objects->page,
                        "subpg" => $objects->subpg,
                        "flv" => $acclv,
                        "user" => array(
                            "info" =>$this->ShowUserInfo($objects->id, $connpr, $acclv, $bdqr),
                            "proff" => $this->ShowUserProff($objects->id, $connpr, $acclv, $bdqr),
                        ),
                    );
                } else if($objects->cause == "listpermobj"){
                    $ret = array(
                        "cause" => $objects->cause,
                        "mod" => '',
                        "page" => $objects->page,
                        "subpg" => $objects->subpg,
                        "name" => $this->ShowCurrUser($objects->id, $connpr, $bdqr),
                        "flv" => $acclv,
                        "perms" => array(
                            "sysperm" => $this->getCurrPermSys($objects->id, $connpr, $acclv, $bdqr),
                            "userprm" => $this->getCurrPermsUser($objects->id, $connpr, $acclv, $bdqr),
                        ),
                    );
                } else if($objects->cause == "listgrp"){
                    $ret = array(
                        "cause" => $objects->cause,
                        "mod" => '',
                        "page" => $objects->page,
                        "subpg" => $objects->subpg,
                        "flv" => $acclv,
                        "group" => $this->getListCurrGroups($objects->id, $connpr, $acclv, $bdqr),
                    );
                } else if($objects->cause == "listpermgrp"){
                    $ret = array(
                        "cause" => $objects->cause,
                        "mod" => '',
                        "page" => $objects->page,
                        "subpg" => $objects->subpg,
                        "name" => $this->getListCurrGroups($objects->id, $connpr, $acclv, $bdqr),
                        "flv" => $acclv,
                        "perms" => $this->getCurrPermsGroup($objects->id, $connpr, $acclv, $bdqr),
                    );
                } else if($objects->cause == "finduser"){
                    $ret = array(
                        "cause" => $objects->cause,
                        "mod" => '',
                        "page" => $objects->page,
                        "subpg" => $objects->subpg,
                        "flv" => $acclv,
                        "uid" => $objects->id,
                        "user" => array(
                            "info" =>$this->ShowUserInfo($objects->id, $connpr, $acclv, $bdqr),
                            "proff" => $this->ShowUserProff($objects->id, $connpr, $acclv, $bdqr),
                        ),
                    );
                } else {
                    $ret = array("cause" => 'firstpg');
                }
            }
        }

        return $ret;
    }

    /**
     * @param $usid
     * @param $connpr
     * @param $lv
     * @param null $link
     * @return array
     */
    public function getCurrPermsUser($usid, $connpr, $lv, $link = null)
    {
        $ret = array();
        if(!is_null($link)){
            $bdqr = $link;
        } else {
            $bdqr = new MyQueries($connpr);
        }
        $sql = "select ".$connpr[1].".modules.id,".$connpr[1].".modules.displays from ".$connpr[1].".modules where ".$connpr[1].".modules.enables=1 order by ".$connpr[1].".modules.id asc";
        $accsm = $bdqr->getResult($sql);
        if(!is_null($accsm) && !empty($accsm)) {
            if($lv == 2){
                foreach($accsm as $vkey){
                    $mod = array(
                        "id" => $vkey['id'],
                        "name" => $vkey['displays'],
                        "pages" => array(),
                    );
                    $sqlm ="select * from ".$connpr[1].".menumod where ".$connpr[1].".menumod.modid=".$vkey['id']." order by ".$connpr[1].".menumod.id asc";
                    $modm = $bdqr->getResult($sqlm);
                    if(!is_null($modm) && !empty($modm)) {
                        foreach ($modm as $pkey) {
                            $mpg = array(
                                "id" => $pkey['id'],
                                "modid" => $pkey['modid'],
                                "name" => $pkey['mval'],
                                "permits" => array(),
                            );
                            $sqlp = "select * from " . $connpr[1] . ".accessus where " . $connpr[1] . ".accessus.usid=" . $usid . " and " . $connpr[1] . ".accessus.modid=" . $vkey['id'] . " and " . $connpr[1] . ".accessus.modpg=" . $pkey['id'] . " limit 1";
                            $modp = $bdqr->getSingleResult($sqlp);
                            $mperm = array();
                            if(!is_null($modp) && !empty($modp)) {
                                foreach($modp as $key => $valperm){
                                    $mperm[$key] = $valperm;
                                }
                                $mpg['permits'][] = $mperm;
                            } else {
                                $grpperm = $this->getPermFromGroup($this->getCurrGroup($usid, $connpr, $bdqr), $vkey['id'], $pkey['id'], $connpr, $lv, $bdqr);
                                if(!is_null($grpperm) && !empty($grpperm)) {
                                    foreach($grpperm as $key => $valperm){
                                        $mperm[$key] = $valperm;
                                    }
                                    $mpg['permits'][] = $mperm;
                                } else {
                                    $permobj = array(
                                        "list" => 0,
                                        "ins" => 0,
                                        "upd" => 0,
                                        "del" => 0,
                                        "extra" => 0,
                                        "accsext" => 0,
                                    );
                                    if($this->setPermUser($usid, $vkey['id'], $pkey['id'], (object)$permobj, $connpr, $bdqr)){
                                        $modp = $bdqr->getSingleResult($sqlp);
                                        if(!is_null($modp) && !empty($modp)) {
                                            foreach($modp as $key => $valperm){
                                                $mperm[$key] = $valperm;
                                            }
                                            $mpg['permits'][] = $mperm;
                                        }
                                    }
                                }
                            }
                            $mod['pages'][] = $mpg;
                        }
                    }
                    $ret[] = $mod;
                }
            } else {
                foreach($accsm as $vkey){
                    $mod = array(
                        "name" => $vkey['displays'],
                        "pages" => array(),
                    );
                    $sqlm ="select * from ".$connpr[1].".menumod where ".$connpr[1].".menumod.modid=".$vkey['id']." order by ".$connpr[1].".menumod.id asc";
                    $modm = $bdqr->getResult($sqlm);
                    if(!is_null($modm) && !empty($modm)) {
                        foreach ($modm as $pkey) {
                            $mpg = array(
                                "name" => $pkey['mval'],
                                "permits" => array(),
                            );
                            $sqlp = "select * from " . $connpr[1] . ".accessus where " . $connpr[1] . ".accessus.usid=" . $usid . " and " . $connpr[1] . ".accessus.modid=" . $vkey['id'] . " and " . $connpr[1] . ".accessus.modpg=" . $pkey['id'] . " limit 1";
                            $modp = $bdqr->getSingleResult($sqlp);
                            $mperm = array();
                            if(!is_null($modp) && !empty($modp)) {
                                foreach($modp as $key => $valperm){
                                    if($key != "id" && $key != "modid" && $key != "usid" && $key != "modpg") {
                                        $mperm[$key] = $valperm;
                                    }
                                }
                                $mpg['permits'][] = $mperm;
                            } else {
                                $grpperm = $this->getPermFromGroup($this->getCurrGroup($usid, $connpr, $bdqr), $vkey['id'], $pkey['id'], $connpr, $lv, $bdqr);
                                if(!is_null($grpperm) && !empty($grpperm)) {
                                    foreach($grpperm as $key => $valperm){
                                        if($key != "id" && $key != "modid" && $key != "usid" && $key != "modpg") {
                                            $mperm[$key] = $valperm;
                                        }
                                    }
                                    $mpg['permits'][] = $mperm;
                                } else {
                                    $permobj = array(
                                        "list" => 0,
                                        "ins" => 0,
                                        "upd" => 0,
                                        "del" => 0,
                                        "extra" => 0,
                                        "accsext" => 0,
                                    );
                                    if($this->setPermUser($usid, $vkey['id'], $pkey['id'], (object)$permobj, $connpr, $bdqr)){
                                        $modp = $bdqr->getSingleResult($sqlp);
                                        if(!is_null($modp) && !empty($modp)) {
                                            foreach($modp as $key => $valperm){
                                                if($key != "id" && $key != "modid" && $key != "usid" && $key != "modpg") {
                                                    $mperm[$key] = $valperm;
                                                }
                                            }
                                            $mpg['permits'][] = $mperm;
                                        }
                                    }
                                }
                            }
                            $mod['pages'][] = $mpg;
                        }
                    }
                    $ret[] = $mod;
                }
            }
        }

        return $ret;
    }

    /**
     * @param $grpid
     * @param $connpr
     * @param $lv
     * @param null $link
     * @return array
     */
    public function getCurrPermsGroup($grpid, $connpr, $lv, $link = null)
    {
        $ret = array();
        if(!is_null($link)){
            $bdqr = $link;
        } else {
            $bdqr = new MyQueries($connpr);
        }
        $sql = "select ".$connpr[1].".modules.id,".$connpr[1].".modules.displays from ".$connpr[1].".modules where ".$connpr[1].".modules.enables=1 order by ".$connpr[1].".modules.id asc";
        $accsm = $bdqr->getResult($sql);
        if(!is_null($accsm) && !empty($accsm)) {
            if($lv == 2){
                foreach($accsm as $vkey){
                    $mod = array(
                        "id" => $vkey['id'],
                        "name" => $vkey['displays'],
                        "pages" => array(),
                    );
                    $sqlm ="select * from ".$connpr[1].".menumod where ".$connpr[1].".menumod.modid=".$vkey['id']." order by ".$connpr[1].".menumod.id asc";
                    $modm = $bdqr->getResult($sqlm);
                    if(!is_null($modm) && !empty($modm)) {
                        foreach ($modm as $pkey) {
                            $mpg = array(
                                "id" => $pkey['id'],
                                "modid" => $pkey['modid'],
                                "name" => $pkey['mval'],
                                "permits" => array(),
                            );
                            $sqlp = "select * from " . $connpr[1] . ".accessgrp where " . $connpr[1] . ".accessgrp.grpid=" . $grpid . " and " . $connpr[1] . ".accessgrp.modid=" . $vkey['id'] . " and " . $connpr[1] . ".accessgrp.modpg=" . $pkey['id'] . " limit 1";
                            $modp = $bdqr->getSingleResult($sqlp);
                            $mperm = array();
                            if(!is_null($modp) && !empty($modp)) {
                                foreach($modp as $key => $valperm){
                                    $mperm[$key] = $valperm;
                                }
                                $mpg['permits'][] = $mperm;
                            } else {
                                $permobj = array(
                                    "list" => 0,
                                    "ins" => 0,
                                    "upd" => 0,
                                    "del" => 0,
                                    "extra" => 0,
                                    "accsext" => 0,
                                );
                                if($this->setPermGroup($grpid, $vkey['id'], $pkey['id'], (object)$permobj, $connpr, $bdqr)){
                                    $modp = $bdqr->getSingleResult($sqlp);
                                    if(!is_null($modp) && !empty($modp)) {
                                        foreach($modp as $key => $valperm){
                                            $mperm[$key] = $valperm;
                                        }
                                        $mpg['permits'][] = $mperm;
                                    }
                                }
                            }
                            $mod['pages'][] = $mpg;
                        }
                    }
                    $ret[] = $mod;
                }
            } else {
                foreach($accsm as $vkey){
                    $mod = array(
                        "name" => $vkey['displays'],
                        "pages" => array(),
                    );
                    $sqlm ="select * from ".$connpr[1].".menumod where ".$connpr[1].".menumod.modid=".$vkey['id']." order by ".$connpr[1].".menumod.id asc";
                    $modm = $bdqr->getResult($sqlm);
                    if(!is_null($modm) && !empty($modm)) {
                        foreach ($modm as $pkey) {
                            $mpg = array(
                                "name" => $pkey['mval'],
                                "permits" => array(),
                            );
                            $sqlp = "select * from " . $connpr[1] . ".accessgrp where " . $connpr[1] . ".accessgrp.grpid=" . $grpid . " and " . $connpr[1] . ".accessgrp.modid=" . $vkey['id'] . " and " . $connpr[1] . ".accessgrp.modpg=" . $pkey['id'] . " limit 1";
                            $modp = $bdqr->getSingleResult($sqlp);
                            $mperm = array();
                            if(!is_null($modp) && !empty($modp)) {
                                foreach($modp as $key => $valperm){
                                    if($key != "id" && $key != "modid" && $key != "usid" && $key != "modpg") {
                                        $mperm[$key] = $valperm;
                                    }
                                }
                                $mpg['permits'][] = $mperm;
                            } else {
                                $permobj = array(
                                    "list" => 0,
                                    "ins" => 0,
                                    "upd" => 0,
                                    "del" => 0,
                                    "extra" => 0,
                                    "accsext" => 0,
                                );
                                if($this->setPermGroup($grpid, $vkey['id'], $pkey['id'], (object)$permobj, $connpr, $bdqr)){
                                    $modp = $bdqr->getSingleResult($sqlp);
                                    if(!is_null($modp) && !empty($modp)) {
                                        foreach($modp as $key => $valperm){
                                            if($key != "id" && $key != "modid" && $key != "usid" && $key != "modpg") {
                                                $mperm[$key] = $valperm;
                                            }
                                        }
                                        $mpg['permits'][] = $mperm;
                                    }
                                }
                            }
                            $mod['pages'][] = $mpg;
                        }
                    }
                    $ret[] = $mod;
                }
            }
        }

        return $ret;
    }

    /**
     * @param $modid
     * @param $usid
     * @param $connpr
     * @param null $link
     * @return array
     */
    public function getCurrPermUserMod($modid, $usid, $connpr, $link = null)
    {
        if(!is_null($link)){
            $bdqr = $link;
        } else {
            $bdqr = new MyQueries($connpr);
        }
        $mpg = array();
        $sqlm ="select * from ".$connpr[1].".menumod as mmd where mmd.modid=".$modid." order by mmd.id asc";
        $modm = $bdqr->getResult($sqlm);
        if(!is_null($modm) && !empty($modm)) {
            foreach ($modm as $pkey) {
                $sqlp = "select * from " . $connpr[1] . ".accessus as accs where accs.usid=" . $usid . " and accs.modid=" . $modid . " and accs.modpg=" . $pkey['id'] . " limit 1";
                $modp = $bdqr->getSingleResult($sqlp);
                $mperm = array();
                if(!is_null($modp) && !empty($modp)) {
                    foreach($modp as $key => $valperm){
                        if($key != "id" && $key != "modid" && $key != "usid" && $key != "modpg" && $key != "grpid") {
                            $mperm[$key] = $valperm;
                        }
                    }
                    $mpg[$pkey['mkey']] = $mperm;
                } else {
                    $grpperm = $this->getPermFromGroup($this->getCurrGroup($usid, $connpr, $bdqr), $modid, $pkey['id'], $connpr, 1, $bdqr);
                    if(!is_null($grpperm) && !empty($grpperm)) {
                        foreach($grpperm as $key => $valperm){
                            $mperm[$key] = $valperm;
                        }
                        $mpg[$pkey['mkey']] = $mperm;
                    } else {
                        $permobj = array(
                            "list" => 0,
                            "ins" => 0,
                            "upd" => 0,
                            "del" => 0,
                            "extra" => 0,
                            "accsext" => 0,
                        );
                        $mpg[$pkey['mkey']] = $permobj;
                    }
                }
            }
        }
        $ret = $mpg;

        //$this->log->getLogger()->debug('Permits Info '.$_SERVER['REMOTE_ADDR'].'', [$ret]);

        return $ret;
    }

    /**
     * @param $usid
     * @param $connpr
     * @param $lv
     * @param null $link
     * @return array
     */
    public function getCurrPermSys($usid, $connpr, $lv, $link = null)
    {
        $ret = array();
        if(!is_null($link)){
            $bdqr = $link;
        } else {
            $bdqr = new MyQueries($connpr);
        }
        $sql = "select * from ".$connpr[1].".accesses where ".$connpr[1].".accesses.iduser=".$usid." limit 1";
        $accsm = $bdqr->getSingleResult($sql);
        if(!is_null($accsm) && !empty($accsm)) {
            foreach ($accsm as $key => $val) {
                if ($lv == 2) {
                    $ret[$key] = $val;
                } else {
                    if ($key != "id" && $key != "iduser") {
                        $ret[$key] = $val;
                    }
                }
            }
        } else {
            $ins = array(
                "users" => 0,
                "admmod" => 0,
            );
            if($this->setSysPerms($usid,(object)$ins,$connpr,$bdqr)){
                $accsm = $bdqr->getSingleResult($sql);
                if(!is_null($accsm) && !empty($accsm)) {
                    foreach ($accsm as $key => $val) {
                        if ($lv == 2) {
                            $ret[$key] = $val;
                        } else {
                            if ($key != "id" && $key != "iduser") {
                                $ret[$key] = $val;
                            }
                        }
                    }
                }
            }
        }

        return $ret;
    }

    /**
     * @param $usid
     * @param $connpr
     * @param null $link
     * @return int
     */
    public function getCurrGroup($usid, $connpr, $link = null)
    {
        $ret = 0;
        if(!is_null($link)){
            $bdqr = $link;
        } else {
            $bdqr = new MyQueries($connpr);
        }
        $sql = "select us.groups from ".$connpr[1].".users as us where us.id=".$usid." limit 1";
        $accsm = $bdqr->getSingleResult($sql);
        if(isset($accsm['groups'])){
            $ret = (int)$accsm['groups'];
        }

        return $ret;
    }

    /**
     * @param $grpid
     * @param $modid
     * @param $pgid
     * @param $connpr
     * @param $lv
     * @param null $link
     * @return array
     */
    public function getPermFromGroup($grpid, $modid, $pgid, $connpr, $lv, $link = null)
    {
        $ret = array();
        if(!is_null($link)){
            $bdqr = $link;
        } else {
            $bdqr = new MyQueries($connpr);
        }
        $sql = "select * from " . $connpr[1] . ".accessgrp as accsg where accsg.grpid=" . $grpid . " and accsg.modid=" . $modid . " and accsg.modpg=" . $pgid . " limit 1";
        $accsm = $bdqr->getSingleResult($sql);
        if(!is_null($accsm) && !empty($accsm)) {
            if($lv == 2){
                foreach($accsm as $key => $valperm){
                    $ret[$key] = $valperm;
                }
            } else {
                foreach($accsm as $key => $valperm){
                    if($key != "id" && $key != "modid" && $key != "grpid" && $key != "modpg") {
                        $ret[$key] = $valperm;
                    }
                }
            }
        }

        return $ret;
    }

    /**
     * @param $fstr
     * @param $connpr
     * @param $lv
     * @return array
     */
    public function getFindUser($fstr, $connpr, $lv)
    {
        $ret = array("cause" => 'nomethods');
        if(!empty($fstr)) {
            $bdqr = new MyQueries($connpr);
            $serchs = $bdqr->createSqlStrings($fstr->user);
            $serpar = "";
            $ind = 0;
            foreach($serchs as $params){
                if($ind == 0){
                    $serpar .= "" . $connpr[1] . ".users.descr like '%" . $params . "%'";
                } else {
                    $serpar .= " and " . $connpr[1] . ".users.descr like '%" . $params . "%'";
                }
                $ind++;
            }
            if(trim($serpar) != "") {
                $sql = "select " . $connpr[1] . ".users.id from " . $connpr[1] . ".users where ".$serpar." limit 1";
                $accsm = $bdqr->getSingleResult($sql);
                if(!is_null($accsm) && !empty($accsm)) {
                    if((int)$accsm['id'] > 0){
                        $objquery = array(
                            "module" => '',
                            "page" => $fstr->page,
                            "subpg" => $fstr->subpg,
                            "cause" => $fstr->cause,
                            "id" => (int)$accsm['id'],
                        );

                        $ret = $this->showAccGrpDetails((object)$objquery,$connpr,$lv);
                    }
                }
            }
        }

        return $ret;
    }

    /**
     * @param $inobj
     * @param $connpr
     * @param $lv
     * @return array
     */
    public function setUpdatePermits($inobj, $connpr, $lv)
    {
        $ret = array("cause" => 'nomethods');
        if($lv == 2){
            if(!empty($inobj)) {
                $bdqr = new MyQueries($connpr);
                if($inobj->page == "users"){
                    if($inobj->subpg == "usedt"){
                        if($inobj->params->type == 0){ // Система
                            $objparam = array("users" => $inobj->params->form->sysuser, "admmod" => $inobj->params->form->sysmods);
                            if($this->updSysPerms($inobj->userid, (object)$objparam, $connpr, $bdqr)){
                                $ret = array("cause" => 'updpermits');
                            } else {
                                $ret = array("cause" => 'error', "errors" => 'Права доступа к глобальным разделам системы не обновлены !');
                            }
                        } else {  // Модули
                            $objparam = array();
                            $formobj = $inobj->params->form;
                            foreach ($formobj as $key => $val){
                                $temp = explode("_",$key);
                                if(count($temp)==2){
                                    $objparam["".$temp[0].""]["".$temp[1].""] = $val;
                                }
                            }
                            $ret = array("cause" => 'updpermits');
                            foreach($objparam as $pgid => $valobj){
                                if(!$this->updPermUser($inobj->userid,$inobj->params->type,$pgid,(object)$valobj,$connpr, $bdqr)){
                                    $ret = array("cause" => 'error', "errors" => 'Права доступа к модулю для пользователя не обновлены !');
                                }
                            }
                        }
                    }
                    if($inobj->subpg == "grpdt"){
                        if($inobj->params->type > 0){
                            $objparam = array();
                            $formobj = $inobj->params->form;
                            foreach ($formobj as $key => $val){
                                $temp = explode("_",$key);
                                if(count($temp)==2){
                                    $objparam["".$temp[0].""]["".$temp[1].""] = $val;
                                }
                            }
                            $ret = array("cause" => 'updpermits');
                            foreach($objparam as $pgid => $valobj){
                                if(!$this->updPermGroup($inobj->userid,$inobj->params->type,$pgid,(object)$valobj,$connpr, $bdqr)){
                                    $ret = array("cause" => 'error', "errors" => 'Права доступа к модулю для группы не обновлены !');
                                }
                            }
                        }
                    }
                }
            }
        } else {
            $ret = array("cause" => 'firstpg');
        }

        return $ret;
    }

    /**
     * @param $inobj
     * @param $connpr
     * @param $lv
     * @return array
     */
    public function updUsersGroups($inobj, $connpr, $lv)
    {
        $ret = array("cause" => 'nomethods');
        if($lv == 2) {
            if (!empty($inobj)) {
                $bdqr = new MyQueries($connpr);
                if($this->setAddUpdUserGroup($inobj, $connpr, $bdqr)){
                    if($inobj->formid == "userfrm") {
                        if($inobj->objs->dstv == 0) {
                            $ret = array(
                                "cause" => $inobj->cause,
                                "upuser" => "closeform",
                                "group" => $inobj->objs->group,
                            );
                        } else {
                            $ret = array(
                                "cause" => $inobj->cause,
                                "upuser" => "hidepw",
                                "group" => $inobj->objs->group,
                            );
                        }
                    } else {
                        if($inobj->formid == "groupfrm") {
                            $ret = array(
                                "cause" => $inobj->cause,
                                "upuser" => "refrgrp",
                            );
                        } else {
                            $ret = array(
                                "cause" => $inobj->cause
                            );
                        }
                    }
                }
            }
        } else {
            $ret = array("cause" => 'firstpg');
        }

        return $ret;
    }

    /**
     * @param $inobj
     * @param $connpr
     * @param $lv
     * @return array
     */
    public function delUserGroup($inobj, $connpr, $lv)
    {
        $ret = array("cause" => 'nomethods');
        if($lv == 2) {
            if (!empty($inobj)) {
                $bdqr = new MyQueries($connpr);
                if ($inobj->cause == "delacc") {
                    if ($this->setDeleteAccount($inobj->id, $connpr, $bdqr)) {
                        $ret = array(
                            "cause" => $inobj->cause,
                            "upuser" => "refruser",
                        );
                    }
                }
                if ($inobj->cause == "delgrp") {
                    if ($this->setDeleteGroup($inobj->id, $connpr, $bdqr)) {
                        $ret = array(
                            "cause" => $inobj->cause,
                            "upuser" => "refrgrp",
                        );
                    }
                }
            }
        } else {
            $ret = array("cause" => 'firstpg');
        }

        return $ret;
    }

    /**
     * @param $connpr
     * @param $lv
     * @param null $link
     * @return array
     */
    public function getListModSelect($connpr, $lv, $link = null)
    {
        $ret = array();
        if(!is_null($link)){
            $bdqr = $link;
        } else {
            $bdqr = new MyQueries($connpr);
        }
        $sql = "select * from ".$connpr[1].".modules order by ".$connpr[1].".modules.id asc";
        $accsm = $bdqr->getResult($sql);
        $ret[] = array(
            "id" => 0,
            "name" => 'Системные переменные',
            "lv" => $lv,
        );
        foreach($accsm as $item){
            $ret[] = array(
                "id" => $item['id'],
                "name" => $item['displays'],
                "lv" => $lv,
            );
        }

        return $ret;
    }

    /**
     * @param $objects
     * @param $connpr
     * @param $lv
     * @param null $link
     * @return array
     */
    public function getListModInstalls($objects,$connpr, $lv, $link = null)
    {
        if($lv == 0) {
            $ret = array("cause" => 'firstpg');
        } else {
            $ret = array(
                "cause" => $objects->cause,
                "module" => $objects->module,
                "page" => $objects->page,
                "subpg" => $objects->subpg,
                "indx" => $objects->indx,
                "cssid" => $objects->cssid,
                "lv" => $lv,
                "objs" => "",
            );
            $lret = array();
            if(!is_null($link)){
                $bdqr = $link;
            } else {
                $bdqr = new MyQueries($connpr);
            }
            $sql = "select * from ".$connpr[1].".modules order by ".$connpr[1].".modules.id asc";
            $accsm = $bdqr->getResult($sql);
            if(!is_null($accsm) && !empty($accsm) && !empty($objects)) {

                foreach($accsm as $item) {
                    if ($lv == 2) {
                        $retl = array();
                        foreach ($item as $key => $val) {
                            $retl[$key] = $val;
                        }
                        $lret[] = $retl;
                    } else {
                        $retl = array();
                        foreach ($item as $key => $val) {
                            if($key != "names") {
                                $retl[$key] = $val;
                            }
                        }
                        $lret[] = $retl;
                    }
                }
                $ret['objs'] = $lret;
            }
        }

        return $ret;
    }

    /**
     * @param $modid
     * @param $connpr
     * @param $lv
     * @param null $link
     * @return array
     */
    public function getListModConfs($modid, $connpr, $lv, $link = null)
    {
        $ret = array();
        if(!is_null($link)){
            $bdqr = $link;
        } else {
            $bdqr = new MyQueries($connpr);
        }
        $sql = "select * from ".$connpr[1].".configtbl where ".$connpr[1].".configtbl.idmod=".$modid." order by ".$connpr[1].".configtbl.idmod asc";
        $accsm = $bdqr->getResult($sql);
        foreach($accsm as $item){
            if($lv==2){
                $item['lv'] = $lv;
                $ret[] = $item;
            } else {
                $lret = array();
                foreach($item as $key => $val){
                    if($key != "id") {
                        $lret[$key] = $val;
                    }
                }
                $item['lv'] = $lv;
                $ret[] = $lret;
            }
        }

        return $ret;
    }

    /**
     * @param $objects
     * @param $connpr
     * @param $lv
     * @return array
     */
    public function showModCurrConfNode($objects, $connpr, $lv)
    {
        $ret = array("cause" => 'nomethods');
        if($lv == 2) {
            if (!empty($objects)) {
                if($objects->id > 0) {
                    $bdqr = new MyQueries($connpr);
                    if($objects->cause == "listconfmod") {
                        $sql = "select * from " . $connpr[1] . ".configtbl where " . $connpr[1] . ".configtbl.id=" . $objects->id . " limit 1";
                        $accsm = $bdqr->getSingleResult($sql);
                        if(!is_null($accsm) && !empty($accsm)) {
                            $ret = array(
                                "cause" => $objects->cause,
                                "mod" => '',
                                "page" => $objects->page,
                                "subpg" => $objects->subpg,
                                "flv" => $lv,
                                "modpgcfg" => $accsm,
                            );
                        }
                    }
                }
            } else {
                $ret = array("cause" => 'firstpg');
            }
        }

        return $ret;
    }

    /**
     * @param $inobj
     * @param $connpr
     * @param $lv
     * @return array
     */
    public function setConfModPG($inobj, $connpr, $lv)
    {
        $ret = array("cause" => 'nomethods');
        if($lv == 2) {
            if (!empty($inobj)) {
                $bdqr = new MyQueries($connpr);
                if($this->setAddUpdConfMod($inobj, $connpr, $bdqr)){
                    $ret = array(
                        "cause" => $inobj->cause,
                        "upuser" => "closeformmcfg",
                        "modid" => $inobj->modid,
                    );
                }
            }
        } else {
            $ret = array("cause" => 'firstpg');
        }

        return $ret;
    }

    /**
     * @param $inobj
     * @param $connpr
     * @param $lv
     * @return array
     */
    public function setDeleteConfMods($inobj, $connpr, $lv)
    {
        $ret = array("cause" => 'nomethods');
        if($lv == 2) {
            if (!empty($inobj)) {
                if ($inobj->cause == "delconfval") {
                    $bdqr = new MyQueries($connpr);
                    if ($this->setDeleteKeyMod($inobj->id, $connpr, $bdqr)) {
                        $ret = array(
                            "cause" => $inobj->cause,
                            "upuser" => "refrconflist",
                        );
                    }
                }
            } else {
                $ret = array("cause" => 'firstpg');
            }
        } else {
            $ret = array("cause" => 'firstpg');
        }

        return $ret;
    }

    /**
     * @param $objects
     * @param $connpr
     * @param $lv
     * @param null $link
     * @return array
     */
    public function setDisEnblModule($objects, $connpr, $lv, $link = null)
    {
        if($lv == 0) {
            $ret = array("cause" => 'firstpg');
        } else {
            if($lv == 2) {
                $ret = array("cause" => 'nomethods');
                if (!is_null($link)) {
                    $bdqr = $link;
                } else {
                    $bdqr = new MyQueries($connpr);
                }
                $sql = "select * from " . $connpr[1] . ".modules where " . $connpr[1] . ".modules.id=" . $objects->modid . " limit 1";
                $accsm = $bdqr->getSingleResult($sql);
                if (!is_null($accsm) && !empty($accsm) && !empty($objects)) {
                    if ((int)$accsm['enables'] != (int)$objects->stat) {
                        $upd = "update " . $connpr[1] . ".modules set " . $connpr[1] . ".modules.enables=" . $objects->stat . " where " . $connpr[1] . ".modules.id=" . $objects->modid . "";
                        $bdqr->setQuery($upd);
                    }
                    $ret = $this->getListModInstalls($objects, $connpr, $lv, $bdqr);
                }
            } else {
                $ret = array("cause" => 'firstpg');
            }
        }

        return $ret;
    }

    /**
     * @return array
     */
    public function getScanListModuls()
    {
        $ret = array();
        $dirscan = __DIR__."/../../modules/Moduls";
        foreach( scandir( $dirscan . "/" ) as $mod ){
            if(is_dir($dirscan . "/" . $mod) && $mod != "." && $mod != ".."){
                clearstatcache();
                $loadsm = "Moduls\\".$mod."";
                $ret[] = $loadsm::infomod();
            }
        }
        return $ret;
    }

    /**
     * @param $connpr
     * @param $lv
     * @param null $link
     * @return array
     */
    public function getListAvailableMod($connpr, $lv, $link = null)
    {
        $ret = array();
        if(!is_null($link)){
            $bdqr = $link;
        } else {
            $bdqr = new MyQueries($connpr);
        }
        $listmods = $this->getScanListModuls();
        if(!empty($listmods)){
            foreach ($listmods as $single){
                if(!is_null($single) && !empty($single)) {
                    $sql = "select * from " . $connpr[1] . ".modules where " . $connpr[1] . ".modules.names='" . $single['names'] . "' limit 1";
                    $accsm = $bdqr->getSingleResult($sql);
                    if(is_null($accsm) || empty($accsm)) {
                        if($lv == 2) {
                            $uninst = array(
                                "id" => 0,
                                "names" => $single['names'],
                                "displays" => $single['displays'],
                                "enables" => 0,
                                "bundle" => $single['bundle'],
                                "namespase" => $single['namespase'],
                            );
                        } else {
                            $uninst = array(
                                "id" => 0,
                                "displays" => $single['displays'],
                                "enables" => 0,
                                "bundle" => $single['bundle'],
                                "namespase" => $single['namespase'],
                            );
                        }
                        $ret[] = $uninst;
                    }
                }
            }
        }

        return $ret;
    }

    /**
     * @param $objects
     * @param $connpr
     * @param $lv
     * @return array
     */
    public function getListModUnInstalls($objects, $connpr, $lv)
    {
        if($lv == 0) {
            $ret = array("cause" => 'firstpg');
        } else {
            $ret = array(
                "cause" => $objects->cause,
                "module" => $objects->module,
                "page" => $objects->page,
                "subpg" => $objects->subpg,
                "indx" => $objects->indx,
                "cssid" => $objects->cssid,
                "lv" => $lv,
                "objs" => '',
            );
            $accsm = $this->getListAvailableMod($connpr, $lv);
            if(!is_null($accsm) && !empty($accsm) && !empty($objects)) {
                $ret['objs'] = $accsm;
            }
        }

        return $ret;
    }

    /**
     * @param $objects
     * @param $connpr
     * @param $lv
     * @return array
     */
    public function InstallModule($objects, $connpr, $lv)
    {
        $bdqr = new MyQueries($connpr);
        if($this->setInstallModule($objects->bundle,$connpr,$bdqr)){
            return $this->getListModUnInstalls($objects, $connpr, $lv);
        }
        return $this->getListModUnInstalls($objects, $connpr, $lv);
    }

    /**
     * @param $objects
     * @param $connpr
     * @param $lv
     * @return array
     */
    public function DeinstallModule($objects, $connpr, $lv)
    {
        $bdqr = new MyQueries($connpr);
        if($this->setDeinstallModule($objects->modid, $connpr, $bdqr)){
            return $this->getListModInstalls($objects, $connpr, $lv);
        }

        return $this->getListModInstalls($objects, $connpr, $lv);
    }

    /**
     * @param $objects
     * @param $uid
     * @param $connpr
     * @param $lv
     * @param $basepg
     * @param null $link
     * @return array
     */
    public function getListModIndexPage($objects, $uid, $connpr, $lv, $basepg, $link = null)
    {
        $ret = array(
            "cause" => $objects->cause,
            "module" => $objects->module,
            "page" => $objects->page,
            "subpg" => $objects->subpg,
            "lv" => $lv,
            "objs" => "",
        );
        $lret = array();
        if(!is_null($link)){
            $bdqr = $link;
        } else {
            $bdqr = new MyQueries($connpr);
        }
        $sql = "select * from ".$connpr[1].".modules where ".$connpr[1].".modules.enables=1 order by ".$connpr[1].".modules.id asc";
        $accsm = $bdqr->getResult($sql);
        if(!is_null($accsm) && !empty($accsm) && !empty($objects)) {
            foreach($accsm as $item) {
                if($bdqr->SelUsMod($item['names'],$connpr[1],$uid) == 1) {
                    $imglink = "/modules/".$item['names']."/img/modimg.png";
                    $linkmod = $basepg."modules/".$item['names'];
                    $lret[] = array(
                        "moddisp" => $item['displays'],
                        "imgsrc" => $imglink,
                        "link" => $linkmod,
                    );
                }
            }
            $ret['objs'] = $lret;
        }

        return $ret;
    }

    /**
     * @param $user
     * @param $mod
     * @param $connpr
     * @param int $lv
     * @return null
     */
    public function getModuleObject($user, $mod, $connpr, $lv = 0)
    {
        $retmod = null;
        $bdqr = new MyQueries($connpr);
        $sql = "select * from ".$connpr[1].".modules where ".$connpr[1].".modules.enables=1 and ".$connpr[1].".modules.names='".$mod."' limit 1";
        $accsm = $bdqr->getSingleResult($sql);
        if(!is_null($accsm) && !empty($accsm)) {
            $bundle = $accsm['bundle'];
            $namespase = $accsm['namespase'];
            $loadsm = $namespase."\\".$bundle."";
            $retmod = new $loadsm($connpr,$lv,$accsm['id'],$user,$this->getCurrPermUserMod($accsm['id'], $user, $connpr));
        }

        return $retmod;
    }

    /**
     * @param $modid
     * @param $pmarray
     * @param $connpr
     * @param null $link
     * @return array
     */
    public function getMenuModule($modid, $pmarray, $connpr, $link = null)
    {
        $ret = array();
        if($modid > 0){
            $lret = array();
            if(!is_null($link)){
                $bdqr = $link;
            } else {
                $bdqr = new MyQueries($connpr);
            }
            $sql = "select * from ".$connpr[1].".menumod where ".$connpr[1].".menumod.modid=".$modid." order by ".$connpr[1].".menumod.id asc";
            $accsm = $bdqr->getResult($sql);
            if(!is_null($accsm) && !empty($accsm)) {
                foreach($accsm as $keyval){
                    if((int)$pmarray[$keyval['mkey']]['list'] == 1){
                        $ret[] = array("mkey" => $keyval['mkey'], "mval" => $keyval['mval']);
                    }
                }
            }
        }

        return $ret;
    }

    /**
     * @param $stdt
     * @param $eddt
     * @return array
     */
    public function getSqlBetweens($stdt, $eddt)
    {
        $ret = array(
            "stdt" => $stdt,
            "eddt" => $eddt,
            "stdttmst" => strtotime($stdt),
            "eddttmst" => (int)(strtotime($eddt)+86399),
        );

        if(strtotime($stdt) > strtotime($eddt)) {
            $ret = array(
                "stdt" => $eddt,
                "eddt" => $stdt,
                "stdttmst" => strtotime($eddt),
                "eddttmst" => (int)(strtotime($stdt)+86399),
            );
        }

        return $ret;
    }

    /**
     * @param $in
     * @return string
     */
    public function toSqlTmFormat($in)
    {
        $out = $in;
        $try = explode("-",$in);
        if(count($try)>1){
            $out = $in;
        } else {
            $try = explode(".",$in);
            if(count($try)>1){
                $tmtry = explode(" ",$try[2]);
                if(count($tmtry)>1){
                    $out = $tmtry[0] . '-' . $try[1] . '-' . $try[0].' '.$tmtry[1];
                } else {
                    $out = $try[2] . '-' . $try[1] . '-' . $try[0];
                }
            }
        }

        return $out;
    }
}