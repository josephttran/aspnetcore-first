const uri = "api/todo";
let todos = null;

function closeInput() {
    $("#spoiler").css({ display: "none" });
}

function getCount(data) {
    const el = $("#counter");
    let name = "todo";

    if (data) {
        if (data > 1) {
            name = "todos";
        }
        el.text(data + " " + name);
    } else {
        el.text("No " + name);
    }
}

function getData() {
    $.ajax({
        type: "GET",
        url: uri,
        cache: false,
        success: function (data) {
            const tBody = $("#todos");

            $(tBody).empty();
            getCount(data.length);

            $.each(data, function (key, item) {
                const tr = $("<tr></tr>")
                    .append($("<td></td>").append(
                        $("<input/>",
                        {
                            type: "checkbox",
                            disabled: true,
                            checked: item.isComplete
                        }
                    )))
                    .append($("<td></td>").text(item.name))
                    .append($("<td></td>").append(
                        $("<button>Edit</button>").on("click", function () {
                            editItem(item.id);
                        })
                    ))
                    .append($("<td></td>").append(
                        $("<button>Delete</button>").on("click", function () {
                            deleteItem(item.id);
                        })
                    ));
                tr.appendTo(tBody);
            });

            todos = data;
        }
    });
}

function addItem() {
    const item = {
        name: $("#add-name").val(),
        isComplete: false
    };

    $.ajax({
        type: "POST",
        url: uri,
        accepts: "application/json",
        contentType: "application/json",
        data: JSON.stringify(item),
        error: function (jqXHR, textStatus, errThrown) {
            alert("Error!");
        },
        success: function (result) {
            getData();
            $("#add-name").val("");
        }
    });
}

function deleteItem(id) {
    $.ajax({
        type: "DELETE",
        url: uri + "/" + id,
        success: function (result) {
            getData();
        }
    });
}

function editItem(id) {
    $.each(todos, function (key, item) {
        if (item.id === id) {
            $("#edit-id").val(item.id);
            $("#edit-name").val(item.name);
            $("#edit-isComplete")[0].checked = item.isComplete;
        }
    });

    $("#spoiler").css({ display: "block" });
}

$(document).ready(function () {
    getData();
});

$(".my-form").on("submit", function () {
    const item = {
        id: $("#edit-id").val(),
        name: $("#edit-name").val(),
        isComplete: $("#edit-isComplete").is(":checked")
    };

    $.ajax({
        type: "PUT",
        url: uri + "/" + $("#edit-id").val(),
        accepts: "application/json",
        contentType: "application/json",
        data: JSON.stringify(item),
        success: function (result) {
            getData();
        }
    });

    closeInput();

    return false;
});
