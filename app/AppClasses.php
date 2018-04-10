<?php

/**
 * Created by PhpStorm.
 * User: zevs5
 * Date: 04.11.2016
 * Time: 0:03
 */
class AppClasses
{
    /**
     *
     */
    public static function LoadClasses(){
        $dir = __DIR__."/../modules";
        foreach( scandir( $dir . "/" ) as $v ){
            if(substr( $v, (count( $v ) - 5), 4 ) == '.php'){
                require_once($dir . "/" . $v);
            }
        }
    }

    public static function LoadNamespace(){
        $bundles = array();
        $dir = __DIR__."/../funct/Systems";
        foreach( scandir( $dir . "/" ) as $v ) {
            if (substr($v, (count($v) - 5), 4) == '.php') {
                $strs = 'Systems\\'.substr($v, 0, (count($v) - 5)).'()';
                $bundles[] = $strs;
            }
        }
        return $bundles;
    }
}