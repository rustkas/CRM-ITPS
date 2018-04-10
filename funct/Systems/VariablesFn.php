<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 07.04.2017
 * Time: 14:00
 */

namespace Systems;


use DateTime;

class VariablesFn
{
    /**
     * @param int $sec
     * @return string
     */
    public static function seconds2minutes($sec = 0){
        $time=(int)$sec;
        $hours = floor($time/3600);
        $nsec = $hours*3600;
        $nmin = $time-$nsec;
        $minutes = floor($nmin/60);
        $seconds = ceil(($minutes - floor($minutes))*60);

        if($hours!=0){
            $hours = $hours.' ч. ';
        } else {
            $hours = '';
        }
        if($minutes!=0){
            $minutes = $minutes.' мин. ';
        } else{
            $minutes ='';
        }
        if($seconds!=0){
            $seconds = $seconds.' сек.';
        } else {
            $seconds = '';
        }
        $str = $hours.$minutes.$seconds;

        return $str;
    }

    /**
     * @param $delit
     * @param $counts
     * @return string
     */
    public static function retMbit($delit, $counts){
        $strext = '';
        if($delit>0){
            $rmb = $counts+(4294967296*$delit);
        } else {
            $rmb = $counts;
        }

        $giga = 0;
        $mega = 0;
        $kilo = 0;
        $bayt = 0;
        if($rmb>0) {
            $kilo = floor($rmb / 1024);
            $kilo0 = ($kilo * 1024);
            $bayt = ($rmb - $kilo0);
            if ($kilo > 0) {
                $mega = floor($kilo / 1024);
                $mega0 = ($mega * 1024);
                $kilo = ($kilo - $mega0);
                if ($mega > 0) {
                    $giga = floor($mega / 1024);
                    $giga0 = ($giga * 1024);
                    $mega = ($mega - $giga0);
                }
            }
        }

        if($giga>0){
            $strext .= $giga.' Гб.';
        }

        if($mega>0){
            $strext .= ' '.$mega.' Мб.';
        }

        if($kilo>0){
            $strext .= ' '.$kilo.' кб.';
        }

        if($bayt>0){
            $strext .= ' '.$bayt.' б.';
        }

        return $strext;
    }

    /**
     * @param $countsec
     * @return string
     */
    public static function retSesstime($countsec){
        $strext = '';

        $hours = 0;
        $minut = 0;
        $secon = 0;

        if($countsec>0){

            $minut = floor($countsec/60);
            $minut0 = ($minut*60);
            $secon = ($countsec-$minut0);
            if($minut>0){
                $hours = floor($minut/60);
                $hours0 = ($hours*60);
                $minut = ($minut-$hours0);
            }
        }

        if($hours>0){
            $strext .= $hours.' ч.';
        }

        if($minut>0){
            $strext .= ' '.$minut.' мин.';
        }

        if($secon>0){
            $strext .= ' '.$secon.' сек.';
        }

        return $strext;
    }

    /**
     * @param $string
     * @return bool
     */
    public static function getStringLength($string)
    {
        $trys = preg_replace("\"/\s/\"","",$string);
        $strLength = iconv_strlen($trys, 'UTF-8');
        if($strLength >=6){
            return true;
        }
        return false;
    }

    /**
     * @param $string
     * @return int
     */
    public static function getStringLengthINT($string)
    {
        $trys = preg_replace("\"/\s/\"","",$string);
        $strLength = iconv_strlen($trys, 'UTF-8');
        return $strLength;
    }

    /**
     * @param $phone
     * @return mixed|string
     */
    public static function clearPhoneNum($phone)
    {
        $out = preg_replace("(\s|\(|\)|\+|\-)","",$phone);
        $strLength = iconv_strlen($out, 'UTF-8');
        if($strLength > 10){
            $out = mb_substr($out,1,NULL,'UTF-8');
        }

        return $out;
    }

    /**
     * @param $fnstr
     * @return mixed|string
     */
    public static function clearFindString($fnstr)
    {
        $out = self::trimSpecSimb($fnstr); //preg_replace("(ул|дом|кв|г|\.|\.)","",$fnstr);
        $out = trim($out, " ");
        $out= preg_replace("/\s{2,}/"," ",$out);
        return $out;
    }

    /**
     * @param $str
     * @return string
     */
    public static function trimSpecSimb($str)
    {
        $out = "";
        if(trim($str," ") != ""){
            $arrstr = explode(" ", $str);
            $cn = count($arrstr);
            for($i=0;$i<$cn;$i++){
                if($arrstr[$i] == "ул" || $arrstr[$i] == "ул." || $arrstr[$i] == "ул." || $arrstr[$i] == "дом" || $arrstr[$i] == "дом." || $arrstr[$i] == "дом." || $arrstr[$i] == "кв" || $arrstr[$i] == "кв." || $arrstr[$i] == "кв." || $arrstr[$i] == "г" || $arrstr[$i] == "г." || $arrstr[$i] == "г."){
                    if(trim($out," ") != ""){
                        $out .= "";
                    } else {
                        $out = "";
                    }
                } else {
                    if(trim($out," ") != ""){
                        $out .= " ".$arrstr[$i];
                    } else {
                        $out = $arrstr[$i];
                    }
                }
            }
        }

        return $out;
    }

    /**
     * @param $indog
     * @return string
     */
    public static function getFnAddrs($indog)
    {
        $fn = explode(",",$indog);
        $cn = count($fn);
        if($cn > 1) {
            $out = "";
            for($f=0;$f<($cn-1);$f++){
                $out .= $fn[$f].",";
            }
            return $out;
        }
        return $indog;
    }

    /**
     * @param $address
     * @return string
     */
    public static function showAddrsFromDog($address)
    {
        $out = $address;
        $sst = explode(",",trim($address,","));
        if(!is_null($sst) && !empty($sst)){
            $out = "";
            $acnt = count($sst);
            for($i=0;$i<$acnt;$i++) {
                if ($sst[$i] != '') {
                   /* if ($i == ($acnt - 1)) {
                        $trsst = explode(" ", $sst[$acnt - 1]);
                        $tcnt = count($trsst);
                        if ($tcnt >= 2) {
                            if ($trsst[1] != '') {
                                $out .= $sst[$i] . " ";
                            }
                        }
                    } else {*/
                        $out .= $sst[$i] . " ";
                    /*}*/
                }
            }
        }

        $out = trim($out," ");
        return $out;
    }

    /**
     * @param $home
     * @return array
     */
    public static function getBuildFulls($home)
    {
        $ret = array(
            "build" => '',
            "corp" => '',
        );

        $sst = explode("/",trim($home,"/"));
        if(!is_null($sst) && !empty($sst)){
            $acnt = count($sst);
            if($acnt < 2){
                $ret = array(
                    "build" => $home,
                    "corp" => '',
                );
            } else {
                $corps = "";
                for($i=1;$i<$acnt;$i++){
                    $corps .= $sst[$i];
                }
                $ret = array(
                    "build" => $sst[0],
                    "corp" => $corps,
                );
            }
        }

        return $ret;
    }

    /**
     * @param int $key
     * @return string
     */
    public static function getTypeAbon($key = 0)
    {
        $ret = "Физ. лицо";
    if((int)$key == 1) {
        $ret = "Юр. лицо";
    }

        return $ret;
    }

    /**
     * @param $arrin
     * @param $catlink
     * @return string
     */
    public static function getAppendsDogIdx($arrin, $catlink)
    {
        $out = '01';
        //$loggers = new ModLogger('abonents','abonents');
        if(!empty($arrin) && trim($catlink, " ") != ""){
            $fkey = 1;
            $outnum = 0;
            if(trim($catlink, " ") == "spd"){
                $fkey = 2;
            }
            foreach($arrin as $dog){
                if(trim($dog, " ") != ""){
                    $arrdog = array();
                    $arrdog = explode("-",$dog);
                    $cnt = count($arrdog);
                    if($cnt == 3){
                        if((int)$arrdog[0] == $fkey){
                            if((int)$arrdog[2] > $outnum){
                                $outnum = (int)$arrdog[2];
                            }
                        }
                    }
                }
            }
            if($outnum > 0){
                if($outnum<10){
                    $out = "0".($outnum+1)."";
                } else {
                    $out = "".($outnum+1)."";
                }
            }
        }

        return $out;
    }

