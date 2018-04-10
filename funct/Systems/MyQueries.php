<?php
/**
 * Created by PhpStorm.
 * User: zevs5
 * Date: 04.11.2016
 * Time: 0:24
 */

namespace Systems;

use \mysqli;

class MyQueries
{
    private $link = null;

    private $numrows = 0;

    /**
     * MyQueries constructor.
     * @param $conid
     * @param bool $isobj
     */
    public function __construct($conid, $isobj = false)
    {
        if($isobj) {
            if (is_object($conid) && !empty($conid)) {
                $this->setLink(new \mysqli($conid->host, $conid->user, $conid->pass));
            }
        } else {
            if (!empty($conid)) {
                $connar = array(
                    "host" => $conid[0],
                    "base" => $conid[1],
                    "user" => $conid[2],
                    "pass" => $conid[3],
                );
                $connar = (object)$connar;
                $this->setLink(new mysqli($connar->host, $connar->user, $connar->pass));
            }
        }
    }

    /**
     *
     */
    public function __destruct()
    {
        if(!is_null($this->getLink())) {
            $this->getLink()->close();
        }
    }

    public function getClose()
    {
        if(!is_null($this->getLink())) {
            $this->getLink()->close();
        }
    }

    /**
     * @return mixed
     */
    public function getLink()
    {
        return $this->link;
    }

    /**
     * @param mixed $link
     */
    private function setLink(\mysqli $link)
    {
        $this->link = $link;
    }

    /**
     * @param $sql
     * @return array
     */
    public function getSingleResult($sql)
    {
        $cfg = array();
        if(!is_null($this->getLink()) && trim($sql) != "") {
            if ($res = $this->getLink()->query($sql)) {
                $this->numrows = $res->num_rows;
                $row = $res->fetch_assoc();
                $cfg = $row;
                $res->free();
                if($this->getLink()->more_results()) {
                    $this->getLink()->next_result();
                }
            }
        }

        return $cfg;
    }

    /**
     * @param $sql
     * @return array
     */
    public function getResult($sql)
    {
        $cfg = array();
        if(!is_null($this->getLink()) && trim($sql) != "") {
            if ($res = $this->getLink()->query($sql)){
                $this->numrows = $res->num_rows;
                while($row = $res->fetch_assoc()){
                    $cfg[] = $row;
                }
                $res->free();
                if($this->getLink()->more_results()) {
                    $this->getLink()->next_result();
                }
            }
        }

        return $cfg;
    }

    /**
     * @param $sql
     * @return array
     */
    public function setQuery($sql)
    {
        $cfg = array("id" => 0);
        if(!is_null($this->getLink()) && trim($sql) != "") {
            $this->getLink()->query($sql);
            $cfg['id'] = $this->getLink()->insert_id;
            if($this->getLink()->more_results()) {
                $this->getLink()->next_result();
            }
        }

        return $cfg;
    }

    /**
     * @param $idmod
     * @param $base
     * @param $opid
     * @return array
     */
    public function SelConfs($idmod, $base, $opid)
    {
        $cfg = array();
        if(!is_null($this->getLink()) && $this->SelUsMod($idmod,$base,$opid)===1){
            if(trim($idmod) != "") {
                $id = 0;
                if(is_numeric($idmod)){
                    $id = (int)$idmod;
                } else {
                    $sql = "select " . $base . ".modules.id from " . $base . ".modules where " . $base . ".modules.names='" . $idmod . "' limit 1";
                    if (!is_null($this->getLink()) && $res = $this->getLink()->query($sql)) {
                        $row = $res->fetch_assoc();
                        $id = (int)$row['id'];
                        $res->free();
                    }
                }
                if ($id > 0) {
                    $sql = "SELECT * FROM " . $base . ".configtbl WHERE " . $base . ".configtbl.idmod=$id ORDER BY " . $base . ".configtbl.id ASC";
                    if ($res = $this->getLink()->query($sql)) {
                        while ($row = $res->fetch_assoc()) {
                            $cfg[$row['keys']] = $row['values'];
                        }
                        $res->free();
                    }
                }
            }
        }

        return $cfg;
    }

