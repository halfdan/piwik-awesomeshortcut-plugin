<?php

namespace Piwik\Plugins\AwesomeShortcuts;

class API {
    private static $instance = null;

    /**
     * @return \Piwik\Plugins\AwesomeShortcuts\API
     */
    public static function getInstance()
    {
        if (self::$instance == null) {
            self::$instance = new self;
        }
        return self::$instance;
    }

    public function getMenu() {
        $menu = \Piwik\Menu\Main::getInstance()->get();

        $func = function($menu) use (&$func) {
            $result = array();
            foreach($menu as $key => $item) {
                if(strpos($key, '_') === 0) {
                    continue;
                }

                $result[$key] = array(
                    'submenu' => $func($item),
                    '_url' => $item['_url'],
                    '_name' => Piwik_Translate($key)
                );
            }
            return $result;
        };

        return $func($menu);
    }
}