    /**
     * @param $phone1
     * @param $phone2
     * @param $phone3
     * @param int $uid
     * @param int $key
     * @return array|string
     */
    public static function formatPhones($phone1, $phone2, $phone3, $uid = 0, $key = 0)
    {
        $ret = "";
        $phstr = "";
        $pharr = array();
        $phone = explode(',',$phone1);
        $cnt = count($phone);
        if($cnt > 0){
            for($i = 0;$i < $cnt;$i++){
                $ph = VariablesFn::clearPhoneNum($phone[$i]);
                $ph = VariablesFn::returnFormatPhone($ph);
                if($key == 0) {
                    if ($phstr != "") {
                        $phstr .= " " . $ph;
                    } else {
                        $phstr = $ph;
                    }
                } else {
                    if($ph != "") {
                        $pharr[] = array(
                            "id" => $uid,
                            "uid" => $uid,
                            "phone" => $ph,
                            "typest" => 1,
                        );
                    }
                }
            }
        }

        $phone = explode(',',$phone2);
        $cnt = count($phone);
        if($cnt > 0){
            for($i = 0;$i < $cnt;$i++){
                $ph = VariablesFn::clearPhoneNum($phone[$i]);
                $ph = VariablesFn::returnFormatPhone($ph);
                if($key == 0) {
                    if ($phstr != "") {
                        $phstr .= " " . $ph;
                    } else {
                        $phstr = $ph;
                    }
                } else {
                    if($ph != "") {
                        $pharr[] = array(
                            "id" => $uid,
                            "uid" => $uid,
                            "phone" => $ph,
                            "typest" => 2,
                        );
                    }
                }
            }
        }

        $phone = explode(',',$phone3);
        $cnt = count($phone);
        if($cnt > 0){
            for($i = 0;$i < $cnt;$i++){
                $ph = VariablesFn::clearPhoneNum($phone[$i]);
                $ph = VariablesFn::returnFormatPhone($ph);
                if($key == 0) {
                    if ($phstr != "") {
                        $phstr .= " " . $ph;
                    } else {
                        $phstr = $ph;
                    }
                } else {
                    if($ph != "") {
                        $pharr[] = array(
                            "id" => $uid,
                            "uid" => $uid,
                            "phone" => $ph,
                            "typest" => 3,
                        );
                    }
                }
            }
        }

        if($key == 0){
            $ret = $phstr;
        } else {
            $ret = $pharr;
        }

        return $ret;
    }

    /**
     * @param $phone
     * @return string
     */
    public static function returnFormatPhone($phone)
    {
        $outs = '';
        $len = strlen($phone);
        if($len>0){
            if($len==10){
                $fr = substr($phone,0,3);
                $one = substr($phone,3,3);
                $two = substr($phone,6,2);
                $three = substr($phone,8,2);
                $outs = '+7('.$fr.')'.$one.'-'.$two.'-'.$three;
            }
            if($len==6){
                $one = substr($phone,0,2);
                $two = substr($phone,2,2);
                $three = substr($phone,4,2);
                $outs = $one.'-'.$two.'-'.$three;
            }
        } else {
            $outs = $phone;
        }

        return $outs;
    }

    /**
     * @param $phone
     * @param $phones
     * @param string $phrepl
     * @param int $del
     * @return string
     */
    public static function replPhone($phone, $phones, $phrepl = '', $del = 0)
    {
        $ret = "";
        $pharr = explode(',',$phones);
        $cnt = count($pharr);
        if($cnt > 0) {
            for ($i = 0; $i < $cnt; $i++) {
                $ph = VariablesFn::clearPhoneNum($pharr[$i]);
                if ($ret != "") {
                    if($ph == $phrepl && $phrepl != "") {
                        if($del == 0){
                            $ret .= ",".$phone;
                        }
                    } else {
                        $ret .= ",".$ph;
                    }
                } else {
                    if($ph == $phrepl && $phrepl != "") {
                        if($del == 0){
                            $ret = $phone;
                        }
                    } else {
                        $ret = $ph;
                    }
                }
            }
        }

        return $ret;
    }

    /**
     * @param $phonestr
     * @param $phonenum
     * @param int $key
     * @param null $logger
     * @return string
     */
    public static function setUpdatePhoneString($phonestr, $phonenum, $key = 0,ModLogger $logger = null)
    {
        $phone = self::clearPhoneNum($phonenum);
        $leng = strlen($phone);
        if((int)$leng != 6 && (int)$leng != 10){
            if(!is_null($logger)){
                $logger->getLogger()->debug("Update array Input leng = ".$leng."",[$phone]);
            }
            $ret = $phonestr;
        } else {
            $outstr = "";
            $pharr = explode(',', $phonestr);
            $cnt = count($pharr);
            if(!is_null($logger)){
                $logger->getLogger()->debug("Update array Input cnt = ".$cnt."",[$pharr]);
            }
            if ($cnt > 0) {
                for ($i = 0; $i < $cnt; $i++) {
                    $ph = self::clearPhoneNum($pharr[$i]);
                    $lengs = strlen($ph);
                    if(!is_null($logger)){
                        $logger->getLogger()->debug("Update array Input ".$ph."",[$lengs]);
                    }
                    if ((string)$ph != (string)$phone) {
                        if (trim($outstr, " ") != "") {
                            if ((int)$lengs == 6 || (int)$lengs == 10) {
                                $outstr .= "," . $ph;
                            }
                        } else {
                            if ((int)$lengs == 6 || (int)$lengs == 10) {
                                $outstr .= $ph;
                            }
                        }
                    }
                }
            }

            if((int)$key == 0){
                if (trim($outstr, " ") != "") {
                    if ((int)$leng == 6 || (int)$leng == 10) {
                        $outstr .= "," . $phone;
                    }
                } else {
                    if ((int)$leng == 6 || (int)$leng == 10) {
                        $outstr .= $phone;
                    }
                }
            }

            $ret = $outstr;
        }

        return $ret;
    }

    /**
     * @param $tmstamp
     * @return string
     */
    public static function getFromUnixTime($tmstamp)
    {
        $dtformat = "Y m d H:i:s";
        $date = new DateTime();
        if(is_numeric($tmstamp)){
            $date->setTimestamp((int)$tmstamp);
        }
        return $date->format($dtformat);
    }

    /**
     * @param $tmstamp
     * @return string
     */
    public static function getDateTimeFromUnixTime($tmstamp)
    {
        $dtformat = "d.m.Y H:i:s";
        $date = new DateTime();
        if(is_numeric($tmstamp)){
            $date->setTimestamp((int)$tmstamp);
        }
        return $date->format($dtformat);
    }

    /**
     * @param $tmstamp
     * @return string
     */
    public static function getDateFromUnixTime($tmstamp)
    {
        $dtformat = "d.m.Y";
        $date = new DateTime();
        if(is_numeric($tmstamp)){
            $date->setTimestamp((int)$tmstamp);
        }
        return $date->format($dtformat);
    }

