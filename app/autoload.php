<?php
/**
 * Created by PhpStorm.
 * User: zevs5
 * Date: 03.11.2016
 * Time: 19:16
 */

use Doctrine\Common\Annotations\AnnotationRegistry;
use Composer\Autoload\ClassLoader;

$loader = require __DIR__.'/../vendor/autoload.php';
/*require_once(__DIR__."/AppKernel.php");

$dir = __DIR__."/Class";

foreach( scandir( $dir . "/" ) as $v ){
    (substr( $v, (count( $v ) - 5), 4 ) == '.php'  ? require_once $dir . "/" . $v : '');
}*/

AnnotationRegistry::registerLoader(array($loader, 'loadClass'));
return $loader;