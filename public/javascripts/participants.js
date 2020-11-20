$(document).ready(()=>{
    $('#save').click(()=>{
        sendAjax('/participants/addNewParticipant');
    });
});

function sendAjax(url) {
    $.ajax({
        url:     url,
        type:     "POST", //метод отправки
        data: {
            name: $('#newParticipantName').val(),
            card: $('#newParticipantCard').val(),
            money: $('#newParticipantMoney').val(),
            auction: ""
        },
        success:foo
    });
}

function foo(data) {
    $("#mbody tr:last").after('<tr>'+'<td>' + '<a href=/participants/' +data.id + '>' + $('#newParticipantName').val() + '<td>'+ $('#newParticipantCard').val() +
        '<td>' + $('#newParticipantMoney').val() + '</tr>');
}
$('#_save').click();
