<?php
namespace Piwik\Plugins\AwesomeShortcuts;

class AwesomeShortcuts extends \Piwik\Plugin {

    /**
     * @see Piwik\Plugin::getListHooksRegistered
     */
    public function getListHooksRegistered()
    {
        return array(
            'AssetManager.getJavaScriptFiles'  => 'getJsFiles',
            'AssetManager.getStylesheetFiles'  => 'getCssFiles',
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