    /**
     * @param $idmod
     * @param $base
     * @param $opid
     * @return int
     */
    public function SelUsMod($idmod, $base, $opid)
    {
        $ret = 0;
        if(trim($idmod) != "") {
            $id = 0;
            $enbl = 0;
            if(is_numeric($idmod)){
                $sql = "select " . $base . ".modules.id," . $base . ".modules.enables from " . $base . ".modules where " . $base . ".modules.id=" . $idmod . " limit 1";
            } else {
                $sql = "select " . $base . ".modules.id," . $base . ".modules.enables from " . $base . ".modules where " . $base . ".modules.names='" . $idmod . "' limit 1";
            }
            if (!is_null($this->getLink()) && $res = $this->getLink()->query($sql)) {
                $row = $res->fetch_assoc();
                $id = (int)$row['id'];
                $enbl = (int)$row['enables'];
                $res->free();
            }

            if($id > 0 && $enbl == 1) {
                $role = $this->getCurrRole($base,$opid);
                if($role == "ROLE_SUPER_ADMIN"){
                    $ret = 1;
                } else {
                    $grpid = $this->QueryUsGrp($base, $opid);
                    $mgrp = 0;
                    $musr = 0;
                    $usext = false;
                    if (!is_null($this->getLink())) {
                        $sql = "select * from " . $base . ".accessgrp where " . $base . ".accessgrp.grpid=" . $grpid . " and " . $base . ".accessgrp.modid=" . $id . " and " . $base . ".accessgrp.list=1 limit 1";
                        if ($res = $this->getLink()->query($sql)) {
                            $row = $res->fetch_assoc();
                            if ((int)$row['id'] > 0) {
                                $mgrp = 1;
                            }
                            $res->free();
                        }

                        $sql = "select * from " . $base . ".accessus where " . $base . ".accessus.usid=" . $opid . " and " . $base . ".accessus.modid=" . $id . " order by " . $base . ".accessus.list asc";
                        if ($res = $this->getLink()->query($sql)) {
                            while($row = $res->fetch_assoc()) {
                                $usext = true;
                                if ((int)$row['list'] > 0) {
                                    $musr = 1;
                                    break;
                                }
                            }
                            $res->free();
                        }
                    }

                    if ($mgrp == 1 && $musr == 1) {
                        $ret = 1;
                    } else if ($mgrp == 0 && $musr == 1) {
                        $ret = 1;
                    } else if($mgrp == 1 && $musr == 0 && $usext == false){
                        $ret = 1;
                    }
                }
            }
        }

        return $ret;
    }

    public function SelUsModPg($idmod, $idmodpg, $base, $opid)
    {
        $ret = array(
            "list" => 0,
            "ins" => 0,
            "upd" => 0,
            "del" => 0,
            "extra" => 0,
            "accsext" => 0,
        );

        if(trim($idmod) != "" && trim($idmodpg) != "") {
            $id = 0;
            $enbl = 0;
            $sql = "select " . $base . ".modules.id," . $base . ".modules.enables from " . $base . ".modules where " . $base . ".modules.names='" . $idmod . "' limit 1";
            if (!is_null($this->getLink()) && $res = $this->getLink()->query($sql)) {
                $row = $res->fetch_assoc();
                $id = (int)$row['id'];
                $enbl = (int)$row['enables'];
                $res->free();
            }

            if($id > 0 && $enbl == 1) {
                $role = $this->getCurrRole($base,$opid);
                if($role == "ROLE_SUPER_ADMIN"){
                    $ret = array(
                        "list" => 1,
                        "ins" => 1,
                        "upd" => 1,
                        "del" => 1,
                        "extra" => 1,
                        "accsext" => 1,
                    );
                } else {
                    $grpid = $this->QueryUsGrp($base, $opid);
                    $mpgid = $this->getIdModPg($base, $id, $idmodpg);
                    $mgrp = $ret;
                    $musr = $ret;
                    if (!is_null($this->getLink()) && $mpgid > 0 && $grpid > 0) {
                        $sql = "select * from " . $base . ".accessgrp where " . $base . ".accessgrp.grpid=" . $grpid . " and " . $base . ".accessgrp.modid=" . $id . " and " . $base . ".accessgrp.modpg=" . $mpgid . " limit 1";
                        if ($res = $this->getLink()->query($sql)) {
                            $row = $res->fetch_assoc();
                            if ((int)$row['id'] > 0) {
                                $mgrp['list'] = $row['list'];
                                $mgrp['ins'] = $row['ins'];
                                $mgrp['upd'] = $row['upd'];
                                $mgrp['del'] = $row['del'];
                                $mgrp['extra'] = $row['extra'];
                                $mgrp['accsext'] = $row['accsext'];
                            }
                            $res->free();
                        }

                        $sql = "select * from " . $base . ".accessus where " . $base . ".accessus.usid=" . $opid . " and " . $base . ".accessus.modid=" . $id . " and " . $base . ".accessgrp.modpg=" . $mpgid . " limit 1";
                        if ($res = $this->getLink()->query($sql)) {
                            $row = $res->fetch_assoc();
                            if ((int)$row['id'] > 0) {
                                $musr['list'] = $row['list'];
                                $musr['ins'] = $row['ins'];
                                $musr['upd'] = $row['upd'];
                                $musr['del'] = $row['del'];
                                $musr['extra'] = $row['extra'];
                                $musr['accsext'] = $row['accsext'];
                            }
                            $res->free();
                        }
                    }
                    $ret = $this->getPermit($mgrp, $musr);
                }
            }
        }

        return $ret;
    }

