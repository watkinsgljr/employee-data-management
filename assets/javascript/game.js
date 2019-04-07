//----------------------------------------------------------INITIALIZE DATABASE------------------------------------------------------
var config = {
    apiKey: "AIzaSyCD-jg_9CrwL3o8G6RRw7TKToFzPGpiYvU",
    authDomain: "employee-time-sheet-d0ad8.firebaseapp.com",
    databaseURL: "https://employee-time-sheet-d0ad8.firebaseio.com",
    projectId: "employee-time-sheet-d0ad8",
    storageBucket: "",
    messagingSenderId: "573758135450"
};
firebase.initializeApp(config);
// Library ready to use:
accounting.formatMoney(5318008);

var database = firebase.database();



var data = [];
var table;

$(document).ready(function () {
    var date_input = $('input[name="date"]'); //our date input has the name "date"
    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
    var options = {
        format: 'mm/dd/yyyy',
        container: container,
        todayHighlight: true,
        autoclose: true,
    };
    date_input.datepicker(options);



    table = $('#employee-table').DataTable({
        data: data,

        columns: [{ title: "Name" },
        { title: "Role" },
        { title: "Start Date" },
        { title: "Months Worked" },
        { title: "Monthly Rate($)" },
        { title: "Total Billed" }]
    });




    $("#add-user").on("click", function (event) {

        event.preventDefault();



        var firstName = $("#first-name-input").val().trim();
        var lastName = $("#last-name-input").val().trim();
        var name = lastName + ", " + firstName
        var role = $("#role-input").val().trim();
        var startDate = moment($("#start-date-input").val().trim(), "MM/DD/YYYY").format("X");
        var monthlyRate = $("#monthly-rate-input").val().trim();

        var newEmployee = {
            firstName: firstName,
            lastName: lastName,
            name: name,
            role: role,
            startDate: startDate,
            monthlyRate: monthlyRate,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        };

        database.ref().push(newEmployee);


        $("#first-name-input").val("");
        $("#last-name-input").val("");
        $("#role-input").val("");
        $("#start-date-input").val("");
        $("#monthly-rate-input").val("");
    });

    database.ref().on("child_added", function (childSnapshot) {

        var name = childSnapshot.val().name;
        var role = childSnapshot.val().role;
        var startDate = childSnapshot.val().startDate;
        var monthlyRate = childSnapshot.val().monthlyRate;
        var monthlyRateMoney = accounting.formatMoney(childSnapshot.val().monthlyRate);
        var startDate = moment.unix(startDate).format("MM/DD/YYYY");
        var monthsWorked = moment().diff(moment(startDate, "X"), "months");
        var totalBilled = accounting.formatMoney(monthsWorked * monthlyRate);
        console.log(totalBilled)
        var newEmployee = [name,  role, startDate, monthsWorked, monthlyRateMoney, totalBilled];
        console.log(newEmployee);
        

        data.push(newEmployee);
        var table = $('#employee-table').DataTable();
        table.row.add(newEmployee).draw();

        //     var newRow = $('<tr>').append(
        //         $("<td>").text(name),
        //         $("<td>").text(role),
        //         $("<td>").text(startDate),
        //         $("<td>").text(monthsWorked),
        //         $("<td>").text(accounting.formatMoney(monthlyRate)),
        //         $("<td>").text(accounting.formatMoney(totalBilled)),
        //     );

        //     $("#employee-table > tbody").append(newRow);

        });




        database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {
            // Change the HTML to reflect
            // $("#name-display").text(snapshot.val().name);
            // $("#email-display").text(snapshot.val().email);
            // $("#age-display").text(snapshot.val().age);
            // $("#comment-display").text(snapshot.val().comment);
        });

    });
