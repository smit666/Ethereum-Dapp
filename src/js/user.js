// import CSS. Webpack with deal with it
import "../css/style.css"
//import "../images/id-verified.png"

// Import libraries we need.
import { default as Web3} from "web3"
import { default as contract } from "truffle-contract"

// get build artifacts from compiled smart contract and create the truffle contract
import userArtifacts from "../../build/contracts/AuthenticateInfo.json"
var UserContract = contract(userArtifacts)

/*
 * This holds all the functions for the app
 */
window.App = {
  // called when web3 is set up
  start: function() { 
    // setting up contract providers and transaction defaults for ALL contract instances
    UserContract.setProvider(window.web3.currentProvider)
    UserContract.defaults({from: window.web3.eth.accounts[0],gas:210000})

    // creates an VotingContract instance that represents default address managed by VotingContract
    UserContract.deployed().then(function(instance){

      // calls getNumOfCandidates() function in Smart Contract, 
      // this is not a transaction though, since the function is marked with "view" and
      // truffle contract automatically knows this
      instance.getNumOfUsers().then(function(numOfUsers){

        // adds candidates to Contract if there aren't any
        if (numOfUsers == 0){
          // calls addCandidate() function in Smart Contract and adds candidate with name "Candidate1"
          // the return value "result" is just the transaction, which holds the logs,
          // which is an array of trigger events (1 item in this case - "addedCandidate" event)
          // We use this to get the candidateID
          instance.addUser(666,"Smit",25,"Palghar").then(function(result){ 
          //  $("#user-box").append(`<div class='form-check'><input class='form-check-input' type='checkbox' value='' id=${result.logs[0].args.candidateID}><label class='form-check-label' for=0>Candidate1</label></div>`)
          })
          instance.addUser(46,"XYZ",30,"Mumbai").then(function(result){
           // $("#user-box").append(`<div class='form-check'><input class='form-check-input' type='checkbox' value='' id=${result.logs[0].args.candidateID}><label class='form-check-label' for=1>Candidate2</label></div>`)
          })
          // the global variable will take the value of this variable
          numOfUsers = 2 
        }
        else { // if candidates were already added to the contract we loop through them and display them
          // instance.addCandidate("Muniyan","Congress Party").then(function(result){ 
          //   $("#candidate-box").append(`<div class='form-check'><input class='form-check-input' type='checkbox' value='' id=${result.logs[0].args.candidateID}><label class='form-check-label' for=0>Candidate1</label></div>`)
          // })
          $("#user-box").empty();
          for (var i = 0; i < numOfUsers; i++ ){
            // gets candidates and displays them

            instance.getUser(i).then(function(data){
           console.log(data[0])
              $("#user-box").append(`<div class="form-check"><input class="form-check-input"  type="radio" name="rb" value="" id="rr"><label class="form-check-label" style="margin-left: 10px;" for="">${data[0].toString()} - ${window.web3.toAscii(data[1])}- ${data[2].toString()}  - ${window.web3.toAscii(data[3])}</label></div>`)
            })
          }
       

        }
        // sets global variable for number of Candidates
        // displaying and counting the number of Votes depends on this
        window.numOfUsers = numOfUsers 
      })

      

    }).catch(function(err){ 
      console.error("ERROR! " + err.message)
    })
  },

  addNewUser:function(){
    UserContract.deployed().then(function(instance){
      var uniqueId=$('#txtUid').val();
      var userName=$('#txtUserName').val();
      var userAge=$('#txtAge').val();
      var userCity=$('#txtCity').val();
if(uniqueId!=""&&userName!="")
{
  instance.addUser(uniqueId,userName,userAge,userCity).then(function(result){ 
  // $("#candidate-box").append(`<div class='form-check'><input class='form-check-input' type='checkbox' value='' id=${result.logs[0].args.candidateID}><label class='form-check-label' for=0>Candidate1</label></div>`)
  $('#txtUid').val('');
  $('#txtUserName').val('');
  $('#txtAge').val('');
 $('#txtCity').val('');
//  $("#errMsg").html("<p>Saved successfully!</p>")
 $('#txtError').text('Saved successfully!');
 $('#myModal').modal('show');

 $("#user-box").empty();
 for (var i = 0; i < numOfUsers; i++ ){
   // gets candidates and displays them

   instance.getUser(i).then(function(data){
  
     $("#user-box").append(`<div class="form-check"><input class="form-check-input"  type="radio" name="rb" value="" id="rr"><label class="form-check-label" style="margin-left: 10px;" for="">${window.web3.toAscii(data[0])} - ${window.web3.toAscii(data[1])}- ${data[2].toString()}  - ${window.web3.toAscii(data[3])}</label></div>`)
   })
 }


   })

}
else{

  $("#errMsg").html("<p>Enter User Name or UID!</p>")
}
});

  },
 
verify:function(){

  UserContract.deployed().then(function(instance){
    instance.isExists( $('#txtId').val()).then(function(result){
    
      if(result==true)
      {
      //  $("#errLogin").html("<p>Already Voted!</p>")
      $(".modal-body").find("img").remove();
      $('#txtError').text('Verified!')
      $('#txtError').css("color","green")
      $('#txtError').css("font-size","x-large")

      $('#txtError').after('<img src="src/images/id-verified.png"/ height="122px" >') 
  $('#myModal').modal('show');
      }
      else{
       $(".modal-body").find("img").remove();
       $('#txtError').css("color","red")
        $('#txtError').text('Invalid Id!');   
        $('#txtError').after('<img src="src/images/id-not-verified.png"/ height="122px" >') 
        $('#myModal').modal('show');
    // $('#divMain').show(); 
    // $('#divLogin').hide();
      }
    
    });
  });
},
  checkUser:function(user){
    var pUser;
    var IsExist=false;
   VotingContract.deployed().then(function(instance){
    instance.getNumOfVoters().then(function(numOfVoters){
      if (numOfVoters == 0){
        console.log("Voters Not found");
        IsExist= false;
      }
      else{
      //  $("#voter-List").empty();
        for (var i = 0; i < numOfVoters; i++ ){
          // gets candidates and displays them

          instance.getVoters(i).then(function(data){
         ///   pUser=window.web3.toAscii(data).toString();
         if(~~data==~~user)
         {
          IsExist= true;
           //break;
         }
         // $("#voter-List").append(`<div class="form-check"><input class="form-check-input" type="checkbox" value="" id=${data[0]}><label class="form-check-label" for=${data[0]}>${window.web3.toAscii(data)}</label></div>`)
          })
         
        }
       // IsExist= false;
      }

    });

    return IsExist;
  });

  }
}