    /**
     * @param $date
     * @return array
     */
    public static function setDateToUnixTime($date)
    {
        $datearr = explode(".", $date);
        $formats = array(
            "year" => '1970',
            "month" => '01',
            "day" => '01',
            "time" => '',
        );
        $cnt = count($datearr);
        if ($cnt == 3) {
            for ($d = 0; $d < $cnt; $d++) {
                $strLength = iconv_strlen($datearr[$d], 'UTF-8');
                if ($d == 0 || $d == 2) {
                    if ($strLength == 4) {
                        $formats['year'] = $datearr[$d];
                    } else {
                        $formats['day'] = $datearr[$d];
                    }
                } else if ($d == 1) {
                    $formats['month'] = $datearr[$d];
                } else {
                    if (trim($formats['time'], " ") == "") {
                        $formats['time'] = " " . $datearr[$d];
                    } else {
                        $formats['time'] .= ":" . $datearr[$d];
                    }
                }
            }
        } else {
            $datearr = explode("-", $date);
            $cnt = count($datearr);
            if ($cnt == 3) {
                for ($d = 0; $d < $cnt; $d++) {
                    $strLength = iconv_strlen($datearr[$d], 'UTF-8');
                    if ($d == 0 || $d == 2) {
                        if ($strLength == 4) {
                            $formats['year'] = $datearr[$d];
                        } else {
                            $formats['day'] = $datearr[$d];
                        }
                    } else if ($d == 1) {
                        $formats['month'] = $datearr[$d];
                    } else {
                        if (trim($formats['time'], " ") == "") {
                            $formats['time'] = " " . $datearr[$d];
                        } else {
                            $formats['time'] .= ":" . $datearr[$d];
                        }
                    }
                }
            }
        }

        return array(
            "sqldate" => $formats['year']."-".$formats['month']."-".$formats['day'],
            "timestamp" => strtotime($formats['year']."-".$formats['month']."-".$formats['day'].$formats['time']),
            "sqltime" => $formats['time'],
        );
    }

    /**
     * @param null $dates
     * @return int
     */
    public static function setDateToUnixTimeStamp($dates = null)
    {
        if(!is_null($dates)){
            $date = new DateTime($dates);
        } else {
            $date = new DateTime();
        }

        return $date->getTimestamp();
    }

    /**
     * @param $tmsql
     * @return string
     */
    public static function getFromSqlTime($tmsql)
    {
        $dtformat = "Y m d H:i:s";
        $date = new DateTime($tmsql);
        return $date->format($dtformat);
    }

    /**
     * @param $tmsql
     * @return string
     */
    public static function getFromSqlDate($tmsql)
    {
        $dtformat = "d.m.Y";
        $date = new DateTime($tmsql);
        return $date->format($dtformat);
    }

    /**
     * @param $tmsql
     * @return string
     */
    public static function getFromSqlDateTime($tmsql)
    {
        $dtformat = "d.m.Y H:i:s";
        $date = new DateTime($tmsql);
        return $date->format($dtformat);
    }

    /**
     * @return string if(ctype_digit((string)$tmstamp)){
    $date->setTimestamp((int)$tmstamp);
    }
     */
    public static function setToSqlDateTime($tmst=null)
    {
        $dtformat = "Y-m-d H:i:s";
        $date = new DateTime();
        if(!is_null($tmst)){
            if(is_numeric($tmst)) {
                $date->setTimestamp($tmst);
            }
        }
        return $date->format($dtformat);
    }

    /**
     * @return string
     */
    public static function setToSqlDate($tmst=null)
    {
        $dtformat = "Y-m-d";
        $date = new DateTime();
        if(!is_null($tmst)){
            if(is_numeric($tmst)) {
                $date->setTimestamp($tmst);
            }
        }
        return $date->format($dtformat);
    }

    /**
     * @return int
     */
    public static function setToTimeStamp()
    {
        $date = new DateTime();
        return $date->getTimestamp();
    }

    /**
     * @return string
     */
    public static function setToDate()
    {
        $dtformat = "d.m.Y";
        $date = new DateTime();
        return $date->format($dtformat);
    }

    /**
     * @return string
     */
    public static function setToDateTime()
    {
        $dtformat = "d.m.Y H:i:s";
        $date = new DateTime();
        return $date->format($dtformat);
    }

    /**
     * @param int $counts
     * @return string
     */
    public static function getNewPasswords($counts = 10)
    {
        $arr = array('1','2','3','4','5','6','7','8','9','0');
        // Генерируем пароль
        $pass = "";
        $number = (int)$counts;
        for($i = 0; $i < $number; $i++){
            // Вычисляем случайный индекс массива
            $index = rand(0, count($arr)-1);
            $pass .= $arr[$index];
        }
        return $pass;
    }

    /**
     * @param int $counts
     * @return string
     */
    public static function getNewIdent($counts = 10)
    {
        $arr = array('1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');
        // Генерируем пароль
        $pass = "";
        $number = (int)$counts;
        for($i = 0; $i < $number; $i++)
        {
            // Вычисляем случайный индекс массива
            $index = rand(0, count($arr)-1);
            $pass .= $arr[$index];
        }
        return $pass;
    }

    /**
     * @param $paspstr
     * @return array
     */
    public static function getParsePaspStr($paspstr,$uid)
    {
        $ret = array(
            "id" => 0,
            "serials" => '',
            "nums" => '',
            "orgouts" => '',
            "outs" => '',
            "codefns" => '',
        );
        if($paspstr != "" && (int)$uid > 0) {
            $psarr = explode('|', $paspstr);
            $cnt = count($psarr);
            if ($cnt == 5) {
                $ret = array(
                    "id" => $uid,
                    "serials" => $psarr[0],
                    "nums" => $psarr[1],
                    "orgouts" => $psarr[2],
                    "outs" => $psarr[3],
                    "codefns" => $psarr[4],
                );
            }
        }

        return $ret;
    }

    /**
     * @param $paspstr
     * @param $uid
     * @return array
     */
    public static function getParseRegAddr($paspstr, $uid)
    {
        $ret = array(
            "id" => 0,
            "sity" => '',
            "street" => '',
            "home" => '',
            "corp" => '',
            "flat" => '',
        );
        if($paspstr != "" && (int)$uid > 0) {
            $psarr = explode('|', $paspstr);
            $cnt = count($psarr);
            if ($cnt == 5) {
                $ret = array(
                    "id" => $uid,
                    "sity" => $psarr[0],
                    "street" => $psarr[1],
                    "home" => $psarr[2],
                    "corp" => $psarr[3],
                    "flat" => $psarr[4],
                );
            }
        }

        return $ret;
    }

    /**
     * @param $paspstr
     * @param $uid
     * @return array
     */
    public static function getParseJurParam($paspstr, $uid)
    {
        $ret = array(
            "id" => 0,
            "inn" => '',
            "kpp" => '',
            "schet" => '',
            "jaddr" => '',
        );
        if($paspstr != "" && (int)$uid > 0) {
            $psarr = explode('|', $paspstr);
            $cnt = count($psarr);
            if ($cnt == 4) {
                $ret = array(
                    "id" => $uid,
                    "inn" => $psarr[0],
                    "kpp" => $psarr[1],
                    "schet" => $psarr[2],
                    "jaddr" => $psarr[3],
                );
            }
        }

        return $ret;
    }

    public static function getParseJurContactsStr($paspstr,$uid)
    {
        $ret = array(
            "id" => 0,
            "jurruk" => '',
            "osnov" => '',
            "jurparam1" => '',
            "jurcont" => '',
            "jurcontdolg" => '',
        );
        if($paspstr != "" && (int)$uid > 0) {
            $psarr = explode('|', $paspstr);
            $cnt = count($psarr);
            if ($cnt == 5) {
                $ret = array(
                    "id" => $uid,
                    "jurruk" => $psarr[0],
                    "osnov" => $psarr[1],
                    "jurparam1" => $psarr[2],
                    "jurcont" => $psarr[3],
                    "jurcontdolg" => $psarr[4],
                );
            }
        }

        return $ret;
    }

