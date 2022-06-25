
var db;

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {

    $("#divAddStdBtn").show();

    db = window.sqlitePlugin.openDatabase(
        { name: 'students.db', location: 'default' },
        function () {
            alert("DB Opened Successfully!");
        },
        function () {
            alert("DB Failed to open!");
        }
    );

    db.transaction(
        function (tx) {
            var query = "CREATE TABLE IF NOT EXISTS studentTbl (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT NOT NULL,phone TEXT NOT NULL)";
            tx.executeSql(query, [],
                function (tx, result) {
                    alert("Table created Successfully!");
                },
                function (err) {
                    alert("error occured: " + err.code);
                });
        });

    var link1 = crossroads.addRoute("/sqliteclick", function () {
        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM studentTbl;', [], function (tx, results) {
                var len = results.row.length;

                if (len > 0) {
                    htmlText = "";
                    for (i = 0; i < len; i++) {
                        htmlText = htmlText + "<tr><td>" + "<a href='#viewstudent/" + i + "'>" + (i + 1) + "</a></td><td>" + results.rows.item(i).name + "</td><td>" + results.rows.item(i).phone + "</td></tr>";
                    }
                    $('#tblStudent tbody').html(htmlText);
                }
            });

        });
        $("#divStudentList").show();
    });


    var link2 = crossroads.addRoute('viewstudent/{id}', function (id) {
        var ids = String(parseInt(id) + 1);
        alert("Click on student id success!");

        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM studentTbl where id = ?', [ids], function (tx, results) {
                var len = results.row.length;
                $("#studentidshow").val(ids);
                $("#studentnameshow").val(results.row.item(0).name);
                $("#studentphoneshow").val(results.row.item(0).phone);
            });
        });

        $("#divStudentList").hide();
        $("#divFrmShowStudent").show();
    });

    var link3 = crossroads.addRoute('btnAddStudent', function () {
        $("#divFrmInputStudent").submit(function (e) {
            e.preventDefault();
            e.stopPropagation();

            var name = $("studentnameinput").val();
            var phone = $("studentphoneinput").val();

            db.transaction(function (tx) {
                var query = "insert into studentTbl (name, phone) values (?, ?)";
                tx.executeSql(query,
                    [name, phone],
                    function (tx, results) {
                        alert("Data inserted!");
                    },
                    function (error) {
                        alert("Error, try again!");
                    }
                );

            });
        });

        $("#divStudentList").hide();
        $("#divFrmShowStudent").hide();
        $("#divFrmInputStudent").show();
    });

    var link4 = crossroads.addRoute('editBtn', function () {
        $("#divFrmEditStudent").submit(function (e) {
            e.preventDefault();
            e.stopPropagation();

            var name = $("studentnameedit").val();
            var phone = $("studentphoneedit").val();

            document.getElementById("studentnameinput").innerHTML = name;
            document.getElementById("studentphoneinput").innerHTML = phone;

            db.transaction(function (tx) {
                var query = "update studentTbl  where id = ?";
                tx.executeSql(query,
                    [name, phone],
                    function (tx, results) {
                        alert("Data updated!");
                    },
                    function (error) {
                        alert("Error, try again!");
                    }
                );

            });
        });

        $("#divStudentList").hide();
        $("#divFrmShowStudent").hide();
        $("#divFrmInputStudent").hide();
        $("#divFromEditStudent").show();
    });

    var link5 = crossroads.addRoute(delBtn, function() {
        $("#divStudentList").hide();
        $("#divFrmShowStudent").hide();
        $("#divFrmInputStudent").hide();
        $("#divFromEditStudent").hide();
        $("#").show();
    })


    function parseHash(newHash, oldHash) {
        crossroads.parse(newHash);
    }


    hasher.initialized.add(parseHash);
    hasher.changed.add(parseHash);
    hasher.init();
}
