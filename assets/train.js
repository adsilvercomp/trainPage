/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed

// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyArBZOIFmLOgDBvIgvf7MBpkHAFv6jyDqE",
    authDomain: "train-a4371.firebaseapp.com",
    databaseURL: "https://train-a4371.firebaseio.com",
    storageBucket: ""
};




firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Grabs user input and store it in variable
    var name = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var start = moment($("#start-input").val().trim(), "hh:mm").format("X");
    var frequency = $("#frequency-input").val().trim();

    // Creates local "train" object for holding train data
    var newTrain = {
        name: name,
        destination: destination,
        start: start,
        frequency: frequency
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.start);
    console.log(newTrain.frequency);

    // Alert
    alert("Train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");


  

});


  // 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
    database.ref().on("child_added", function(childSnapshot, prevChildKey) {

        console.log(childSnapshot.val());

        // Store everything into a variable.
        var trainName = childSnapshot.val().name;
        var trainFrequency = childSnapshot.val().frequency;
        var trainStart = childSnapshot.val().start;
        var trainDestination = childSnapshot.val().destination;

        // train Info
        console.log(trainName);
        console.log(trainFrequency);
        console.log(trainStart);
        console.log(trainDestination);


        /////////////////////////////////////

        // Assume the following situations.
        // (TEST 1)
        // First Train of the Day is 3:00 AM
        // Assume Train comes every 3 minutes.
        // Assume the current time is 3:16 AM....
        // What time would the next train be...? (Use your brain first)
        // It would be 3:18 -- 2 minutes away
        // (TEST 2)
        // First Train of the Day is 3:00 AM
        // Assume Train comes every 7 minutes.
        // Assume the current time is 3:16 AM....
        // What time would the next train be...? (Use your brain first)
        // It would be 3:21 -- 5 minutes away
        // ==========================================================
        // Solved Mathematically
        // Test case 1:
        // 16 - 00 = 16
        // 16 % 3 = 1 (Modulus is the remainder)
        // 3 - 1 = 2 minutes away
        // 2 + 3:16 = 3:18
        // Solved Mathematically
        // Test case 2:
        // 16 - 00 = 16
        // 16 % 7 = 2 (Modulus is the remainder)
        // 7 - 2 = 5 minutes away
        // 5 + 3:16 = 3:21
        // Assumptions
        var tFrequency = trainFrequency;
        // Time is 3:30 AM
        var tStart = trainStart;
        // First Time (pushed back 1 year to make sure it comes before current time)
        var tStartConverted = moment(tStart, "hh:mm").subtract(1, "years");
        console.log("time conversion: " + tStartConverted);
        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
        // Difference between the times
        var diffTime = moment().diff(moment(tStartConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);
        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);
        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

        var nextTrain2 = moment(nextTrain).format("hh:mm")




        //////////////////////////////////////

        // Add each train's data into the html
        //remember to add start
        $("#time-table").append("<tr><td>" + trainName + "</td><td>" + trainDestination + 
            "</td><td>" + trainFrequency + "</td><td>" + nextTrain2 + "</td><td>" + tMinutesTillTrain + "</td></tr>");
    });