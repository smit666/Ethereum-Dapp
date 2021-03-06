// import CSS. Webpack with deal with it
import "../css/style.css"

// Import libraries we need.
import { default as Web3} from "web3"
import { default as contract } from "truffle-contract"

// get build artifacts from compiled smart contract and create the truffle contract
import votingArtifacts from "../../build/contracts/Voting.json"
var VotingContract = contract(votingArtifacts)

/*
 * This holds all the functions for the app
 */
window.App = {
  // called when web3 is set up
  start: function() { 
    // setting up contract providers and transaction defaults for ALL contract instances
    VotingContract.setProvider(window.web3.currentProvider)
    VotingContract.defaults({from: window.web3.eth.accounts[0],gas:210000})

    // creates an VotingContract instance that represents default address managed by VotingContract
    VotingContract.deployed().then(function(instance){

      // calls getNumOfCandidates() function in Smart Contract, 
      // this is not a transaction though, since the function is marked with "view" and
      // truffle contract automatically knows this
      instance.getNumOfCandidates().then(function(numOfCandidates){

        // adds candidates to Contract if there aren't any
        if (numOfCandidates == 0){
          // calls addCandidate() function in Smart Contract and adds candidate with name "Candidate1"
          // the return value "result" is just the transaction, which holds the logs,
          // which is an array of trigger events (1 item in this case - "addedCandidate" event)
          // We use this to get the candidateID
          instance.addCandidate("Candidate1","Democratic").then(function(result){ 
            $("#candidate-box").append(`<div class='form-check'><input class='form-check-input' type='checkbox' value='' id=${result.logs[0].args.candidateID}><label class='form-check-label' for=0>Candidate1</label></div>`)
          })
          instance.addCandidate("Candidate2","Republican").then(function(result){
            $("#candidate-box").append(`<div class='form-check'><input class='form-check-input' type='checkbox' value='' id=${result.logs[0].args.candidateID}><label class='form-check-label' for=1>Candidate2</label></div>`)
          })
          // the global variable will take the value of this variable
          numOfCandidates = 2 
        }
        else { // if candidates were already added to the contract we loop through them and display them
          // instance.addCandidate("Muniyan","Congress Party").then(function(result){ 
          //   $("#candidate-box").append(`<div class='form-check'><input class='form-check-input' type='checkbox' value='' id=${result.logs[0].args.candidateID}><label class='form-check-label' for=0>Candidate1</label></div>`)
          // })
          $("#candidate-box").empty();
          for (var i = 0; i < numOfCandidates; i++ ){
            // gets candidates and displays them

            instance.getCandidate(i).then(function(data){
           
              $("#candidate-box").append(`<div class="form-check"><input class="form-check-input"  type="radio" name="rb" value="" id=${data[0]}><label class="form-check-label" style="margin-left: 10px;" for=${data[0]}>${window.web3.toAscii(data[1])} - ${window.web3.toAscii(data[2])}</label></div>`)
            })
          }
       

        }
        // sets global variable for number of Candidates
        // displaying and counting the number of Votes depends on this
        window.numOfCandidates = numOfCandidates 
      })

      

    }).catch(function(err){ 
      console.error("ERROR! " + err.message)
    })
  },

  // Function that is called when user clicks the "vote" button
  vote: function() {
    var uid = $("#id-input").val() //getting user inputted id
var IsExist=false;
var ids = [];
    // Application Logic 
    if (uid == ""){
      $("#msg").html("<p>Please enter id.</p>")
      return
    }


    // Checks whether a candidate is chosen or not.
    // if it is, we get the Candidate's ID, which we will use
    // when we call the vote function in Smart Contracts
    if ($("#candidate-box :radio:checked").length > 0){ 
      // just takes the first checked box and gets its id
      var candidateID = $("#candidate-box :radio:checked")[0].id
    } 
    else {
      // print message if user didn't vote for candidate
      $("#msg").html("<p>Please select  a candidate.</p>")
      return
    }

    if($('#id-input').val()!="")
    {
     VotingContract.deployed().then(function(instance){
     instance.isExists( ~~$('#id-input').val()).then(function(result){
     
       if(result!=true)
       {

        // instance.getNumOfVoters().then(function(numOfVoters){
        //   if (numOfVoters == 0){
        //     console.log("Voters Not found");
         
        //   }
        //   else{
       
        //     for (var i = 0; i < numOfVoters; i++ ){
        //       // gets candidates and displays them
    
        //       instance.getVoters(i).then(function(data){
          
        //       //  ids.push(data);
        //      if(~~data==~~uid)
        //      {
           
        //       IsExist=true;
        //      }
        
        //       })
             
        //     }
         
        
        //   }
    
        //   if(IsExist!=true)
        // {
        // Actually voting for the Candidate using the Contract and displaying "Voted"
    
        instance.vote(parseInt(uid),parseInt(candidateID)).then(function(result){
           // $("#msg").html("<p>Voted</p>");
            $('#txtError').text('Voted!')
            $('#myModal').modal('show');
            //$("#id-input").val('');
          })
      
      // }
      // else
      // {
      //   $("#msg").html("<p>Already Voted!</p>");
      // }
    
    
        // });
       }
       else{

        //$("#msg").html("<p>Already Voted!</p>");
        $('#txtError').text('Already Voted!')
        $('#myModal').modal('show');
       }
      });
    }).catch(function(err){ 
      console.error("ERROR! " + err.message)
    });
  }
  //location.reload();
  
  },

  // function called when the "Count Votes" button is clicked
  findNumOfVotes: function() {
    VotingContract.deployed().then(function(instance){
      // this is where we will add the candidate vote Info before replacing whatever is in #vote-box
      var box = $("<table class='table table-striped' border=2></table>") 

      // loop through the number of candidates and display their votes
      for (var i = 0; i < window.numOfCandidates; i++){
        // calls two smart contract functions
        var candidatePromise = instance.getCandidate(i)
        var votesPromise = instance.totalVotes(i)

        // resolves Promises by adding them to the variable box
        Promise.all([candidatePromise,votesPromise]).then(function(data){
          box.append(`<tr><td><b>${window.web3.toAscii(data[0][1])}: ${data[1]}</b></td></tr>`)
        }).catch(function(err){ 
          console.error("ERROR! " + err.message)
        })
      }
      $("#vote-box").html(box) // displays the "box" and replaces everything that was in it before

      instance.getNumOfVoters().then(function(numOfVoters){
        if (numOfVoters == 0){
          console.log("Voters Not found");

        }
        else{
          $("#voter-List").empty();
          $("#voter-List").append(`<table id="tblVoter" class="table table-border" border=2><thead><tr><td><b>Voted Aadhar Numbers</b></td></tr><thead><tbody></tbody></table>`)
          for (var i = 0; i < numOfVoters; i++ ){
            // gets candidates and displays them

            instance.getVoters(i).then(function(data){
              console.log(data)
              $("#tblVoter tbody").append(`<tr id=${data[0]}><td>${data}</td></tr>`)

            })
          }
       
        }

      });
    })
  },

  //Add New Candidate
  addNewCandidate:function(){
    VotingContract.deployed().then(function(instance){
      var canName=$('#txtCanName').val();
      var partyName=$('#txtPartyName').val();
if(canName!=""&&partyName!="")
{
  instance.addCandidate(canName,partyName).then(function(result){ 
  // $("#candidate-box").append(`<div class='form-check'><input class='form-check-input' type='checkbox' value='' id=${result.logs[0].args.candidateID}><label class='form-check-label' for=0>Candidate1</label></div>`)
  $('#txtCanName').val('');
  $('#txtPartyName').val('');
//  $("#errMsg").html("<p>Saved successfully!</p>")
 $('#txtError').text('Saved successfully!')
 $('#myModal').modal('show');
   })

}
else{

  $("#errMsg").html("<p>Enter Candidate Name or Party Name!</p>")
}
});

  },
 //Add New Candidate
 addNewUser:function(){
  VotingContract.deployed().then(function(instance){
    var userName=$('#name').val();
    var emailId=$('#email').val();
    var userPassword=$('#password').val();

if(userName!=""&&emailId!=""&&userPassword!="")
{
instance.registerUser(userName,emailId,userPassword).then(function(result){ 
// $("#candidate-box").append(`<div class='form-check'><input class='form-check-input' type='checkbox' value='' id=${result.logs[0].args.candidateID}><label class='form-check-label' for=0>Candidate1</label></div>`)
$('#name').val('');
$('#email').val('');
$('#password').val('');
$("#errReg").html("<p>Saved successfully!</p>")

 })

}
else{

  $("#errReg").html("<p>Something went wrong</p>")
}
}).catch(function(err){ 
  console.error("ERROR! " + err.message)
});
  
 },


  //Login To Account

  login:function(){
  // $('#divMain').css('visibility: block !important;');
 if($('#id-input').val()!="")
 {
  VotingContract.deployed().then(function(instance){
  instance.isExists( ~~$('#id-input').val()).then(function(result){
  
    if(result==true)
    {
    //  $("#errLogin").html("<p>Already Voted!</p>")
    $('#txtError').text('Already Voted!')
$('#myModal').modal('show');
    }
    else{

  $('#divMain').show(); 
  $('#divLogin').hide();
    }
  
  });
});
// if(App.checkUser($('#userId').val())==true)
// {
  
//   $("#errLogin").html("<p>Already Voted!</p>")
// }
// else{
  
// }
 }
 else{
  $('#txtError').text('Enter Aadhar No.')
  $('#myModal').modal('show');
 }
 //bool a= checkUser()
  
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
   // window.web3 = new Web3(web3.currentProvider)

   //var Web3 = require('web3');
   var web3Arr = [new Web3(new Web3.providers.HttpProvider("http://192.168.1.27:8546")),
       new Web3(new Web3.providers.HttpProvider("http://192.168.1.155:8102"))];
   var noOfNodes=2;
   var choosenPort=(Math.floor(Math.random()*web3Arr.length))%noOfNodes;
   window.web3 =  web3Arr[choosenPort];
   
   while (!window.web3.isConnected()) {
     choosenPort=(Math.floor(Math.random()*web3Arr.length))%noOfNodes;
     window.web3 =  web3Arr[choosenPort];
   }
  // web3.personal.unlockAccount(web3.eth.accounts[0],'',0);

   
  // window.web3 = new Web3(new Web3.providers.HttpProvider("http://*:8546"))

  } else {
    console.warn("No web3 detected. Falling back to http://localhost:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for deployment. More info here: http://truffleframework.com/tutorials/truffle-and-metamask")
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    //window.web3 = new Web3(new Web3.providers.HttpProvider("http://*:8546"))
    var web3Arr = [new Web3(new Web3.providers.HttpProvider("http://192.168.1.27:8546")),
    new Web3(new Web3.providers.HttpProvider("http://192.168.1.155:8102"))];
var noOfNodes=2;
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