// When the page loads, we create a web3 instance and set a provider. We then set up the app
window.addEventListener("load", function() {
  // Is there an injected web3 instance?
  if (typeof web3 !== "undefined") {
    console.warn("Using web3 detected from external source like Metamask")
    // If there is a web3 instance(in Mist/Metamask), then we use its provider to create our web3object
    window.web3 = new Web3(web3.currentProvider)

   //var Web3 = require('web3');
//    var web3Arr = [new Web3(new Web3.providers.HttpProvider("http://localhost:9545"))];
//    var noOfNodes=1;
//    var choosenPort=(Math.floor(Math.random()*web3Arr.length))%noOfNodes;
//    window.web3 =  web3Arr[choosenPort];
   
//    while (!window.web3.isConnected()) {
//      choosenPort=(Math.floor(Math.random()*web3Arr.length))%noOfNodes;
//      window.web3 =  web3Arr[choosenPort];
//    }
  // web3.personal.unlockAccount(web3.eth.accounts[0],'',0);

   
  // window.web3 = new Web3(new Web3.providers.HttpProvider("http://*:8546"))

  } else {
    console.warn("No web3 detected. Falling back to http://localhost:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for deployment. More info here: http://truffleframework.com/tutorials/truffle-and-metamask")
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    //window.web3 = new Web3(new Web3.providers.HttpProvider("http://*:8546"))
    var web3Arr = [new Web3(new Web3.providers.HttpProvider("http://localhost:9545"))];
var noOfNodes=1;
var choosenPort=(Math.floor(Math.random()*web3Arr.length))%noOfNodes;
window.web3 =  web3Arr[choosenPort];

while (!window.web3.isConnected()) {
  choosenPort=(Math.floor(Math.random()*web3Arr.length))%noOfNodes;
  window.web3 =  web3Arr[choosenPort];
}
//web3.personal.unlockAccount(web3.eth.accounts[0],'',0);
  }
  // initializing the App
  window.App.start()
})