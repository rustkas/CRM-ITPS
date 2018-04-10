<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 22.11.2016
 * Time: 10:43
 */

namespace Systems;

use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Handler\FirePHPHandler;

class ModLogger
{
    private $logger;

    /**
     * ModLogger constructor.
     * @param $lname
     * @param string $mfile
     */
    public function __construct($lname,$mfile = '')
    {
        if(trim($mfile) == ""){
            $mfile = 'module';
        }
        $this->logger = new Logger($lname);
        $this->logger->pushHandler(new StreamHandler(dirname(__FILE__)."/../../app/logs/".$mfile.".log", Logger::DEBUG));
        $this->logger->pushHandler(new FirePHPHandler());
    }

    /**
     * @return mixed
     */
    public function getLogger()
    {
        return $this->logger;
    }
}