$(function() {

    var $questNo = $('#questNo');
    var $test = $('#questions');

    var pos = 0;
    var $choices, $choice, question, chA, chB, chC, insertQuest;
    var correct = 0;

    var json = $.getJSON('resource/package.json');

    function renderQuestion() {

        json.done(function(data) {

            if (pos >= data.questionsArray.length) {
                $questNo.html('You got ' + correct + ' question(s) right out of ' + data.questionsArray.length + ' questions');
                $test.html('You have completed this Quiz');
                $('#submit').remove();

                return false;
            }

            insertPos = 'Question ' + (pos + 1) + ' of ' + data.questionsArray.length;
            question = data.questionsArray[pos].question;
            chA = data.questionsArray[pos].chA;
            chB = data.questionsArray[pos].chB;
            chC = data.questionsArray[pos].chC;



            insertQuest = question + "<br/ >";
            insertQuest += "<input type = 'checkbox' id = 'choices' value = 'A'/>" + chA + "<br />";
            insertQuest += "<input type = 'checkbox' id = 'choices' value = 'B'/>" + chB + "<br />";
            insertQuest += "<input type = 'checkbox' id = 'choices' value = 'C'/>" + chC + "<br />";

            $questNo.html(insertPos);
            $test.html(insertQuest).hide().fadeIn('slow');
        });
    }


    function checkAnswer() {
        $choices = $('input');
        for (var i = 0; i < $choices.length; i++) {
            if ($choices[i].checked) {
                $choice = $choices[i].value;
                console.log($choice);
            }
        }
        json.done(function(data) {
            if ($choice === data.questionsArray[pos].answer) {
                correct++;
                console.log(correct);
            }
        });

        pos++;
        renderQuestion();
    }



    $('#submit').on('click', checkAnswer);
    renderQuestion();
});