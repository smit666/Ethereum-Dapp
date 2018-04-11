pragma solidity ^0.4.18;
// written for Solidity version 0.4.18 and above that doesnt break functionality

contract Voting {
    // an event that is called whenever a Candidate is added so the frontend could
    // appropriately display the candidate with the right element id (it is used
    // to vote for the candidate, since it is one of arguments for the function "vote")
    event AddedCandidate(uint candidateID);
   // event AddedUser(uint userID);

    // describes a Voter, which has an id and the ID of the candidate they voted for
    struct Voter {
        uint uid; // bytes32 type are basically strings
        uint candidateIDVote;
        bool doesVoterExist; 
    }
    // describes a Candidate
    struct Candidate {
        bytes32 name;
        bytes32 party; 
        // "bool doesExist" is to check if this Struct exists
        // This is so we can keep track of the candidates 
        bool doesExist; 
    }

   // struct Registration {
     //   bytes32 name;
     //   bytes32 emailId;
      //  bytes32 password;
        // "bool doesExist" is to check if this Struct exists
        // This is so we can keep track of the candidates 
    //    bool doesExist; 
    //}


    // These state variables are used keep track of the number of Candidates/Voters 
    // and used to as a way to index them     
    uint numCandidates; // declares a state variable - number Of Candidates
    uint numVoters;
    //uint numUsers;

    
    // Think of these as a hash table, with the key as a uint and value of 
    // the struct Candidate/Voter. These mappings will be used in the majority
    // of our transactions/calls
    // These mappings will hold all the candidates and Voters respectively
    mapping (uint => Candidate) candidates;
    mapping (uint => Voter) voters;
   // mapping (uint => Registration) registration;

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     *  These functions perform transactions, editing the mappings *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
//Register User

 //function registerUser(bytes32 name, bytes32 emailId,bytes32 password) public {
        // candidateID is the return variable
       // uint userID = numUsers++;
        // Create new User Struct with name and saves it to storage.
     //   registration[userID] = Registration(name,emailId,password,true);
     //   AddedUser(userID);
    //}



    function addCandidate(bytes32 name, bytes32 party) public {
        // candidateID is the return variable
        uint candidateID = numCandidates++;
        // Create new Candidate Struct with name and saves it to storage.
        candidates[candidateID] = Candidate(name,party,true);
        AddedCandidate(candidateID);
    }

    function vote(uint uid, uint candidateID) public {
        // checks if the struct exists for that candidate
            int numOfVotes = 0; // we will return this
            bool flag=false;
        for (uint i = 0; i < numVoters; i++) {
            // if the voter votes for this specific candidate, we increment the number
            if (voters[i].uid == uid) {
               flag=true;
                numOfVotes++;
            }
        }
        if(!flag)
        {
        if (candidates[candidateID].doesExist == true) {

           // if(voters[uid].doesVoterExist==true){
           
          //  }else
          //  {
            uint voterID = numVoters++; //voterID is the return variable
            voters[voterID] = Voter(uid,candidateID,true);
          //  }
            
        }
        }
    }

     function isExists(uint uid) public view returns(bool _isExists) {

 uint numOfVotes = 0; // we will return this
        for (uint i = 0; i < numVoters; i++) {
            // if the voter votes for this specific candidate, we increment the number
            if (voters[i].uid == uid) {
                return voters[i].doesVoterExist;
                numOfVotes++;
            }
        }
        return false; 


  }

    /* * * * * * * * * * * * * * * * * * * * * * * * * * 
     *  Getter Functions, marked by the key word "view" *
     * * * * * * * * * * * * * * * * * * * * * * * * * */
    

    // finds the total amount of votes for a specific candidate by looping
    // through voters 
    function totalVotes(uint candidateID) view public returns (uint) {
        uint numOfVotes = 0; // we will return this
        for (uint i = 0; i < numVoters; i++) {
            // if the voter votes for this specific candidate, we increment the number
            if (voters[i].candidateIDVote == candidateID) {
                numOfVotes++;
            }
        }
        return numOfVotes; 
    }

    function getNumOfCandidates() public view returns(uint) {
        return numCandidates;
    }

    function getNumOfVoters() public view returns(uint) {
        return numVoters;
    }
    // returns candidate information, including its ID, name, and party
    function getCandidate(uint candidateID) public view returns (uint,bytes32, bytes32) {
        return (candidateID,candidates[candidateID].name,candidates[candidateID].party);
    }
     // returns Voter information
      function getVoters(uint voterID) public view returns (uint) {
        return (voters[voterID].uid);
    }

    function userExists(uint uid) public view returns(bool){
         if(uid == voters[uid].uid)
        {
            return true;
        }
        else
        {
           return false;
        }
    }
}