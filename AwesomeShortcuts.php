<?php
namespace Piwik\Plugins\AwesomeShortcuts;

class AwesomeShortcuts extends \Piwik\Plugin {

    /**
     * @see Piwik\Plugin::getInformation
     */
    public function getInformation()
    {
        return array(
            'description'     => Piwik_Translate("AwesomeShortcuts_PluginDescription"),
            'author'          => 'Fabian Becker',
            'author_homepage' => 'http://geekproject.eu',
            'version'         => '1.0.0',
        );
    }

    /**
     * @see Piwik\Plugin::getListHooksRegistered
     */
    public function getListHooksRegistered()
    {
        return array(
            'AssetManager.getJsFiles'  => 'getJsFiles',
            'AssetManager.getCssFiles'  => 'getCssFiles',
        );
    }

    public function getJsFiles(&$jsFiles)
    {
        $jsFiles[] = 'plugins/AwesomeShortcuts/javascripts/shortcuts.js';
    }

    public function getCssFiles(&$cssFiles)
    {
        $cssFiles[] = 'plugins/AwesomeShortcuts/stylesheets/shortcuts.less';
    }
}