    /**
     * @param $blocks
     * @return int
     */
    public static function getKeyBlock($blocks)
    {
        $ret = 0;
        switch ($blocks){
            case 1:
                $ret = 3;
                break;
            case 16:
                $ret = 1;
                break;
            case 256:
                $ret = 2;
                break;
            default:
                $ret = 0;
        }

        return $ret;
    }

    /**
     * @param $inmany
     * @return string
     */
    public static function setFormatMany($inmany)
    {
        $ret = $inmany;
        $psarr = explode('.', $inmany);
        $cnt = count($psarr);
        if($cnt > 0) {
            if ($cnt == 2) {
                if(strlen($psarr[1]) == 1){
                    $ret = $psarr[0] . " руб. " . $psarr[1] . "0 коп.";
                } else {
                    $ret = $psarr[0] . " руб. " . $psarr[1] . " коп.";
                }
            } else {
                $ret = $psarr[0] . " руб.";
            }
        }

        return $ret;
    }

    /**
     * @param string $ctype
     * @return string
     */
    public static function getSTypeFromComm($ctype = '')
    {
        switch((string)$ctype){
            case "KTV":
                $out = 'Кабельное телевидение';
                break;
            case "SPD":
                $out = 'Интернет';
                break;
            case "DOPSERVICE":
                $out = 'Доп. услуга';
                break;
            case "ONCESERVICE":
                $out = 'Разовая услуга';
                break;
            case "ACTION":
                $out = 'Акция';
                break;


            default:
                $out = '';
        }

        return $out;
    }

    /**
     * @param $sortarr
     * @param $sortkey
     * @return mixed
     */
    public static function array_orderby($sortarr, $sortkey, $sorts = 0) {
        if(!is_null($sortarr) && !empty($sortarr) && trim($sortkey," ") != "") {
            $arr_sorts = array();
            foreach ($sortarr as $key => $arr) {
                $arr_sorts[$key] = $arr[$sortkey];
            }
            if((int)$sorts == 0) {
                array_multisort($arr_sorts, SORT_DESC, $sortarr);
            } else {
                array_multisort($arr_sorts, SORT_ASC, $sortarr);
            }

        }

        return $sortarr;
    }

    /**
     * @param $in
     * @return string
     */
    public static function getTmDiap($in)
    {
        $out = "с 10:00 до 13:00";
        if($in==2){
            $out = "с 14:00 до 18:00";
        }
        if($in==3){
            $out = "с 18:00";
        }

        return $out;
    }

    /**
     * @param $catid
     * @return string
     */
    public static function getInfoCatName($catid)
    {
        $ret = '';
        switch((int)$catid){
            case 0:
                $ret = 'Блокировка или разблокировка';
                break;
            case 1:
                $ret = 'Смена тарифного плана';
                break;
            case 2:
                $ret = 'Рассторжение всех услуг';
                break;
            case 3:
                $ret = 'Подключение или отключение услуги';
                break;

            default:
                $ret = 'Не определено';
                break;
        }

        return $ret;
    }

    /**
     * @param $input
     * @return int
     */
    public static function parseCheckBox($input)
    {
        $out = 0;
        if($input == 'on'){
            $out = 1;
        }

        return $out;
    }

    /**
     * @param $mu
     * @param $ring
     * @param $sw
     * @return string
     */
    public static function print_ip($mu, $ring, $sw){
        $e1 = ((int)$mu-1)*2;
        $f1 = (((int)$ring-1)*32)+(int)$sw+1;

        if ((int)$f1>=256){
            $e1 = ((int)$e1+1);
            $f1 = ((int)$f1-256);
        }
        $privatsw = "172.16.".(int)$e1.".".(int)$f1."";
        return $privatsw;
    }

    /**
     * @param $mu
     * @param $ring
     * @param $sw
     * @return string
     */
    public static function print_ip_gw($mu, $ring, $sw){
        $e1 = ((int)$mu-1)*2;
        $f1 = (((int)$ring-1)*32)+(int)$sw+1;

        if ((int)$f1>=256){
            $e1 = ((int)$e1+1);
            $f1 = ((int)$f1-256);
        }
        $fi=(int)$f1-1;
        $privatsw = "172.16.".(int)$e1.".".(int)$fi."";
        return $privatsw;
    }

    /**
     * @param $mu
     * @param $ring
     * @param $sw
     * @return string
     */
    public static function print_gw($mu, $ring, $sw){
        $a1 = ((int)$mu-1)*2;
        $b1 = (((int)$ring-1)*32)+((int)$sw-1);
        if((int)$b1>=256){
            $a1 = ((int)$a1+1);
            $b1 = ((int)$b1-256);
        }
        $gwatem = "10.".(int)$a1.".".(int)$b1.".";
        return $gwatem;
    }

    /**
     * @param $confbd
     * @param string $db
     * @return array
     */
    public static function getObjAddrs($confbd,$db = "gtv_billing")
    {
        $out = array("addr" => array(),"rayon" => array(),"classtw" => array(),"classst" => array(),"classrm" => array());
        if(!empty($confbd)) {
            $addrbd = new MyQueries($confbd);
            $idxc = 0;
            $idxs = 0;
            $idxh = 0;
            $sql1 = "select * from " . $db . ".countrysity country order by country.id asc";
            $res1 = $addrbd->getResult($sql1);
            if (!is_null($res1) && !empty($res1)) {
                $idxc = 0;
                foreach($res1 as $coutry){
                    $out['addr'][$idxc]['id'] = $coutry['id'];
                    $out['addr'][$idxc]['country'] = $coutry['country'];
                    $out['addr'][$idxc]['region'] = $coutry['region'];
                    $out['addr'][$idxc]['rayon'] = $coutry['rayon'];
                    $out['addr'][$idxc]['sity'] = $coutry['sity'];
                    $out['addr'][$idxc]['classtw'] = $coutry['classtw'];
                    $out['addr'][$idxc]['tcode'] = $coutry['tcode'];
                    $out['addr'][$idxc]['taltcode'] = $coutry['taltcode'];
                    $out['addr'][$idxc]['scode'] = $coutry['scode'];
                    $out['addr'][$idxc]['sindex'] = $coutry['sindex'];
                    $sql2 = "select * from ".$db.".streets street where street.fid=".$coutry['id']." order by street.id asc";
                    $res2 = $addrbd->getResult($sql2);
                    if (!is_null($res2) && !empty($res2)) {
                        $idxs = 0;
                        foreach ($res2 as $street) {
                            $out['addr'][$idxc]['sitys'][$idxs]['id'] = $street['id'];
                            $out['addr'][$idxc]['sitys'][$idxs]['val'] = $street['val'];
                            $out['addr'][$idxc]['sitys'][$idxs]['altval'] = $street['altval'];
                            $out['addr'][$idxc]['sitys'][$idxs]['clstr'] = $street['classst'];
                            $sql3 = "select build.*,CAST(build.home AS UNSIGNED) AS homes, CAST(build.corp AS UNSIGNED) AS corps from ".$db.".houses build where build.sid=".$street['id']." and build.fid=".$coutry['id']." order by homes asc, corps asc";
                            $res3 = $addrbd->getResult($sql3);
                            if (!is_null($res3) && !empty($res3)) {
                                $idxh = 0;
                                foreach ($res3 as $build) {
                                    $out['addr'][$idxc]['sitys'][$idxs]['buildings'][$idxh]['id'] = $build['id'];
                                    $out['addr'][$idxc]['sitys'][$idxs]['buildings'][$idxh]['fid'] = $build['fid'];
                                    $out['addr'][$idxc]['sitys'][$idxs]['buildings'][$idxh]['sid'] = $build['sid'];
                                    $out['addr'][$idxc]['sitys'][$idxs]['buildings'][$idxh]['home'] = $build['home'];
                                    $out['addr'][$idxc]['sitys'][$idxs]['buildings'][$idxh]['litera'] = $build['litera'];
                                    $out['addr'][$idxc]['sitys'][$idxs]['buildings'][$idxh]['corp'] = $build['corp'];
                                    $out['addr'][$idxc]['sitys'][$idxs]['buildings'][$idxh]['idrn'] = $build['classrn'];
                                    $out['addr'][$idxc]['sitys'][$idxs]['buildings'][$idxh]['postcode'] = $build['postcode'];

                                    $idxh++;
                                }
                            }

                            $idxs++;
                        }
                    }
                    $idxc++;
                }
            }

            $sqlr = "select * from ".$db.".classrn rn order by rn.id asc";
            $res4 = $addrbd->getResult($sqlr);
            if (!is_null($res4) && !empty($res4)) {
                foreach ($res4 as $row) {
                    $out['rayon'][] = array(
                        "id" => $row['id'],
                        "short" => $row['short'],
                        "full" => $row['full'],
                    );
                }
            }

            $sqltw = "select * from ".$db.".classtw tw order by tw.id asc";
            $res5 = $addrbd->getResult($sqltw);
            if (!is_null($res5) && !empty($res5)) {
                foreach ($res5 as $row) {
                    $out['classtw'][] = array(
                        "id" => $row['id'],
                        "short" => $row['short'],
                        "full" => $row['full'],
                    );
                }
            }

            $sqlst = "select * from ".$db.".classst st order by st.id asc";
            $res6 = $addrbd->getResult($sqlst);
            if (!is_null($res6) && !empty($res6)) {
                foreach ($res6 as $row) {
                    $out['classst'][] = array(
                        "id" => $row['id'],
                        "short" => $row['short'],
                        "full" => $row['full'],
                    );
                }
            }

            $sqlrm = "select * from ".$db.".classrm rm order by rm.id asc";
            $res7 = $addrbd->getResult($sqlrm);
            if (!is_null($res7) && !empty($res7)) {
                foreach ($res7 as $row) {
                    $out['classrm'][] = array(
                        "id" => $row['id'],
                        "short" => $row['short'],
                        "full" => $row['full'],
                    );
                }
            }
        }

        return $out;
    }

