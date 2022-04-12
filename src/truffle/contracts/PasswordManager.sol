pragma solidity ^0.8.13;

contract PasswordManager{

    mapping(address => mapping(string => userInfo)) private userMap;

    string public name = 'nick';

    struct userInfo{
        string username;
        string password;
    }

    function setCredentials(
        string memory _website, 
        string memory _username, 
        string memory _password
    ) public {
        userMap[msg.sender][_website] = userInfo(_username, _password);

    }

    function getCredentials(
        string memory _website
    ) public view returns(userInfo memory){
        return userMap[msg.sender][_website];
    }
}
