$(document).ready(()=> {
    $('#save').click(()=> {
        var data = {
            dateBegin:  $('#dateBegin').val(),
            timeBegin:  $('#timeBegin').val(),
            timeout:  $('#timeout').val(),
            interval:  $('#interval').val(),
            pause:  $('#pause').val(),
            picName:  $('#addNewPic').val(),
        };
        sendAjax('/auctionSettings/rewrite',data, "put")
        $('#td1').text($('#dateBegin').val());
        $('#td2').text($('#timeBegin').val());
        $('#td3').text($('#timeout').val());
        $('#td4').text($('#interval').val());
        $('#td5').text($('#pause').val());
        $('#td6').text($('#addNewPic').val());
    })
});

    function sendAjax(url, data, type){
    $.ajax({
        url:url,
        type:type,
        data: data
    });
}