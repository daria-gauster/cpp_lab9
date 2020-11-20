$(document).ready(function() {
    require('../stylesheets/chat.css');
    //require.context("../images", true, /.*\.(jpg|jpeg|gif|png)$/);
    $("#admin-panel, #img-info-auction, #userstable, #resizableFrame").draggable({
        cursor: "move",
    });

    $("#resizableFrame").resizable({
        maxHeight: 700,
        maxWidth: 750,
        minHeight: 200,
        minWidth: 200
    });

    var isRight = true;
    var socket = io.connect('http://localhost:4445');
    socket.on('connect', function () {
        socket.on('msg', function (msg) {
            if (isRight) {
                $('#users').append(`<div class="container"><p style="word-wrap: break-word;">${msg.message}</p>
                        <span class="time-right">${msg.time}</span></div>`)
                isRight = false;
            } else {
                $('#users').append(`<div class="container darker"><p style="word-wrap: break-word;">
                        ${msg.message}</p><span class="time-left">${msg.time}</span></div>`)
                isRight = true;
            }
        });
        socket.on('updatepictureinfo', function (msg) {
            $(`#pictable tr:nth-child(${msg.id + 2}) :nth-child(4)`).text(msg.name);
            $(`#pictable tr:nth-child(${msg.id + 2}) :nth-child(5)`).text(msg.price);
        });
        socket.on('updatemoney', function (msg) {
            for (let i = 2; i <= picsnum + 1; i++) {
                if ($(`#usertable tr:nth-child(${i}) :nth-child(2)`).text() == msg.name) {
                    $(`#usertable tr:nth-child(${i}) :nth-child(3)`).text(msg.money);
                    break;
                }
            }
        });
    });

    var pic_num = 0;
    var research_time = $('#researchPause').text().split(' ')[0];
    var timeout = $('#timeout').text().split(' ')[0];

    function startAuction() {
        socket.json.emit('startauction', {time: research_time, msg: 'Bidding starts in: '});
        socket.json.emit('refreshtimer', {time: research_time});
        changePicture();
        refresh(research_time);
    }

    function auctionStep() {
        socket.json.emit('auctionstep', {msg: 'Auction'});
        socket.json.emit('refreshtimer', {time: timeout});
        refresh(timeout);
        $('#timerLabel').text("Bidding started. Auction stops in:")
    }

    function researchStep() {
        socket.json.emit('researchstep', {msg: 'Information timeout'});
        socket.json.emit('refreshtimer', {time: research_time});
        refresh(research_time);
        $('#timerLabel').text("Bidding starts in:")
    }

    function changePicture() {
        socket.json.emit('changepicture', {ind: pic_num++});
    }

    function stopAuction() {
        socket.json.emit('stopauction', {ind: pic_num});
        socket.json.emit('admin', {value: "AUCTION FINISHED"});
        $('#timerLabel').text("AUCTION FINISHED");
        $('#timer').hide();
        $('#timeLabel').hide();
        $("#time").hide();
    }

    $('#start').on('click', function () {
        startAuction();
        socket.json.emit('admin', {value: "Bidding starts!"});
        $('#start').hide();
        $('#timerLabel').text("Starts in:");
        $('#timeLabel').text("Bidding lasts:");
        var m = 0;
        var i = 1;
        $("#time").everyTime(1000, function() {
            i++;
            if(Number(i) == 60) {
                i = 1;
                m = m + 1;
            }
            let time=(m <= 9 ? "0"+m : m) + ":" + (i <= 9 ? "0" + i : i);
            $(this).text(time);
        });
    });

    var sec = 0;
    var isNewAuctStep = true;
    var picsnum = Number($('#picsnum').text());
    var iter = 0;

    function refresh(min)
    {
        if(--sec == -1) {
            sec = 59;
            min = min - 1;
        }
        let time=(min <= 9 ? "0"+min : min) + ":" + (sec <= 9 ? "0" + sec : sec);
        if (document.getElementById){timer.innerHTML=time;}
        inter = setTimeout(function() {refresh(min);}, 1000);
        if(min=='00' && sec=='00'){
            sec="0";
            clearInterval(inter);
            iter++;
            if (iter < picsnum*2) {
                if (isNewAuctStep) {
                    auctionStep();
                    isNewAuctStep = false;
                } else {
                    changePicture();
                    researchStep();
                    isNewAuctStep = true;
                }
            } else {
                stopAuction()
            }
        }
    }
});


jQuery.fn.extend({
    everyTime: function(interval, label, fn, times) {
        return this.each(function() {
            jQuery.timer.add(this, interval, label, fn, times);
        });
    },
    oneTime: function(interval, label, fn) {
        return this.each(function() {
            jQuery.timer.add(this, interval, label, fn, 1);
        });
    },
    stopTime: function(label, fn) {
        return this.each(function() {
            jQuery.timer.remove(this, label, fn);
        });
    }
});

jQuery.extend({
    timer: {
        global: [],
        guid: 1,
        dataKey: "jQuery.timer",
        regex: /^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/,
        powers: {
            // Yeah this is major overkill...
            'ms': 1,
            'cs': 10,
            'ds': 100,
            's': 1000,
            'das': 10000,
            'hs': 100000,
            'ks': 1000000
        },
        timeParse: function(value) {
            if (value == undefined || value == null)
                return null;
            var result = this.regex.exec(jQuery.trim(value.toString()));
            if (result[2]) {
                var num = parseFloat(result[1]);
                var mult = this.powers[result[2]] || 1;
                return num * mult;
            } else {
                return value;
            }
        },
        add: function(element, interval, label, fn, times) {
            var counter = 0;

            if (jQuery.isFunction(label)) {
                if (!times)
                    times = fn;
                fn = label;
                label = interval;
            }

            interval = jQuery.timer.timeParse(interval);

            if (typeof interval != 'number' || isNaN(interval) || interval < 0)
                return;

            if (typeof times != 'number' || isNaN(times) || times < 0)
                times = 0;

            times = times || 0;

            var timers = jQuery.data(element, this.dataKey) || jQuery.data(element, this.dataKey, {});

            if (!timers[label])
                timers[label] = {};

            fn.timerID = fn.timerID || this.guid++;

            var handler = function() {
                if ((++counter > times && times !== 0) || fn.call(element, counter) === false)
                    jQuery.timer.remove(element, label, fn);
            };

            handler.timerID = fn.timerID;

            if (!timers[label][fn.timerID])
                timers[label][fn.timerID] = window.setInterval(handler,interval);

            this.global.push( element );

        },
        remove: function(element, label, fn) {
            var timers = jQuery.data(element, this.dataKey), ret;

            if ( timers ) {

                if (!label) {
                    for ( label in timers )
                        this.remove(element, label, fn);
                } else if ( timers[label] ) {
                    if ( fn ) {
                        if ( fn.timerID ) {
                            window.clearInterval(timers[label][fn.timerID]);
                            delete timers[label][fn.timerID];
                        }
                    } else {
                        for ( var fn in timers[label] ) {
                            window.clearInterval(timers[label][fn]);
                            delete timers[label][fn];
                        }
                    }

                    for ( ret in timers[label] ) break;
                    if ( !ret ) {
                        ret = null;
                        delete timers[label];
                    }
                }

                for ( ret in timers ) break;
                if ( !ret )
                    jQuery.removeData(element, this.dataKey);
            }
        }
    }
});

jQuery(window).bind("unload", function() {
    jQuery.each(jQuery.timer.global, function(index, item) {
        jQuery.timer.remove(item);
    });
});