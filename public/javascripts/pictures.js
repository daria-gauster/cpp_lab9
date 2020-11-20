$(document).ready(()=>{
    $('#save').click(()=>{
        sendAjax('/pictures/addNewPicture');
    });
});

function sendAjax(url) {
    $.ajax({
        url:     url,
        type:     "POST", //метод отправки
        data: {
            name: $('#newPicName').val(),
            author: $('#newPicAuthor').val(),
            date: $('#newPicDate').val(),
            description: $('#newPicDescription').val(),
            link: $('#newPicImage').val(),
            inAuction: false,
            beginning_price: null,
            min_step: null,
            max_step: null
        },
        success: foo
    });
}

function foo(data) {
    //var mhref = '/pictures/' + data.id;
    $("#mbody tr:last").after('<tr>'+'<td>' + '<a href=/pictures/' +data.id + '>'+$('#newPicName').val() + '<td>'+ $('#newPicAuthor').val() +
        '<td>' + $('#newPicDate').val() + '<td>'+ "No" + '<td>'+ "-" + '<td>'+ "-" + '<td>'+ "-" + '</tr>');
}
$('#_save').click();