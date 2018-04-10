<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 25.06.2017
 * Time: 6:22
 */

namespace Systems;


class ModLog
{
    public static $PATH;
    protected static $loggers=array();

    protected $name;
    protected $file;
    protected $fp;

    /**
     * @param $params
     * @return string
     */
    private function setJoinMess($params)
    {
        $out = "";
        if(!empty($params)){
            foreach($params as $param){
                if(trim($out, " ") != ""){
                    $out .= "\n";
                }
                if(!is_string($param)){
                    $out .= print_r($param,true);
                } else {
                    $out .= $param;
                }
            }
        }
        return $out;
    }

    /**
     * Logs constructor.
     * @param $name
     * @param null $file
     */
    public function __construct($name, $file=null){
        $this->name=$name;
        $this->file=$file;
        $this->open();
    }

    /**
     *
     */
    public function open(){
        if(self::$PATH==null){
            return ;
        }
        $this->fp=fopen($this->file==null ? self::$PATH.'/'.$this->name.'.log' : self::$PATH.'/'.$this->file,'a+');
    }

    /**
     * @param string $name
     * @param null $file
     * @return mixed
     */
    public static function getLogger($name='root', $file=null){
        if(!isset(self::$loggers[$name])){
            self::$loggers[$name]=new ModLog($name, $file);
        }

        return self::$loggers[$name];
    }

    /**
     * @param $message
     */
    public function log($message){
        if(!is_string($message)){
            $this->logPrint($message);
            return ;
        }
        $log='';
        $log.='['.date('D M d H:i:s Y',time()).'] '."\n";
        if(func_num_args()>1){
            $params=func_get_args();
            $message= $this->setJoinMess($params);//call_user_func_array('sprintf',$params);
        }
        $log.=$message."\n--------------------------------------------------------------------";
        $log.="\n";
        $this->_write($log);
    }

    /**
     * @param $obj
     */
    public function logPrint($obj){
        $ob = print_r($obj,true);
        $this->log($ob);
    }

    /**
     * @param $string
     */
    protected function _write($string){
        fwrite($this->fp, $string);
    }

    /**
     *
     */
    public function __destruct(){
        if(!is_null($this->fp)) {
            fclose($this->fp);
        }
    }
}