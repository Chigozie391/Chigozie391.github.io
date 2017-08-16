$(function() {

    var $questNo = $('#questNo');
    var $test = $('#questions');

    var pos = 0;
    var $choices, $choice, question, chA, chB, chC, insertQuest, correctAns;
    var correct = 0;


    var questionsArray = [

        ["Who is the Minister of  Eductaion", "Jeffery Archer", "Mohammed Archer", "Jesse Archer", "A"],
        ["How old is Nigeria", "50", "49", "51", "C"],
        ["What is the capital of United State of America", "Michigan", "Washington", "California", "B"],
        ["Who let the cat out of the bag", "Abraham", "Micheal Jackson", "None of the above", "C"],

    ];

    function renderQuestion() {
        insertPos = 'Question ' + (pos + 1) + ' of ' + questionsArray.length;

        if (pos >= questionsArray.length) {
            $questNo.html('You got ' + correct + ' question(s) right out of ' + questionsArray.length + ' questions');
            $test.html('You have completed this Quize');
            $('#submit').attr('disabled', true);
            $('#submit').text('Thanks');

        } else {

            question = questionsArray[pos][0];
            chA = questionsArray[pos][1];
            chB = questionsArray[pos][2];
            chC = questionsArray[pos][3];

            insertQuest = question + "<br/ >";
            insertQuest += "<input type = 'checkbox' id = 'choices' value = 'A'/>" + chA + "<br />";
            insertQuest += "<input type = 'checkbox' id = 'choices' value = 'B'/>" + chB + "<br />";
            insertQuest += "<input type = 'checkbox' id = 'choices' value = 'C'/>" + chC + "<br />";

            $questNo.html(insertPos);
            $test.html(insertQuest).hide().fadeIn('slow');
        }

    }

    function checkAnswer() {
        $choices = $('input');
        for (var i = 0; i < $choices.length; i++) {
            if ($choices[i].checked) {
                $choice = $choices[i].value;
                console.log($choice);
            }
        }
        if ($choice === questionsArray[pos][4]) {
            correct++;
            console.log(correct);
        }
        pos++;
        renderQuestion();
    }


    $('#submit').on('click', checkAnswer);
    renderQuestion();
});