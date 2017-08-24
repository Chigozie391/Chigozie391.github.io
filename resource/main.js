$(function() {

    var json = $.getJSON('package.json');
    var $questNo = $('#questNo');
    var $test = $('#questions');

    var correct = 0;
    var pos = 0;
    var answerDataArray = [];

    var $choices, question, chA, chB, chC, insertQuest;

    //localStorage.clear();
    var username = localStorage.getItem('name');


    function renderQuestion() {

        json.done(function(data) {

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
        });
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


    function nextQues() {

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
        if (pos < 5) {
            renderQuestion();
        }
        //console.log(answerDataArray);
    }


    function previousQues() {
        if (pos >= 1) {
            pos--;
            renderQuestion();
        }
        if ($next.css('display') == 'none') {
            $next.css('display', 'inline');
        }
        $submit.hide();
    }


    function submit() {
        nextQues();
        json.done(function(data) {
            for (var i = 0; i < data.questionsArray.length; i++) {
                if (data.questionsArray[i].answer === answerDataArray[i]) {
                    correct++;
                }
            }

            $questNo.html('You got ' + correct + ' question(s) right out of ' + data.questionsArray.length + ' Questions');
            $test.html('You have completed this Quize, Thanks for Participating');
            $submit.detach();
            $next.detach();
            $prev.detach();
            console.log(correct);
        });
    }

    renderQuestion();

    $prev = $("<button id ='prev'>prev</button>").appendTo('.container');
    $next = $("<button id ='next'>Next</button>").appendTo('.container');
    $submit = $("<button id ='submit'>submit</button>").appendTo('.container').hide();

    $next.on('click', nextQues);
    $prev.on('click', previousQues);
    $submit.on('click', submit);

});