    /**
     * @param $fid
     * @param $sid
     * @param $id
     * @param $confbd
     * @param string $db
     * @return array
     */
    public static function getTechAddrsInfo($fid, $sid, $id, $confbd, $db = "gtv_billing")
    {
        $out = array("sity" => "", "tpsity" => "", "addr" => "");
        if(!empty($confbd) && (int)$fid > 0 && (int)$sid > 0 && (int)$id > 0) {
            $addrbd = new MyQueries($confbd);
            $sqls = "select con.sity,con.classtw,str.val,str.classst,hm.home,hm.corp from ".$db.".countrysity con,".$db.".streets str,".$db.".houses hm where hm.fid=".$fid." and str.id=hm.sid and str.fid=con.id and str.id=".$sid." and hm.id=".$id." limit 1";
            $res = $addrbd->getSingleResult($sqls);
            if (!is_null($res) && !empty($res)) {
                $sqltw = "select tw.full,st.full as typeob from ".$db.".classtw tw,".$db.".classst st where tw.id=".$res['classtw']." and st.id=".$res['classst']." limit 1";
                $tw = $addrbd->getSingleResult($sqltw);
                if (!is_null($tw) && !empty($tw)) {
                    $out['sity'] = $res['sity'];
                    $out['tpsity'] = $tw['full'];
                    $out['typeob'] = $tw['typeob'];
                    $out['addr'] = $res['val'];
                    if(trim($res['corp'], " ") != ""){
                        $out['addr'] .= " ".$res['home']."/".$res['corp'];
                    } else {
                        $out['addr'] .= " ".$res['home'];
                    }
                }
            }
        }

        return $out;
    }

    /**
     * @param $hid
     * @param $confbd
     * @param string $db
     * @return array
     */
    public static function getTechAddrsShow($hid, $confbd, $db = "gtv_billing")
    {
        $out = array("sity" => "", "tpsity" => "", "addr" => "");
        if(!empty($confbd) && (int)$hid > 0) {
            $addrbd = new MyQueries($confbd);
            $sqls = "select con.sity,con.classtw,str.val,str.classst,hm.home,hm.corp from ".$db.".countrysity con,".$db.".streets str,".$db.".houses hm where hm.fid=con.id and str.id=hm.sid and str.fid=con.id and hm.id=".$hid." limit 1";
            $res = $addrbd->getSingleResult($sqls);
            if (!is_null($res) && !empty($res)) {
                $sqltw = "select tw.full,st.full as typeob from ".$db.".classtw tw,".$db.".classst st where tw.id=".$res['classtw']." and st.id=".$res['classst']." limit 1";
                $tw = $addrbd->getSingleResult($sqltw);
                if (!is_null($tw) && !empty($tw)) {
                    $out['sity'] = $res['sity'];
                    $out['tpsity'] = $tw['full'];
                    $out['typeob'] = $tw['typeob'];
                    $out['addr'] = $res['val'];
                    if(trim($res['corp'], " ") != ""){
                        $out['addr'] .= " ".$res['home']."/".$res['corp'];
                    } else {
                        $out['addr'] .= " ".$res['home'];
                    }
                }
            }
        }

        return $out;
    }

    /**
     * @param $id
     * @param $confbd
     * @param string $db
     * @return array
     */
    public static function getAddrsIdxs($id, $confbd, $db = "gtv_billing")
    {
        $out = array(
            "fid" => 0,
            "sid" => 0,
            "hid" => 0,
            "strpref" => "",
            "val" => "",
            "sity" => "",
        );
        if(!empty($confbd) && (int)$id > 0) {
            $addrbd = new MyQueries($confbd);
            $sqls = "select con.sity,con.classtw,con.id as fid,str.val,str.classst,str.id as sid,hm.home,hm.corp from ".$db.".countrysity con,".$db.".streets str,".$db.".houses hm where str.id=hm.sid and hm.fid=con.id and hm.id=".$id." limit 1";
            $res = $addrbd->getSingleResult($sqls);
            if (!is_null($res) && !empty($res)) {
                $sqltw = "select tw.short as tch, st.short as sch from ".$db.".classtw tw, ".$db.".classst st where tw.id=".$res['classtw']." and st.id=".$res['classst']." limit 1";
                $tw = $addrbd->getSingleResult($sqltw);
                if (!is_null($tw) && !empty($tw)) {
                    $out['fid'] = $res['fid'];
                    $out['sid'] = $res['sid'];
                    $out['hid'] = $id;
                    $out['strpref'] = $tw['sch'];
                    $out['val'] = $res['val'];
                    if(trim($res['corp'], " ") != ""){
                        $out['val'] .= " ".$res['home']."/".$res['corp'];
                    } else {
                        $out['val'] .= " ".$res['home'];
                    }
                    $out['sity'] = $tw['tch']." ".$res['sity'];
                }
            }
        }

        return $out;
    }

    /**
     * @param $id
     * @param array $confbd
     * @param string $db
     * @param null|MyQueries $link
     * @return array
     */
    public static function getAddrsTickets($id, $confbd = array(), $db = "gtv_billing",MyQueries $link = null)
    {
        $out = array(
            "actualaddr" => '',
            "building" => '',
            "hid" => 0,
            "val" => "",
            "sity" => "",
        );
        if(!empty($confbd) && (int)$id > 0) {
            if (!is_null($link)) {
                $addrbd = $link;
            } else {
                $addrbd = new MyQueries($confbd);
            }

            $sqls = "select con.sity,con.classtw,con.id as fid,str.val,str.classst,str.id as sid,hm.home,hm.corp from ".$db.".countrysity con,".$db.".streets str,".$db.".houses hm where str.id=hm.sid and hm.fid=con.id and hm.id=".$id." limit 1";
            $res = $addrbd->getSingleResult($sqls);
            if (!is_null($res) && !empty($res)) {
                $sqltw = "select tw.short as tch, st.short as sch from ".$db.".classtw tw, ".$db.".classst st where tw.id=".$res['classtw']." and st.id=".$res['classst']." limit 1";
                $tw = $addrbd->getSingleResult($sqltw);
                if (!is_null($tw) && !empty($tw)) {
                    $out['actualaddr'] = $res['val'];
                    $out['hid'] = $id;
                    $out['val'] = $res['val'];
                    if(trim($res['corp'], " ") != ""){
                        $out['val'] .= " ".$res['home']."/".$res['corp'];
                        $out['building'] = $res['home']."/".$res['corp'];
                    } else {
                        $out['val'] .= " ".$res['home'];
                        $out['building'] = $res['home'];
                    }
                    $out['sity'] = $tw['tch']." ".$res['sity'];
                }
            }
        }

        return $out;
    }