    /**
     * @param $base
     * @param $opid
     * @return int
     */
    public function QueryUsGrp($base, $opid)
    {
        $ret = 0;
        $sql ="select ".$base.".users.groups from ".$base.".users where ".$base.".users.id=".$opid." limit 1";
        if (!is_null($this->getLink()) && $res = $this->getLink()->query($sql)) {
            $row = $res->fetch_assoc();
            if((int)$row['groups'] > 0){
                $ret = (int)$row['groups'];
            }
            $res->free();
        }
        return $ret;
    }

    /**
     * @param $opid
     * @param $base
     * @return string
     */
    public function getCurrRole($base, $opid)
    {
        $ret = "";
        $sql ="select ".$base.".users.role from ".$base.".users where ".$base.".users.id=".$opid." limit 1";
        if (!is_null($this->getLink()) && $res = $this->getLink()->query($sql)) {
            $row = $res->fetch_assoc();
            if(trim($row['role']) != ""){
                $ret = $row['role'];
            }
            $res->free();
        }
        return $ret;
    }

    /**
     * @param $base
     * @param $modid
     * @param $modkey
     * @return int
     */
    public function getIdModPg($base, $modid, $modkey)
    {
        $ret = 0;
        $sql ="select ".$base.".menumod.id from ".$base.".menumod where ".$base.".menumod.modid=".$modid." and ".$base.".menumod.mkey='".$modkey."' limit 1";
        if (!is_null($this->getLink()) && $res = $this->getLink()->query($sql)) {
            $row = $res->fetch_assoc();
            if((int)$row['id'] >0){
                $ret = (int)$row['id'];
            }
            $res->free();
        }
        return $ret;
    }

    /**
     * @param string $str
     * @return string
     */
    public function EscapedStr($str = "")
    {
        return addslashes($str);
    }

    /**
     * @param array $grparr
     * @param array $usarr
     * @return array
     */
    public function getPermit($grparr = array(), $usarr = array())
    {
        $ret = array();
        if(!empty($grparr) && !empty($usarr)){
            $ret = $usarr;
        } else {
            if(!empty($grparr)){
                $ret = $grparr;
            } else {
                if(!empty($usarr)){
                    $ret = $usarr;
                } else {
                    $ret = array(
                        "list" => 0,
                        "ins" => 0,
                        "upd" => 0,
                        "del" => 0,
                        "extra" => 0,
                        "accsext" => 0,
                    );
                }
            }
        }

        return $ret;
    }

    /**
     * @param $base
     * @param $opid
     * @param $page
     * @return int
     */
    public function getFPerm($base, $opid, $page)
    {
        $ret = 0;
        if($this->getCurrRole($base, $opid) == "ROLE_SUPER_ADMIN"){
            $ret = 2;
        } else {
            $sql ="select ".$base.".accesses.".$page." from ".$base.".accesses where ".$base.".accesses.iduser=".$opid." limit 1";
            if (!is_null($this->getLink()) && $res = $this->getLink()->query($sql)) {
                $row = $res->fetch_assoc();
                if(isset($row[$page])){
                    $ret = (int)$row[$page];
                }
                $res->free();
            }
        }

        return $ret;
    }

    public function createSqlStrings($strings)
    {
        $ret = array();
        if(trim($strings) != ""){
            $ret = explode(" ", $strings);
        }

        return $ret;
    }

    /**
     * @return int
     */
    public function getNumrows()
    {
        return $this->numrows;
    }

    /**
     * @param $arrays
     * @return string
     */
    public function mergeUpdStr($arrays)
    {
        $out = "";
        if(isset($arrays)){
            if(isset($arrays['sourse']) && isset($arrays['trys']) && isset($arrays['bdstr']) && isset($arrays['short'])){
                if(!is_null($arrays['sourse']) && !is_null($arrays['trys']) && !empty($arrays['sourse']) && !empty($arrays['trys'])){
                    $sqlstr = "";
                    foreach($arrays['sourse'] as $key => $val){
                        if(isset($arrays['trys'][$key])){
                            if($val != $arrays['trys'][$key]){
                                if(is_string($val)){
                                    $sqlstr .= "" . $arrays['short'] . "." . $key . "='" . $arrays['trys'][$key] . "',";
                                } else {
                                    $sqlstr .= "" . $arrays['short'] . "." . $key . "=" . $arrays['trys'][$key] . ",";
                                }
                            }
                        }
                    }
                    $sqlstr = trim($sqlstr,",");
                    if(trim($sqlstr, " ") != "") {
                        $out = "update " . $arrays['bdstr'] . " " . $arrays['short'] . " set " . $sqlstr . " where " . $arrays['short'] . ".";
                    }
                }
            }
        }

        return $out;
    }

}