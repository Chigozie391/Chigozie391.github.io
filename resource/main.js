$(function() {

    var newData = $.ajax({
        type: 'GET',
        url: 'package.json',
        global: false,
        async: false,
        success: function(jdata) {
            return jdata;
        }
    }).responseText;

    var data = JSON.parse(newData);

    var $questNo = $('#questNo');
    var $test = $('#questions');
    var timer = document.getElementById('time');

    var numberOfQuestion;
    var isSubmitted;
    var correct = 0;
    var pos = 0;
    var answerDataArray = [];
    var $choices, question, chA, chB, chC, insertQuest;
    var username;



    function getName() {
        if (localStorage.getItem('name')) {
            var name = localStorage.getItem('name');
            username = name.substr(0, 1).toUpperCase() + name.substr(1).toLowerCase();
            var $getName = $('<h2>').text('Welcome, ' + username);
            $('#username').append($getName);
        }
    }

    getName();

    if (localStorage.getItem('isSubmitted')) {
        correct = parseInt(localStorage.getItem('correct'));
        alreadyPart(correct, data);
        return false;
    }

    var timeInMinutes = 1;
    var countDown;

    if (sessionStorage.getItem('myclock')) {
        countDown = parseFloat(sessionStorage.getItem('myclock'));
    } else {
        countDown = new Date(new Date().getTime() + (timeInMinutes * 60 * 1000)).getTime();
    }

    var updateTimer = setInterval(function() {
        var now = new Date().getTime();
        var deadline = countDown - now;

        var minutes = Math.floor((deadline % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((deadline % (1000 * 60)) / (1000)) + 1;


        timer.innerHTML = ('0' + minutes).slice(-2) + 'm' + ' : ' + ('0' + seconds).slice(-2) + 's';

        if ((minutes < 1) && (seconds <= 0)) {
            sessionStorage.clear();
            for (var i = 0; i < data.questionsArray.length; i++) {
                nextQues(data);
            }
            timer.innerHTML = 'EXPIRED';
            submit(data);
            clearInterval(updateTimer);
        } else {
            sessionStorage.setItem('myclock', countDown);
        }

    }, 1000);



    function renderQuestion(data) {

        if (pos === data.questionsArray.length - 1) {
            $next.hide();
            $submit.toggle();
        }

        insertPos = 'Question ' + (pos + 1) + ' of ' + data.questionsArray.length;
        question = data.questionsArray[pos].question;
        chA = data.questionsArray[pos].chA;
        chB = data.questionsArray[pos].chB;
        chC = data.questionsArray[pos].chC;
        chD = data.questionsArray[pos].chD;


        insertQuest = question + "<br/ >";
        insertQuest += "<input type = 'radio' name = 'choice' id = 'choices' value = 'A'/>" + chA + "<br />";
        insertQuest += "<input type = 'radio' name = 'choice' id = 'choices' value = 'B'/>" + chB + "<br />";
        insertQuest += "<input type = 'radio' name = 'choice' id = 'choices' value = 'C'/>" + chC + "<br />";
        insertQuest += "<input type = 'radio' name = 'choice' id = 'choices' value = 'D'/>" + chD + "<br />";


        $questNo.html(insertPos);
        $test.html(insertQuest).hide().fadeIn('slow');
        storedAnswer();
    }


    function storedAnswer() {
        var radio = document.getElementsByName('choice');
        var storagedata = localStorage.getItem(pos);
        for (var i = 0; i < radio.length; i++) {
            if (radio[i].value == storagedata) {
                radio[i].checked = true;
            }
        }

        $('input[name = choice]').on('change', function() {
            localStorage.setItem(pos, $(this).val());
        });
    }


    function nextQues(data) {

        $choices = $('input');
        var numChecked = 0;
        $choices.each(function() {
            if ($(this).is(':checked')) {
                numChecked++;
                answerDataArray.splice(pos, 1, $(this).val());
            }
        });
        if (numChecked === 0) answerDataArray.splice(pos, 1, null);

        pos++;

        if (pos < data.questionsArray.length) {
            renderQuestion(data);
        }
        //  console.log(answerDataArray);
    }


    function previousQues(data) {
        if (pos >= 1) {
            pos--;
            renderQuestion(data);
        }
        if ($next.css('display') == 'none') {
            $next.css('display', 'inline');
        }
        $submit.hide();
    }


    function submit(data) {
        nextQues(data);

        for (var i = 0; i < data.questionsArray.length; i++) {
            if (data.questionsArray[i].answer === answerDataArray[i]) {
                correct++;
            }
        }
        $submit.detach();
        $next.detach();
        $prev.detach();
        result(correct, data);
        clearInterval(updateTimer);
        sessionStorage.clear();
        isSubmitted = true;
        localStorage.setItem('isSubmitted', isSubmitted);
        localStorage.setItem('correct', correct);
    }


    function result(correct, data) {
        $questNo.html('You got ' + correct + ' question(s) right out of ' + data.questionsArray.length + ' Questions');
        $test.html('You have completed this Quiz, Thanks for Participating');
    }


    function alreadyPart(correct, data) {
        $questNo.html('You got ' + correct + ' question(s) right out of ' + data.questionsArray.length + ' Questions');
        $test.html('Hi ' + username + ', You have already participated in this exercise. Thank you.');
    }



    renderQuestion(data);

    $prev = $("<button id ='prev'>prev</button>").appendTo('.container');
    $next = $("<button id ='next'>Next</button>").appendTo('.container');
    $submit = $("<button id ='submit'>submit</button>").appendTo('.container').hide();


    $next.on('click', function() {
        nextQues(data);
    });
    $prev.on('click', function() {
        previousQues(data);
    });
    $submit.on('click', function() {
        submit(data);
    });

});