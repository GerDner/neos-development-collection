Feature: Privilege to restrict reading of node properties

  Background:
    Given I have the following policies:
    """
    privilegeTargets:

      'TYPO3\TYPO3CR\Security\Authorization\Privilege\Node\ReadNodePropertyPrivilege':

        'TYPO3.TYPO3CR:Service:ReadServiceTextTitles':
          matcher: 'isDescendantNodeOf("/sites/typo3cr/service/") && nodeIsOfType("TYPO3.Neos.NodeTypes:Text") && nodePropertyIsIn(["title"])'

        'TYPO3.TYPO3CR:Service:ReadDocumentVisibilityAttributes':
          matcher: 'nodeIsOfType("TYPO3.TYPO3CR.Testing:Document") && nodePropertyIsIn(["hidden", "hiddenBeforeDateTime", "hiddenAfterDateTime", "hiddenInIndex"])'


    roles:
      'TYPO3.Flow:Everybody':
        privileges: []

      'TYPO3.Flow:Anonymous':
        privileges: []

      'TYPO3.Flow:AuthenticatedUser':
        privileges: []

      'TYPO3.TYPO3CR:Administrator':
        privileges:
          -
            privilegeTarget: 'TYPO3.TYPO3CR:Service:ReadServiceTextTitles'
            permission: GRANT
          -
            privilegeTarget: 'TYPO3.TYPO3CR:Service:ReadDocumentVisibilityAttributes'
            permission: GRANT

    """

    And I have the following nodes:
      | Identifier                           | Path                   | Node Type                      | Properties           | Workspace |
      | ecf40ad1-3119-0a43-d02e-55f8b5aa3c70 | /sites                 | unstructured                   |                      | live      |
      | fd5ba6e1-4313-b145-1004-dad2f1173a35 | /sites/typo3cr         | TYPO3.TYPO3CR.Testing:Document | {"title": "Home"}    | live      |
      | 68ca0dcd-2afb-ef0e-1106-a5301e65b8a0 | /sites/typo3cr/company | TYPO3.TYPO3CR.Testing:Document | {"title": "Company"} | live      |
      | 52540602-b417-11e3-9358-14109fd7a2dd | /sites/typo3cr/service | TYPO3.TYPO3CR.Testing:Document | {"title": "Service"} | live      |
      | 82246a9e-be03-3c06-018d-e4c68103ecd3 | /sites/typo3cr/service/teaser | TYPO3.Neos.NodeTypes:Text | {"title": "Some Teaser Text"} | live      |


  @Isolated @fixtures
  Scenario: Anonymous users are not granted to get title of service text nodes
    Given I am not authenticated
    And I get a node by path "/sites/typo3cr/service/teaser" with the following context:
      | Workspace  |
      | user-admin |
    Then I should not be granted to get the "title" property
    And I should get FALSE when asking the node authorization service if getting the "title" property is granted

  @Isolated @fixtures
  Scenario: Anonymous users are granted to get title of service node
    Given I am not authenticated
    And I get a node by path "/sites/typo3cr/service" with the following context:
      | Workspace  |
      | user-admin |
    Then I should be granted to get the "title" property
    And I should get TRUE when asking the node authorization service if getting the "title" property is granted

  @Isolated @fixtures
  Scenario: Administrators are granted to get title of service text nodes
    Given I am authenticated with role "TYPO3.TYPO3CR:Administrator"
    And I get a node by path "/sites/typo3cr/service/teaser" with the following context:
      | Workspace  |
      | user-admin |
    Then I should be granted to get the "title" property
    And I should get TRUE when asking the node authorization service if getting the "title" property is granted

  @Isolated @fixtures
  Scenario: Anonymous users are not granted to get visibility options of document nodes
    Given I am not authenticated
    And I get a node by path "/sites/typo3cr" with the following context:
      | Workspace  |
      | user-admin |
    Then I should not be granted to get the "hidden" property
    And I should get FALSE when asking the node authorization service if getting the "hidden" property is granted
    And I should not be granted to get the "hiddenBeforeDateTime" property
    And I should get FALSE when asking the node authorization service if getting the "hiddenBeforeDateTime" property is granted
    And I should not be granted to get the "hiddenAfterDateTime" property
    And I should get FALSE when asking the node authorization service if getting the "hiddenAfterDateTime" property is granted
    And I should not be granted to get the "hiddenInIndex" property
    And I should get FALSE when asking the node authorization service if getting the "hiddenInIndex" property is granted
    And I should be granted to get the "name" property
    And I should get TRUE when asking the node authorization service if getting the "name" property is granted
    And I should be granted to get the "accessRoles" property
    And I should get TRUE when asking the node authorization service if getting the "accessRoles" property is granted
