<?php
namespace TYPO3\Neos\ViewHelpers\Backend;

/*
 * This file is part of the TYPO3.Neos package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\I18n\Locale;
use TYPO3\Flow\I18n\Translator;
use TYPO3\Flow\Security\AccountRepository;
use TYPO3\Flow\Security\Context;
use TYPO3\Fluid\Core\ViewHelper\AbstractViewHelper;
use TYPO3\Neos\Domain\Model\User;
use TYPO3\Party\Domain\Model\Person;

/**
 * Render user initials for a given username
 *
 * This ViewHelper is *WORK IN PROGRESS* and *NOT STABLE YET*
 */
class UserInitialsViewHelper extends AbstractViewHelper
{
    /**
     * @Flow\Inject
     * @var AccountRepository
     */
    protected $accountRepository;

    /**
     * @Flow\Inject
     * @var Context
     */
    protected $securityContext;

    /**
     * @Flow\Inject
     * @var Translator
     */
    protected $translator;

    /**
     * @Flow\InjectConfiguration("userInterface.defaultLanguage")
     * @var string
     */
    protected $defaultLanguageIdentifier;

    /**
     * Render user initials or an abbreviated name for a given username. If the account was deleted, use the username as fallback.
     *
     * @param string $format Supported are "fullFirstName" and "initials"
     * @return string
     */
    public function render($format = 'initials')
    {
        if (!in_array($format, array('fullFirstName', 'initials', 'fullName'))) {
            throw new \InvalidArgumentException(sprintf('Format "%s" given to history:userInitials(), only supporting "fullFirstName", "initials" and "fullName".', $format), 1415705861);
        }

        $accountIdentifier = $this->renderChildren();

        // TODO: search by credential source is still needed
        /* @var $account \TYPO3\Flow\Security\Account */
        $account = $this->accountRepository->findOneByAccountIdentifier($accountIdentifier);

        if ($account === null) {
            return $accountIdentifier;
        }

        /* @var $requestedUser Person */
        $requestedUser = $account->getParty();

        if ($requestedUser === null || $requestedUser->getName() === null) {
            return $accountIdentifier;
        }

        if ($this->securityContext->canBeInitialized()) {
            if ($this->securityContext->getAccount()) {
                /** @var User $currentUser */
                $currentUser = $this->securityContext->getAccount()->getParty();
                if ($currentUser === $requestedUser) {
                    $languageIdentifier = $currentUser->getPreferences()->get('interfaceLanguage') ? $currentUser->getPreferences()->get('interfaceLanguage') : $this->defaultLanguageIdentifier;
                    $you = $translation = $this->translator->translateById('you', array(), 1, new Locale($languageIdentifier), 'Main', 'TYPO3.Neos');
                }
            }
        }

        switch ($format) {
            case 'initials':
                return mb_substr($requestedUser->getName()->getFirstName(), 0, 1) . mb_substr($requestedUser->getName()->getLastName(), 0, 1);
            case 'fullFirstName':
            return isset($you) ? $you : $requestedUser->getName()->getFirstName() . ' ' . mb_substr($requestedUser->getName()->getLastName(), 0, 1) . '.';
            case 'fullName':
                return isset($you) ? $you : $requestedUser->getName()->getFullName();
        }
    }
}
