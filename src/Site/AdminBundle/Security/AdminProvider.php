<?php
// Site/AdminBundle/Security/AdminProvider.php

namespace Site\AdminBundle\Security;

use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\HttpFoundation\RequestStack;
use Systems\MyQueries;
use Site\AdminBundle\Entity\Admins;

class AdminProvider implements UserProviderInterface
{
	private $request;
	
	private $sesslf;

    private $connarr;

    private $loctmp = array(
        "host" => "localhost",
        "base" => "base",
        "user" => "root",
        "pass" => "",
    );

    protected $logger;

    public function __construct()
    {
        $this->connarr = (object)$this->loctmp;
    }

    public function setRequest(RequestStack $request_stack, $sesslf, $connbd)
    {
        $this->request = $request_stack->getCurrentRequest();
        $this->sesslf = $sesslf;
        //$this->logger = $logger;
        if(!empty($connbd)) {
            $loccon = array(
                "host" => $connbd[0],
                "base" => $connbd[1],
                "user" => $connbd[2],
                "pass" => $connbd[3],
            );
            $this->connarr = (object)$loccon;
        }
    }
	
	public function loadUserByUsername($username = '')
    {
        if (empty($username)) {
            throw new UsernameNotFoundException('Username is empty.');
        }

        $sqls = new MyQueries($this->connarr,true);
        $str = "select * from ".$this->connarr->base.".users where ".$this->connarr->base.".users.userr = '".$username."' limit 1";
        $r = $sqls->GetSingleResult($str);
        if($r['activ'] == 1){
            throw new UsernameNotFoundException('User is blocked by the Administrator.');
        }
        $this->checksSess();

        //$this->logger->debug("-- ".print_r($r,true)." --");

        $user = new Admins();
        $user->setId($r['id']);
        $user->setUseradmin($r['descr']);
        $user->setUsername($r['userr']);
        $user->setRole($r['role']);
        $user->setPassword($r['passwd']);
        return $user;
    }

    public function refreshUser(UserInterface $user)
    {
          $class = get_class($user);
          if (!$user instanceof $class) {
              throw new UnsupportedUserException(
                  sprintf(
                      'Instances of "%s" are not supported.',
                      $class
                  )
              );
          }
		  return $this->loadUserByUsername( $user->getUsername() );
    }

    public function supportsClass( $class )
    {
        return $class === 'Site\\AdminBundle\\Entity\\Admins';
    }

	private function checksSess()
	{
		$session = $this->request->getSession();
		$stores = $session->get('panel_data', array());
		
		if(empty($stores))
		{
		$store = array(
		'userip' => $this->request->getClientIp(),
		'starttime' => time(),
		'expires' => $this->sesslf,
		);
			array_push($stores,$store);
			$session->set('panel_data', array_slice($stores, 0, 1));
		} else {
			$store = $stores[0];
			if(!isset($store['starttime']) || !isset($store['userip']) || !isset($store['expires'])){
				$store = array(
				'userip' => $this->request->getClientIp(),
				'starttime' => time(),
				'expires' => $this->sesslf,
				);
				$session->set('panel_data', array_slice($store, 0, 1));
			}
		}
			
			return;
	}
	

}
