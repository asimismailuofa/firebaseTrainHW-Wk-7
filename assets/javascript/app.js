
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCWsL7lIo1-2L0QlJ3i43g3dG6jISofxCY",
    authDomain: "train-schedule-basic-ef36a.firebaseapp.com",
    databaseURL: "https://train-schedule-basic-ef36a.firebaseio.com",
    projectId: "train-schedule-basic-ef36a",
    storageBucket: "train-schedule-basic-ef36a.appspot.com",
    messagingSenderId: "836066787890"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Employees
$("#train-add-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrainTime = $("#first-train-time").val().trim();
    var frequency = $("#frequency").val().trim();

    // Creates local "temporary" object for holding employee data
    var newTrain = {
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency
    };

    // Uploads employee data to the database
    database.ref().push(newTrain);
    alert("Train Schedule Sucessfully Added");

    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");
});

// 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // Store everything into a variable.
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTrainTime;
    var frequency = childSnapshot.val().frequency;

    console.log(trainName);
    console.log(destination);
    console.log(firstTrainTime);
    console.log(frequency);

    var splitTime = firstTrainTime.split(":");

    var momentSplitTime = moment().hours(splitTime[0]).minutes(splitTime[1]);
    console.log(momentSplitTime);

    var momentDiffTime = moment().diff(momentSplitTime,"minutes");
    console.log(momentDiffTime);

    var momentDiffRemainder = momentDiffTime % frequency;

    var momentRemainingMins = frequency - momentDiffRemainder;

    var momentArrivalTime = moment().add(momentRemainingMins, "m").format("hh:mm A");

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(destination),
    $("<td>").text(frequency),
    $("<td>").text(momentArrivalTime),
    $("<td>").text(momentRemainingMins),
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});