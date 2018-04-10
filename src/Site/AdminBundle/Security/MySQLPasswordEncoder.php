<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 04.11.2016
 * Time: 22:03
 */

namespace Site\AdminBundle\Security;

use Symfony\Component\Security\Core\Encoder\BasePasswordEncoder;

class MySQLPasswordEncoder extends BasePasswordEncoder
{
    public function encodePassword($raw, $salt)
    {
        return $this->doEncode($raw);
    }

    public function isPasswordValid($encoded, $raw, $salt)
    {
        $pass = $this->doEncode($raw);

        return $this->comparePasswords($encoded, $pass);
    }

    protected function doEncode($input)
    {
        $sha_stage1 = sha1($input,true);
        $output = sha1($sha_stage1,false);
        return "*".strtoupper($output);
    }
}