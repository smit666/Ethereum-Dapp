pragma solidity ^0.4.18;


contract AuthenticateInfo {

    event AddedUser(uint userID);
  // describes a User
    struct User {
        uint256  Uid;
        bytes32 fullname;
        uint256 age;
        bytes32 city; 
     
    }

    mapping (uint => User) users;

uint numusers;
    function addUser(uint256 Uid,bytes32 fullname, uint256 age, bytes32 city) public {
        //// userID is the return variable
        uint userID = numusers++;
        // Create new Candidate Struct with name and saves it to storage.
        users[userID] = User(Uid,fullname,age,city);
        AddedUser(userID);
    }



     function isExists(uint256 uid) public view returns(bool _isExists) {

        uint256  numOfUsers = 0; // we will return this
        for (uint256  i = 0; i < numusers; i++) {
     
            if (users[i].Uid == uid) {
                return true;
                numOfUsers++;
            }
        }
        return false; 


  }


//get All users
  function getUser(uint userID) public view returns (uint256 ,bytes32,uint256, bytes32) {
        return (users[userID].Uid,users[userID].fullname,users[userID].age,users[userID].city);
    }

 function getNumOfUsers() public view returns(uint) {
        return numusers;
    }
}