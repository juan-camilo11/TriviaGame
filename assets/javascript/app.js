$(document).ready(function(){
  
    // event listeners
    $("#remaining-time").hide();
    $("#start").on('click', trivia.startGame);
    $(document).on('click' , '.option', trivia.guessChecker);
    
  })
  
  var trivia = {
    // counters for trivia game
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 20,
    timerOn: false,
    timerId : '',
    // questions
    questions: {
      q1: 'Which country has won the most World Cups?',
      q2: 'Which player has the most goals in World Cup history?',
      q3: 'How many NBA championships did Michael Jordan win?',
      q4: 'Which NFL team has the most superbowl wins?',
      q5: "In soccer and hockey, what is it called when one player scores 3 goals?",
      q6: 'How many football national championships have the Texas Longhorns won?',
      q7: "What is the fastest mile time ever recorded?"
    },
    //answers
    choices: {
      q1: ['Brazil', 'England', 'Germany', 'Argentina'],
      q2: ['Ronaldo', 'Klose', 'Pele', 'Messi'],
      q3: ['5', '2', '3', '6'],
      q4: ['Cowboys', 'Browns', 'Patriots', 'Steelers'],
      q5: ['Homerun','Whisker-Do','Trifecta','Hat-trick'],
      q6: ['4','6','1','2'],
      q7: ['4:00', '3:43', '3:20','3:50']
    },
    //correct answers
    answers: {
      q1: 'Brazil',
      q2: 'Klose',
      q3: '6',
      q4: 'Steelers',
      q5: 'Hat-trick',
      q6: '4',
      q7: '3:43',
    },
    // trivia methods
    // method to initialize game
    startGame: function(){
      // restarting game results
      trivia.currentSet = 0;
      trivia.correct = 0;
      trivia.incorrect = 0;
      trivia.unanswered = 0;
      clearInterval(trivia.timerId);
      
      // show game section
      $('#game').show();
      
      //  empty last results
      $('#results').html('');
      
      // show timer
      $('#timer').text(trivia.timer);
      
      // remove start button
      $('#start').hide();
  
      $('#remaining-time').show();
      
      // ask first question
      trivia.nextQuestion();
      
    },
    // this function will be called at the beginning of the game, and then called after every guess to cycle through all 
    nextQuestion : function(){
      
      // set timer to 20 seconds each question
      trivia.timer = 20;
       $('#timer').removeClass('last-seconds');
      $('#timer').text(trivia.timer);
      
      // to prevent timer speed up
      if(!trivia.timerOn){
        trivia.timerId = setInterval(trivia.timerRunning, 1000);
        trivia.timerOn = true;
      }
      
      // gets all the questions then indexes the current questions
      var questionContent = Object.values(trivia.questions)[trivia.currentSet];
      $('#question').text(questionContent);
      
      // questionOptions becomes an array holding all of the possible answer choices for the current question
      var questionOptions = Object.values(trivia.choices)[trivia.currentSet];
      
      // for each element in the questionOptions array, create a button pertaining to each element
      $.each(questionOptions, function(index, key){
        $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
      })
      
    },
    // this function will decrament the counter and keep track of unanswered questions
    timerRunning : function(){
      // if there is still time left and we have not cycled through all of the possible questions
      if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
        $('#timer').text(trivia.timer);
        trivia.timer--;
        //change color of timer when there are less than 5 seconds left
          if(trivia.timer === 4){
            $('#timer').addClass('last-seconds');
          }
      }
      // time has run out
      else if(trivia.timer === 0){
        $('.option').remove();
        trivia.unanswered++;
        trivia.timerOn = false;
        clearInterval(trivia.timerId);
        setTimeout(trivia.guessResult, 3000);
        $('#results').html('<h3>Out of time! The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
      }
      
      
    },
    // method to evaluate the option clicked
    guessChecker : function() {
      
        trivia.timerOn = false;
      // the answer to the current question being asked
      var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
      
      // if the text of the option picked matches the answer of the current question, increment correct
      if($(this).text() === currentAnswer){
        // remove buttons with option option class sot hey cannot be clicked again
        $('.option').remove();
        
        trivia.correct++;
        //
        clearInterval(trivia.timerId);
        setTimeout(trivia.guessResult, 3000);
        $('#results').html('<h3>Correct Answer!</h3>');
      }
      // else the user picked the wrong option, increment incorrect
      else{
        // remove butttons with option class so they cannot be clicked again
        $('.option').remove();
        
        trivia.incorrect++;
        clearInterval(trivia.timerId);
        setTimeout(trivia.guessResult, 3000);
        $('#results').html('<h3>Better luck next time! The correct answer was: '+ currentAnswer +'</h3>');
      }
      
    },
    // method to remove previous question results and options
    guessResult : function(){
      
      // increment to next question set
      trivia.currentSet++;
      
      $('#results h3').remove();
      
      // if all the questions have been shown end the game, show results else bring up the next question
      if(trivia.currentSet === Object.keys(trivia.questions).length){
        
        // adds results of game (correct, incorrect, unanswered) to the page
        $('#results')
          .html('<h3>Thank you for playing!</h3>'+
          '<p>Correct: '+ trivia.correct +'</p>'+
          '<p>Incorrect: '+ trivia.incorrect +'</p>'+
          '<p>Unaswered: '+ trivia.unanswered +'</p>'+
          '<p>Please play again!</p>');
        
        // hide game sction
        $('#game').hide();
        
        // show start button to begin a new game
        $('#start').show();
      } else {
      // begin next question
      trivia.nextQuestion();
      }
    }
  
  }