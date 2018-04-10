<?php

namespace Site\AdminBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\AdvancedUserInterface;

/**
 * Admins
 */
class Admins implements AdvancedUserInterface, \Serializable
{
    /**
     * @var integer
     */
    private $id;

    /**
     * @var string
     */
    private $login;

    /**
     * @var string
     */
    private $passwd;

    /**
     * @var string
     */
    private $username;

    /**
     * @var integer
     */
    private $activ = true;

    /**
     * @var string
     */
    private $salt;

    /**
     *
     */
    private $role;


	private $userRoles;

    private $fusers = array();

    /**
     * Admins constructor.
     */
    public function __construct()
    {
        $this->userRoles = new ArrayCollection();
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set login
     *
     * @param string $login
     *
     * @return Admins
     */
    public function setLogin($login)
    {
        $this->login = $login;

        return $this;
    }
	
    public function setUsername($login)
    {
        $this->login = $login;

        return $this;
    }

    /**
     * Get login
     *
     * @return string
     */
    public function getUsername()
    {
        return $this->login;
    }
	
    public function getLogin()
    {
        return $this->login;
    }

    /**
     * Set passwd
     *
     * @param string $passwd
     *
     * @return Admins
     */
    public function setPasswd($passwd)
    {
        $this->passwd = $passwd;

        return $this;
    }
	
	 public function setPassword($passwd)
    {
        $this->passwd = $passwd;

        return $this;
    }

    /**
     * Get passwd
     *
     * @return string
     */
    public function getPasswd()
    {
        return $this->passwd;
    }

    /**
     * @return string
     */
    public function getPassword()
    {
        return $this->passwd;
    }

    /**
     * Set username
     *
     * @param string $username
     *
     * @return Admins
     */
    public function setUseradmin($username)
    {
        $this->username = $username;

        return $this;
    }

    /**
     * Get username
     *
     * @return string
     */
    public function getUseradmin()
    {
        return $this->username;
    }

    /**
     * Set activ
     *
     * @param integer $activ
     *
     * @return Admins
     */
    public function setActiv($activ)
    {
        $this->activ = $activ;

        return $this;
    }

    /**
     * Get activ
     *
     * @return integer
     */
    public function getActiv()
    {
        return $this->activ;
    }

    /**
     * @param $activ
     * @return $this
     */
    public function setIsactive($activ)
    {
        $this->activ = $activ;

        return $this;
    }

    /**
     * Get isactive
     *
     * @return boolean
     */
    public function getIsactive()
    {
        return $this->activ;
    }

    /**
     * Set salt
     *
     * @param string $salt
     *
     * @return Admins
     */
    public function setSalt($salt)
    {
        $this->salt = $salt;

        return $this;
    }

    /**
     * Get salt
     *
     * @return string
     */
    public function getSalt()
    {
        return $this->salt;
    }

    /**
     * Set role
     *
     * @param string $role
     *
     * @return Admins
     */
    public function setRole($role = null)
    {
        $this->role = $role;

        return $this;
    }

    /**
     * Get role
     *
     * @return string
     */
    public function getRole()
    {
        return $this->role;
    }

    /**
     * @return array
     */
    public function getRoles()
    {
		return  array( 0 => $this->getRole());
    }

    /**
     * @return ArrayCollection
     */
    public function getUserRoles()
    {
        return $this->userRoles;
    }

    /**
     *
     */
    public function eraseCredentials()
    {
    }

    /**
     * @param Admins $user
     * @return bool
     */
    public function equals(Admins $user)
	{
		return $user->getUsername() == $this->getUsername();
	}

    /**
     * @return int
     */
    public function isEnabled()
    {
        return $this->activ;
    }
	
	// Advansed methods

    /**
     * @return bool
     */
    public function isAccountNonExpired()
    {
        return true;
    }

    /**
     * @return bool
     */
    public function isAccountNonLocked()
    {
		if($this->getIsactive()==0){
			return false;
		} else {
        	return true;
		}
    }

    /**
     * @return bool
     */
    public function isCredentialsNonExpired()
    {
        return true;
    }

    /**
     * @return string
     */
    public function serialize()
    {
        return serialize(array(
            $this->id,
            $this->login,
            $this->passwd,
			$this->activ,
			$this->username,
            // see section on salt below
            // $this->salt,
        ));
    }

    /** @see \Serializable::unserialize() */
    public function unserialize($serialized)
    {
        list (
            $this->id,
            $this->login,
            $this->passwd,
			$this->activ,
			$this->username,
            // see section on salt below
            // $this->salt
        ) = unserialize($serialized);
    }

    /**
     * @return array
     */
    public function getFUser()
    {
        $this->fusers = array(
            "id" => $this->getId(),
            "login" => $this->getLogin(),
            "activ" => $this->getActiv(),
            "username" => $this->getUseradmin(),
            "role" => $this->getRole()->getRole(),
        );

        return $this->fusers;
    }

    /**
     * @param int $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }
}
