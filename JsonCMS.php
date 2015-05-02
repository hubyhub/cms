<?php
/**
 * User: manfred
 * Date: 07.04.2015
 * Time: 22:00
 */

class JsonCMS
{
    private $variable;

    function __construct() {
       $this->variable = 1;
    }
    
    public function whatever(){
        
    }

    public function helloWorld()
    {
        echo( 'Hello World' . $this->variable );
    }

}


$obj = new JsonCMS();
$obj->helloWorld();

