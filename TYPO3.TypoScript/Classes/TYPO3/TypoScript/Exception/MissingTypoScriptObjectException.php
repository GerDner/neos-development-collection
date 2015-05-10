<?php
namespace TYPO3\TypoScript\Exception;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "TypoScript".            *
 *                                                                        *
 * It is free software; you can redistribute it and/or modify it under    *
 * the terms of the GNU General Public License, either version 3 of the   *
 * License, or (at your option) any later version.                        *
 *                                                                        *
 * The TYPO3 project - inspiring people to share!                         *
 *                                                                        */

/**
 * This exception is thrown if the the object type for a given TypoScript path
 * could not be determined, f.e. if the user forgets to define "page = Page" in his
 * TypoScript.
 */
class MissingTypoScriptObjectException extends \TYPO3\TypoScript\Exception {

}