    /**
     * @param $item
     * @return bool
     */
    public static function findNumHome($item)
    {
        $ret = false;
        if(trim($item) != ""){
            $len = strlen($item);
            if((int)$len > 0){
                if((int)substr($item,0,1) > 0){
                    $ret = true;
                }
            }
        }

        return $ret;
    }

    /**
     * @param $confs
     * @param null $link
     * @return array
     */
    public static function getMonCatList($confs, $link = null)
    {
        $out = array();
        if (!is_null($link)) {
            $bdqr = $link;
        } else {
            $curconf = [$confs['host'],$confs['db1'],$confs['login'],$confs['pass']];
            $bdqr = new MyQueries($curconf);
        }
        $sql2 = "select * from ".$confs['db1'].".listdev swcat order by swcat.id asc";
        $res2 = $bdqr->getResult($sql2);
        if (!is_null($res2) && !empty($res2)) {
            foreach($res2 as $row){
                $out[] = array(
                    "id" => $row['id'],
                    "ckey" => $row['ckey'],
                    "cval" => $row['cval'],
                );
            }
        }

        return $out;
    }

    /**
     * @param $id
     * @param $confs
     * @param null $link
     * @return array|string
     */
    public static function getMonCurrCat($id, $confs, $link = null)
    {
        $out = "";
        if((int)$id > 0) {
            if (!is_null($link)) {
                $bdqr = $link;
            } else {
                $curconf = [$confs['host'], $confs['db1'], $confs['login'], $confs['pass']];
                $bdqr = new MyQueries($curconf);
            }
            $sql2 = "select * from " . $confs['db1'] . ".listdev swcat where swcat.id=" . $id . " limit 1";
            $res2 = $bdqr->getSingleResult($sql2);
            if (!is_null($res2) && !empty($res2)) {
                $out = array(
                    "id" => $res2['id'],
                    "ckey" => $res2['ckey'],
                    "cval" => $res2['cval'],
                );
            }
        }

        return $out;
    }

    /**
     * @param $tpnr
     * @param $dayofw
     * @param int $tpsh
     * @return int
     */
    public static function getShedEnableDays($tpnr, $dayofw, $tpsh = 0)
    {
        $out = 1;
        if((int)$dayofw == 5 || (int)$dayofw == 6) {
            if ((int)$tpsh == 0) {
                if ((int)$tpnr == 1) {
                    $out = 0;
                } else {
                    if((int)$dayofw == 6){
                        $out = 0;
                    }
                }
            } else {
                if ((int)$tpnr == 1) {
                    if((int)$dayofw == 6){
                        $out = 0;
                    }
                } else if ((int)$tpnr == 2) {
                    $out = 0;
                } else if ((int)$tpnr == 3) {
                    $out = 0;
                } else if ((int)$tpnr == 4) {
                    $out = 0;
                } else if ((int)$tpnr == 5) {
                    $out = 0;
                } else {
                    $out = 0;
                }
            }
        }

        return $out;
    }

    /**
     * @param $date
     * @param $tpnr
     * @param $diap
     * @param $rn
     * @param int $tpsh
     * @return int
     */
    public static function getCurrAssignCountNaryds($date, $tpnr, $diap, $rn, $tpsh = 0)
    {
        $out = 2;
        $dtformat = "w";
        $date = new DateTime($date);
        $dayofweek = $date->format($dtformat);
        $out = self::getCurrShedFromWk($tpnr, $dayofweek, $diap, $rn, $tpsh);

        return $out;
    }

    /**
     * @param $tpnr
     * @param $weekn
     * @param $diap
     * @param $rn
     * @param int $tpsh
     * @return int
     */
    public static function getCurrShedFromWk($tpnr, $weekn, $diap, $rn, $tpsh = 0)
    {
        $out = 2;
        if((int)$tpsh == 0){
            if ((int)$tpnr == 1) {
                if((int)$weekn == 5 || (int)$weekn == 6) {
                    $out = 0;
                } else {
                    if((int)$diap == 3){
                        $out = 0;
                    } else {
                        $out = 2;
                    }
                }
            } else {
                if((int)$weekn == 6){
                    $out = 0;
                } else {
                    if((int)$diap == 3){
                        $out = 0;
                    } else {
                        $out = 2;
                    }
                }
            }
        } else {
            if ((int)$tpnr == 1) {
                if((int)$weekn == 5 || (int)$weekn == 6){
                    $out = 0;
                } else {
                    if((int)$diap == 1){
                        if((int)$rn == 2){
                            $out = 9;
                        } else {
                            $out = 3;
                        }
                    } else if((int)$diap == 2){
                        if((int)$rn == 2) {
                            $out = 6;
                        } else {
                            $out = 2;
                        }
                    } else {
                        $out = 0;
                    }
                }
            } else if((int)$tpnr == 2){
                if((int)$weekn == 5 || (int)$weekn == 6){
                    $out = 0;
                } else {
                    if((int)$diap == 1){
                        if((int)$rn == 2){
                            $out = 3;
                        } else {
                            $out = 1;
                        }
                    } else if((int)$diap == 2){
                        if((int)$rn == 2) {
                            $out = 3;
                        } else {
                            $out = 1;
                        }
                    } else {
                        $out = 0;
                    }
                }
            } else if((int)$tpnr == 3){
                if((int)$weekn == 5 || (int)$weekn == 6){
                    $out = 0;
                } else {
                    if((int)$diap == 1){
                        if((int)$rn == 2){
                            $out = 9;
                        } else {
                            $out = 3;
                        }
                    } else if((int)$diap == 2){
                        if((int)$rn == 2) {
                            $out = 6;
                        } else {
                            $out = 2;
                        }
                    } else {
                        $out = 0;
                    }
                }
            } else if((int)$tpnr == 4){
                if((int)$weekn == 5 || (int)$weekn == 6){
                    $out = 0;
                } else {
                    if((int)$diap == 1){
                        if((int)$rn == 2){
                            $out = 3;
                        } else {
                            $out = 1;
                        }
                    } else if((int)$diap == 2){
                        if((int)$rn == 2) {
                            $out = 3;
                        } else {
                            $out = 1;
                        }
                    } else {
                        $out = 0;
                    }
                }
            } else if((int)$tpnr == 5){
                if((int)$weekn == 5 || (int)$weekn == 6){
                    $out = 0;
                } else {
                    if((int)$diap == 1){
                        if((int)$rn == 2){
                            $out = 9;
                        } else {
                            $out = 3;
                        }
                    } else if((int)$diap == 2){
                        if((int)$rn == 2) {
                            $out = 6;
                        } else {
                            $out = 2;
                        }
                    } else {
                        $out = 0;
                    }
                }
            } else if((int)$tpnr == 6){
                if((int)$weekn == 5 || (int)$weekn == 6){
                    $out = 0;
                } else {
                    if((int)$diap == 1){
                        if((int)$rn == 2){
                            $out = 3;
                        } else {
                            $out = 1;
                        }
                    } else if((int)$diap == 2){
                        if((int)$rn == 2) {
                            $out = 3;
                        } else {
                            $out = 1;
                        }
                    } else {
                        $out = 0;
                    }
                }
            } else if((int)$tpnr == 7){
                if((int)$weekn == 5 || (int)$weekn == 6){
                    $out = 0;
                } else {
                    if((int)$diap == 1){
                        if((int)$rn == 2){
                            $out = 3;
                        } else {
                            $out = 1;
                        }
                    } else if((int)$diap == 2){
                        if((int)$rn == 2) {
                            $out = 3;
                        } else {
                            $out = 1;
                        }
                    } else {
                        $out = 0;
                    }
                }
            } else if((int)$tpnr == 8){
                if((int)$weekn == 5 || (int)$weekn == 6){
                    $out = 0;
                } else {
                    if((int)$diap == 1){
                        if((int)$rn == 2){
                            $out = 3;
                        } else {
                            $out = 1;
                        }
                    } else if((int)$diap == 2){
                        if((int)$rn == 2) {
                            $out = 3;
                        } else {
                            $out = 1;
                        }
                    } else {
                        $out = 0;
                    }
                }
            } else {
                if((int)$weekn == 5 || (int)$weekn == 6){
                    $out = 0;
                } else {
                    if((int)$diap == 1){
                        if((int)$rn == 2){
                            $out = 3;
                        } else {
                            $out = 1;
                        }
                    } else if((int)$diap == 2){
                        if((int)$rn == 2) {
                            $out = 3;
                        } else {
                            $out = 1;
                        }
                    } else {
                        $out = 0;
                    }
                }
            }
        }

        return $out;
    }

