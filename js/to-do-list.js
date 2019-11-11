window.ToDoList = {


    API_URL: "http://localhost:8081/to-do-items",

    getItems: function () {
        $.ajax({
            url: ToDoList.API_URL,
            method: "GET"
        }).done(function (response) {
            console.log(response);
            ToDoList.displayItems(JSON.parse(response))
        });
    },
    createItem: function(){
        $.ajax({
            url: ToDoList.API_URL,
            method: "POST",
            contentType: "application/json",
            data: ToDoList.itemAddDetails()
        }).done(function (respone) {
            ToDoList.getItems();

        })
    },
    editItem: function(id, done){
        $.ajax({
            url: ToDoList.API_URL+ "?id=" +id,
            method: "PUT",
            contentType: "application/json",
            data: ToDoList.editItemDetails(done)
        }).done(function () {
            ToDoList.getItems()
        })
    },
    deleteItem: function(id){
        $.ajax({
            url: ToDoList.API_URL + "?id=" +id,
            method:"DELETE",
        }).done(function () {
            ToDoList.getItems();
        })
    },
    displayItems:function (items) {
        var tableContent = "";
        items.forEach(item => tableContent += ToDoList.getItemTableRow(item));

        $("#to-do-items tbody").html(tableContent);
    },
    getItemTableRow: function (item) {
        var deadline = new Date(...item.deadline).toLocaleDateString("ro");
        var checkedAttribute = item.done ? "checked": "";
        return `<tr>
                    <td>${item.description}</td>
                    <td>${deadline}</td>
                    <td><input type="checkbox" class="mark-done" data-id="${item.id}" ${checkedAttribute}></td>
                    <td><a href="#" class="delete-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></a></td>
                </tr>`;
    },
    itemAddDetails: function () {
        var descriptionVal = $("#description-field").val();
        let deadlineVal = $("#deadline-field").val();

        var requestBody = {
            description: descriptionVal,
            deadline: deadlineVal,
        };
        return JSON.stringify(requestBody)
    },
    editItemDetails: function(done){
        let requestBody = {
            done: done
        };
        return JSON.stringify(requestBody)
    },
    bindEvents: function () {
        $("#create-item-form").submit(function (event) {
            event.preventDefault();
            ToDoList.createItem();
        });

        $("#to-do-items").delegate(".mark-done","change",function (event) {
            event.preventDefault();
            let id = $(this).data("id");
            let checked = $(this).is(":checked");
            ToDoList.editItem(id,checked)
        });
        $("#to-do-items").delegate(".delete-item","click",function (event) {
            event.preventDefault();
            let id = $(this).data("id");
            ToDoList.deleteItem(id)
        })


    }



};
ToDoList.getItems();
ToDoList.bindEvents();