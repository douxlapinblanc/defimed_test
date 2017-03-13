define('app', ['jquery','utils'], function($,u) {

    const PATIENTS_NUMBER = 5;
	const SPAWN_TIME = 4
	const GAME_NEG_TIME = 200;
	
    var randomGame = false;
    var patientCount = 0;
    var boxNumber = 4;
    var general_timer;
		var spawn_time = SPAWN_TIME
		var game_neg_time = GAME_NEG_TIME ;
		var game_pos_time = 0;
		
    var waitingLine = [];
    //var remainingPatients = waitingLine.length;

    function registerPatient(patient) {
        //patient.onAddResult(addResult);
        patient.onLeaveBox(leaveBox);
        waitingLine.push(patient);
        console.log(patient);
    }
        function gameOver() {
			var gamelog = "Durée de la partie : " + game_pos_time + "\n" 	+ "Nombre de box : " + boxNumber + "\n" + "Fréquence d'apparition des patients : " + SPAWN_TIME + " secondes" + "\n" + "Délais d'apparition du stress : " + GAME_NEG_TIME + " secondes" + "\n\n";
            var generallog = u.getGeneralLog();
			console.log(gamelog + generallog);
        }	
		
    function leaveBox() {

        remainingPatients--;
	    console.log("remaing patient = " + remainingPatients);
        if (remainingPatients == 0) {
            gameOver();
            //clearInterval(respawning_timer);
        }
    }

   /* function addResult(text, resultText) {
       var a = "\n" + game_pos_time + ": " + text;
        resultText = resultText + a;
        console.log(resultText);
    }*/

    function _registerEventHandlers() {
		
		remainingPatients = waitingLine.length;
		//Affiche le nombre de patient
        $('#totalPatNum').text(waitingLine.length);
		
		//Randomise les patients si activé
        if (randomGame) {
            var count = waitingLine.length - PATIENTS_NUMBER;
            for (var i = 0; i < count; i++) {
                var ri = Math.floor(Math.random() * waitingLine.length); // Random Index position in the array
                waitingLine.splice(ri, 1);
            }
        }
		
        var boxPatients = [];
        var bringNextPatient = function($box) {
            var id = parseInt($box.prop('id').split('-')[1]);
            boxPatients[id] = waitingLine[patientCount];
            if (boxPatients[id]) {
                boxPatients[id].patientProgress = '#patientTimerProgress-' + id;
                boxPatients[id].patientCooldown = '#cooldownTimerProgress-' + id;
                $box.addClass('occupied');
                $box.addClass('selectable');
                boxPatients[id].box = $box;
                patientCount++;
                $('#patNum').text(patientCount);
                if (boxPatients[id].patientImage) {
                    $box.css('background-image', 'url(' + boxPatients[id].patientImage + ')');
                }
                boxPatients[id].initialise();
            }
        }
			
            //Timers du jeu et non du patient. GameTime est le temps décroissant / GeneralTimer =  respawning / 
			var startGeneralTimer = function() {
            general_timer = setInterval(function() {
                disableUserInterface();
                if ($('.occupied').length !== 0) {
                    game_neg_time--;
                    game_pos_time++;
                    $('#gameTime').text(game_neg_time);
                }
                if (game_neg_time === 0) {
                    console.log("STRESSSS NOW");
                    //clearInterval(respawning_timer);
                    //Ici la fonction stress !
                    //return false;
                }

                if (spawn_time === 0) {
                    $boxes.each(function(index, item) {
                        $box = $(item);
                        if (!$box.hasClass('occupied')) {
                            // Check if the waiting line is empty
                            bringNextPatient($box);
                            return false;
                        }
                    });
                    spawn_time = SPAWN_TIME + 1; //Reset le timer spawning.
                }
                spawn_time--;
            }, 1000);
        };

		//Initialise le jeu : les box + les timers

        drawBoxes(boxNumber);
        $boxes = $('.box');
        startGeneralTimer();

		
		//Selection d'un patient
        $boxes.click(function(e) {
            if ($(this).hasClass('selectable')) {
                $(this).toggleClass('selected');
                $boxes.not($(this)).each(function(index, item) {
                    $(item).removeClass('selected');
                    var id = parseInt($(item).prop('id').split('-')[1]);
                    if (boxPatients[id]) {
                        boxPatients[id].inResult = false;
                    }
                });
				
				//si pas de cooldown en cours, on peut activer l'userinterface.
				if (!($('.selected').hasClass('cooling'))){
					$('.btn').removeAttr('disabled');
				}
            }
            $(this).find('.popupContainer').hide();
        });

        $('body').click(function(e) {
            $('#contextMenu').hide();
            $boxes.each(function(index, item) {
                var id = parseInt($(item).prop('id').split('-')[1]);
                if (boxPatients[id]) {
                    boxPatients[id].inContextMenu = false;
                }
            });
            if (!$(e.target).is('#result') && !$(e.target).is('.arrow')) {
                $('#resultContainer').hide();
                if ($('.selected').length !== 0) {
                    var id = parseInt($('.selected').prop('id').split('-')[1]);
                    if (boxPatients[id]) {
                        boxPatients[id].inResult = false;
                    }
                    $('.bAction').removeAttr('disabled');
                }

            }
            disableUserInterface();
        });

        $('body').contextmenu(function(e) {
            e.preventDefault();
        });

        $(document).on('contextmenu', '.selectable', function(e) {
            $(this).addClass('selected');
            var id = parseInt($('.selected').prop('id').split('-')[1]);
            if (boxPatients[id]) {
                boxPatients[id].hidePopup();
                boxPatients[id].inContextMenu = true;
            }
            $boxes.not($(this)).each(function(index, item) {
                $(item).removeClass('selected');
            });
            $('.btn').removeAttr('disabled');
            drawContextManu(e, $(this));
            e.preventDefault();
        });

        $(document).on('contextmenu', '.selected', function(e) {
            drawContextManu(e, $(this));
            e.preventDefault();
        });

        $('#b1').click(function() {
            var id = parseInt($('.selected').prop('id').split('-')[1]);
            if ((boxPatients[id] !== undefined) && (typeof boxPatients[id].onB1 === 'function')) {
                boxPatients[id].onB1();
            }
        });

        $('#b2').click(function() {
            var id = parseInt($('.selected').prop('id').split('-')[1]);
            if ((boxPatients[id] !== undefined) && (typeof boxPatients[id].onB2 === 'function')) {
                boxPatients[id].onB2();
            }
        });

        $('#b3').click(function() {
            var id = parseInt($('.selected').prop('id').split('-')[1]);
            if ((boxPatients[id] !== undefined) && (typeof boxPatients[id].onB3 === 'function')) {
                boxPatients[id].onB3();
            }
        });

        $('#a1').click(function() {
            var id = parseInt($('.selected').prop('id').split('-')[1]);
            if ((boxPatients[id] !== undefined) && (typeof boxPatients[id].onA1 === 'function')) {
                boxPatients[id].onA1();
            }
        });

        $('#a2').click(function() {
            var id = parseInt($('.selected').prop('id').split('-')[1]);
            if ((boxPatients[id] !== undefined) && (typeof boxPatients[id].onA2 === 'function')) {
                boxPatients[id].onA2();
            }
        });

        $('#a3').click(function() {
            var id = parseInt($('.selected').prop('id').split('-')[1]);
            if ((boxPatients[id] !== undefined) && (typeof boxPatients[id].onA3 === 'function')) {
                boxPatients[id].onA3();
            }
        });

        $('#result').click(function() {
            var id = parseInt($('.selected').prop('id').split('-')[1]);
            boxPatients[id].inResult = true;
            if (boxPatients[id] !== undefined) {
                boxPatients[id].box.find('.popupContainer').hide();
                if ($('#resultContainer').css('display') === 'block') {
                    $('#resultContainer').hide();
                } else {
                    drawResultWindow(boxPatients[id].resultText, boxPatients[id].resultImg);
                }
            }

        });

		//Affiche le menu du clic droit.
        var drawContextManu = function(event, $this) {
            if (!$this.hasClass('cooling')) {
                var id = parseInt($this.prop('id').split('-')[1]);
                var $contextMenu = document.getElementById('contextMenu');
                var mousePosition = {};
                var menuPostion = {};
                var menuDimension = {};

                $('#a1 .aActionText').text(boxPatients[id].aActions.A1);
                $('#a2 .aActionText').text(boxPatients[id].aActions.A2);
                $('#a3 .aActionText').text(boxPatients[id].aActions.A3);

                menuPostion.x = event.pageX;
                menuPostion.y = event.pageY;

                $contextMenu.style.left = menuPostion.x + 'px';
                $contextMenu.style.top = menuPostion.y + 'px';
                $contextMenu.style.display = 'block';
            }
        };

        var disableUserInterface = function() {
            if ($('.selected').length === 0) {
                $('.btn').attr('disabled', 'disabled');
            }
        }
        var enableUserInterface = function() {
            if ($('.selected').length === 0) {
                $('.btn').attr('enabled', 'en');
            }
        }

		//Affiche l'onglet Resultats
        var drawResultWindow = function(text, imagesArr) {
            $('.bAction').attr('disabled', 'disabled');
            $('#resultContainer').show();
			//Affiche le texte du patient selectioné, mais verifi qu'il n'est pas vide avant.
            if (text) {
                $('#textArea').text(text);
            } else {
                $('#textArea').text('');
            }
            var resultHTML = '';

            if (imagesArr.length !== 0) {
                for (var i = 0; i < imagesArr.length; i++) {
                    resultHTML += '<img class="mySlides" src="' + imagesArr[i] + '">';
                }
                if (imagesArr.length > 1) {
                    resultHTML += '<div id="arrowDiv"><a class="arrow arrow-left" >&#10094;</a>' +
                        '<a class="arrow arrow-right" >&#10095;</a></div>';
                }
                $('#slideDiv').html(resultHTML);
                var slideIndex = 1;
                showDivs(slideIndex);
                $(document).on('click', '.arrow-left', function() {
                    plusDivs(-1);
                });
                $(document).on('click', '.arrow-right', function() {
                    plusDivs(1);
                });
                function plusDivs(n) {
                    showDivs(slideIndex += n);
                }
                function showDivs(n) {
                    var i;
                    var x = document.getElementsByClassName("mySlides");
                    if (n > x.length) { slideIndex = 1 }
                    if (n < 1) { slideIndex = x.length };
                    for (i = 0; i < x.length; i++) {
                        x[i].style.display = "none";
                    }
                    x[slideIndex - 1].style.display = "block";
                }
            } else {
                $('#slideDiv').html(resultHTML);
            }
        }

        function drawBoxes(boxNumber) {
            if (boxNumber === 1) {
                $('#boxes').css('margin-left', '200px');
            }
            var boxesHTML = '';
            for (var i = 0; i < boxNumber; i++) {
                boxesHTML += '<div class="box" id="box-' + i + '">' +
                    '<div class="patientTimerProgress" id="patientTimerProgress-' + i + '"></div>' +
                    '<div class="cooldownTimerProgress" id="cooldownTimerProgress-' + i + '"></div>' +
                    '<div class="popupContainer" id="popupContainer-' + i + '"></div>' +
                    '</div>';
            }
            $('#boxes').html(boxesHTML);
        }



    }

    return {
        init: function() {
            _registerEventHandlers();
        },

        registerPatient: registerPatient
    };
});