    /**
     * @param $bkid
     * @param $confs
     * @param $tbl
     * @param MyQueries $link
     * @return array
     */
    public static function getParseBanks($bkid, $confs, $tbl, $link)
    {
        $out = array(
            "id" => 0,
            "bkbik" => '',
            "bkname" => '',
            "bkkor" => '',
            "bksity" => '',
        );
        if((int)$bkid > 0 && trim($tbl, " ") != "" && !empty($confs) && !is_null($link)){
            $sql = "select bk.*,cbk.name as city from ".$tbl.".banks bk,".$tbl.".citybanks cbk where bk.sid=cbk.id and bk.id=".$bkid." limit 1";
            $row = $link->getSingleResult($sql);
            if(!is_null($row) && !empty($row)){
                $out['id'] = $row['id'];
                $out['bkbik'] = $row['bik'];
                $out['bkname'] = $row['name'];
                $out['bkkor'] = $row['kors'];
                $out['bksity'] = $row['city'];
            }
        }

        return $out;
    }

    /**
     * @param $valflt
     * @param $confbd
     * @return array
     */
    public static function getFindUsers($valflt, $confbd)
    {
        $out = array();
        if(trim($valflt, " ") != "" && !empty($confbd)){
            $bdqr = new MyQueries($confbd);

            $findstr = self::clearFindString($valflt);
            $mach = $bdqr->createSqlStrings($findstr);
            $cnt = count($mach);
            $user = "";
            for($i=0;$i<$cnt;$i++) {
                if($i == 0) {
                    $user = "us.descr like '%".$mach[$i]."%'";
                } else {
                    $user .= " and us.descr like '%".$mach[$i]."%'";
                }
            }
            if(trim($user, " ") != ""){
                $sql = "select us.id from ".$confbd[1].".users us where ".$user." order by us.descr asc";
                $res = $bdqr->getResult($sql);
                //$out['debug'] = $res;
                if(!is_null($res) && !empty($res)){
                    foreach($res as $row){
                        $out[] = $row['id'];
                    }
                }
            }
        }

        return $out;
    }

    /**
     * @param $uid
     * @param $confbd
     * @return string
     */
    public static function getUserInfo($uid, $confbd)
    {
        $out = " ";
        if((int)$uid > 0 && !empty($confbd)){
            $bdqr = new MyQueries($confbd);
            $sql = "select us.descr from ".$confbd[1].".users us where us.id=".$uid." limit 1";
            $row = $bdqr->getSingleResult($sql);
            if(!is_null($row) && !empty($row)){
                $out = $row['descr'];
            } else {
                $out = "Не определен № ".$uid."";
            }
        }

        return $out;
    }

    /**
     * @param array $confbd
     * @param array $modconf
     * @param string $db
     * @param null $modlink
     * @return array
     */
    public static function getMastersInfo($confbd = array(), $modconf = array(), $db = "gtv_billing", $modlink = null)
    {
        $out = array();
        if(!empty($confbd) && !empty($modconf)){
            if (!is_null($modlink)) {
                $bdqr = $modlink;
            } else {
                $curconf = [$modconf['host'], $modconf['db2'], $modconf['login'], $modconf['pass']];
                $bdqr = new MyQueries($curconf);
            }
            $sql = "select * from ".$db.".masters as mst order by mst.id asc";
            $res = $bdqr->getResult($sql);
            if(!is_null($res) && !empty($res)){
                foreach($res as $row){
                    $out[] = array(
                        "id" => $row['id'],
                        "mid" => $row['mid'],
                        "name" => self::getUserInfo($row['mid'],$confbd),
                    );
                }
            }
        }

        return $out;
    }

    /**
     * @param $uid
     * @param string $db
     * @param array $confs
     * @param null $link
     * @return array
     */
    public static function getUserTariffName($uid, $db = "gtv_utm5base", $confs = array(), $link = null)
    {
        $out = array(
            "tarid" => 0,
            "tarname" => '',
        );
        if((int)$uid > 0 && !empty($confs)){
            if (!is_null($link)) {
                $bdqr = $link;
            } else {
                $curconf = [$confs['host'], $confs['db1'], $confs['login'], $confs['pass']];
                $bdqr = new MyQueries($curconf);
            }

            $sql = "select tr.id,tr.name from ".$db.".users_accounts as uac,".$db.".account_tariff_link as atl,".$db.".tariffs as tr where uac.is_deleted=0 and atl.is_deleted=0 and tr.is_deleted=0 and uac.account_id=atl.account_id and atl.tariff_id=tr.id and uac.uid=".$uid." limit 1";
            $row = $bdqr->getSingleResult($sql);
            if(!is_null($row) && !empty($row)){
                $out['tarid'] = $row['id'];
                $out['tarname'] = $row['name'];
            }
        }

        return $out;
    }

    /**
     * @param $uid
     * @param $tdog
     * @param string $db
     * @param array $confs
     * @param null $link
     * @return array
     */
    public static function getNumDogToNaryad($uid, $tdog, $db = "gtv_utm5base", $confs = array(), $link = null)
    {
        $out = array(
            "ktv" => '',
            "spd" => '',
        );
        if((int)$uid > 0 && (int)$tdog > 0 && !empty($confs)) {
            if (!is_null($link)) {
                $bdqr = $link;
            } else {
                $curconf = [$confs['host'], $confs['db1'], $confs['login'], $confs['pass']];
                $bdqr = new MyQueries($curconf);
            }

            if((int)$tdog == 1){
                $param = 1;
            } else if((int)$tdog == 2){
                $param = 2;
            } else {
                $param = 3;
            }

            if($param<3) {
                $sql = "select uap.value as dog from " . $db . ".user_additional_params as uap where uap.userid=" . $uid . " and uap.paramid=" . $param . " limit 1";
                $row = $bdqr->getSingleResult($sql);
                if (!is_null($row) && !empty($row)) {
                    if($param == 1) {
                        $out['ktv'] = $row['dog'];
                    }
                    if($param == 2) {
                        $out['spd'] = $row['dog'];
                    }
                }
            } else {
                $sql = "select uap.value as dog,uap.paramid as parid from " . $db . ".user_additional_params as uap where uap.userid=" . $uid . " and (uap.paramid=1 or uap.paramid=2) order by uap.paramid asc";
                $res = $bdqr->getResult($sql);
                if (!is_null($res) && !empty($res)) {
                    foreach($res as $row) {
                        if ((int)$row['parid'] == 1) {
                            $out['ktv'] = $row['dog'];
                        }
                        if ((int)$row['parid'] == 2) {
                            $out['spd'] = $row['dog'];
                        }
                    }
                }
            }
        }

        return $out;
    }

    /**
     * @param $ls
     * @param $inaddr
     * @param $tdog
     * @param array $confs
     * @param null|MyQueries $link
     * @param null|ModLogger $loggers
     * @return array
     */
    public static function getNumDogToNaryadApps($ls, $inaddr, $tdog, $confs = array(),MyQueries $link = null,ModLogger $loggers = null)
    {
        $out = array(
            "ktv" => '',
            "spd" => '',
        );
        if ((int)$ls > 0 && (int)$tdog > 0 && !empty($confs) && !empty($inaddr)) {
            if (!is_null($link)) {
                $bdqr = $link;
            } else {
                $curconf = [$confs['host'], $confs['db1'], $confs['login'], $confs['pass']];
                $bdqr = new MyQueries($curconf);
            }

            $lss = $ls;
            $trys = preg_replace("\"/\s/\"","",$ls);
            $strLength = iconv_strlen($trys, 'UTF-8');
            $shag = 6-(int)$strLength;
            for($sh=0;$sh<$shag;$sh++){
                $lss = '0'.$lss;
            }

            $logidx = '01';

            $fsql = "select uap.userid as uid,us.login as logutm from ".$confs['db1'].".user_additional_params as uap,".$confs['db1'].".users as us where uap.userid=us.id and (concat(us.actual_address,',',us.building,',',us.flat_number) like '%" . $inaddr['street'].','.$inaddr['building'].','.$inaddr['flat']."%') and us.full_name like '".$inaddr['abon']."' and uap.paramid=3 and uap.value like '".$ls."' order by us.id asc";
            $fres = $bdqr->getResult($fsql);
            if (!is_null($loggers)) {
                $loggers->getLogger()->debug("show find user params", [$fsql]);
            }
            if(!is_null($fres) && !empty($fres)) {
                foreach($fres as $frow) {
                    $curapp = explode("-",$frow['logutm']);
                    if(count($curapp) == 2){
                        $logidx = $curapp[1];
                    }

                    /*if ((int)$tdog == 1) {
                        $param = "SELECT * FROM " . $confs['db1'] . ".user_additional_params AS uap WHERE uap.paramid=1 AND uap.userid=" . $frow['uid'] . " ORDER BY uap.value ASC";
                    } else if ((int)$tdog == 2) {
                        $param = "SELECT * FROM " . $confs['db1'] . ".user_additional_params AS uap WHERE uap.paramid=2 AND uap.userid=" . $frow['uid'] . " ORDER BY uap.value ASC";
                    } else {
                        $param = "SELECT * FROM " . $confs['db1'] . ".user_additional_params AS uap WHERE (uap.paramid=1 OR uap.paramid=2) AND uap.userid=" . $frow['uid'] . " ORDER BY uap.paramid ASC";
                    }
                    if (!is_null($loggers)) {
                        $loggers->getLogger()->debug("show uap params", [$param]);
                        $loggers->getLogger()->debug("in addr params", [$inaddr]);
                    }

                    $res = $bdqr->getResult($param);
                    if (!is_null($res) && !empty($res)) {
                        foreach ($res as $row) {*/
                            if ((int)$tdog == 1) {
                                if (trim($out['ktv'], " ") == '') {
                                    $out['ktv'] = '1-'.$lss.'-'.$logidx;
                                }
                            } else if ((int)$tdog == 2) {
                                if (trim($out['spd'], " ") == '') {
                                    $out['spd'] = '2-'.$lss.'-'.$logidx;
                                }
                            } else {
                                if (trim($out['ktv'], " ") == '') {
                                    $out['ktv'] = '1-'.$lss.'-'.$logidx;
                                }
                                if (trim($out['spd'], " ") == '') {
                                    $out['spd'] = '2-'.$lss.'-'.$logidx;
                                }
                            }
                     /*   }
                    }*/

                    if((int)$tdog == 1){
                        if (trim($out['ktv'], " ") != '') {
                            break;
                        }
                    } else if((int)$tdog == 2){
                        if (trim($out['spd'], " ") != '') {
                            break;
                        }
                    } else {
                        if (trim($out['ktv'], " ") != '' && trim($out['spd'], " ") != '') {
                            break;
                        }
                    }
                }
                if ((int)$tdog == 1) {
                    if (trim($out['ktv'], " ") == '') {
                        $out['ktv'] = "1-".$lss."-".$logidx;
                    }
                } else if((int)$tdog == 2) {
                    if (trim($out['spd'], " ") == '') {
                        $out['spd'] = "2-".$lss."-".$logidx;
                    }
                } else {
                    if (trim($out['ktv'], " ") == '') {
                        $out['ktv'] = "1-".$lss."-".$logidx;
                    }
                    if (trim($out['spd'], " ") == '') {
                        $out['spd'] = "2-".$lss."-".$logidx;
                    }
                }
            } else {
                if((int)$tdog == 1){
                    $out['ktv'] = "1-".$lss."-".$logidx;
                } else if((int)$tdog == 2){
                    $out['spd'] = "2-".$lss."-".$logidx;
                } else {
                    $out['ktv'] = "1-".$lss."-".$logidx;
                    $out['spd'] = "2-".$lss."-".$logidx;
                }
            }
        }

        return $out;
    }

    /**
     * @param $ls
     * @param $inaddr
     * @param $tdog
     * @param array $confs
     * @param MyQueries|null $link
     * @param ModLogger|null $loggers
     * @return string
     */
    public static function setIdxDogNums($ls, $inaddr, $tdog, $confs = array(), MyQueries $link = null, ModLogger $loggers = null)
    {
        $ret = '01';
        if ((int)$ls > 0 && (int)$tdog > 0 && !empty($confs) && !empty($inaddr)) {
            if (!is_null($link)) {
                $bdqr = $link;
            } else {
                $curconf = [$confs['host'], $confs['db1'], $confs['login'], $confs['pass']];
                $bdqr = new MyQueries($curconf);
            }



        }

        return $ret;
    }

    /**
     * @param $id
     * @return string
     */
    public static function getCurrencyName($id)
    {
        switch((int)$id){
            case 810:
                $out = 'руб.';
                break;
            case 840:
                $out = 'доллар.';
                break;
            case 978:
                $out = 'евро.';
                break;

            default:
                $out = 'руб.';
        }

        return $out;
    }

    /**
     * @param int $tpnr
     * @param array $confs
     * @param MyQueries|null $link
     * @return string
     */
    public static function getNameTypeNaryad($tpnr=0, $confs = [], MyQueries $link = null)
    {
        $out = '';
        if(!empty($confs) && (int)$tpnr > 0) {
            if (!is_null($link)) {
                $bdqr = $link;
            } else {
                $curconf = [$confs['host'], $confs['db2'], $confs['login'], $confs['pass']];
                $bdqr = new MyQueries($curconf);
            }

            $sql = "select nr.names from ".$confs['db2'].".abcatnar as nr where nr.keytype=".(int)$tpnr." limit 1";
            $row = $bdqr->getSingleResult($sql);
            if (!is_null($row) && !empty($row)) {
                $out = $row['names'];
            }
        }

        return $out;
    }

    /**
     * @param $logname
     * @return mixed
     */
    public static function getLogs($logname)
    {
        $pathlog = __DIR__."/../../app/logs";
        ModLog::$PATH = $pathlog;
        return ModLog::getLogger($logname,$logname.".log");
    }
}