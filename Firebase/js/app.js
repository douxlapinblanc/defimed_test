define('app', ['jquery','jqueryui','utils'], function($,jiu,u) {

    const PATIENTS_NUMBER = 5;
	const SPAWN_TIME =1 ;
	const GAME_NEG_TIME = 3;
	
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
		
		//Fonctions communicantes :
        patient.onLeaveBox(leaveBox);
		
		
        waitingLine.push(patient);
        console.log(patient);
    }
	
	

        function gameOver() {
			var gamelog = "Durée de la partie : " + game_pos_time + "\n" 	+ "Nombre de box : " + boxNumber + "\n" + "Fréquence d'apparition des patients : " + SPAWN_TIME + " secondes" + "\n" + "Délais d'apparition du stress : " + GAME_NEG_TIME + " secondes" + "\n\n";
            var generallog = u.getGeneralLog();
			console.log(gamelog + generallog);
			/*
			//Push to firebase DB :  
			// Get a reference to the database service
			var database = firebase.database();
			
			firebase.database().ref('users/' + UID).set({
			Gamelog : gamelog
			});*/
			
			
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
		
		var boxPatients = [];//ce tableau (a 4 case?) va recevoir les instances de la classe Patient.
		
		remainingPatients = waitingLine.length;
		//Affiche le nombre de patient
        $('#totalPatNum').text(waitingLine.length);
		
		//Randomise les patients dans la waiting line.
        if (randomGame) {
            var count = waitingLine.length - PATIENTS_NUMBER;
            for (var i = 0; i < count; i++) {
                var ri = Math.floor(Math.random() * waitingLine.length); // Random Index position in the array
                waitingLine.splice(ri, 1);
            }
        }
		

        
		
		//Fonction : Respawn
        var bringNextPatient = function($box) {
            var id = parseInt($box.prop('id').split('-')[1]);
            boxPatients[id] = waitingLine[patientCount];//le box devient l'instance de la classe patient
            if (boxPatients[id]) {
                boxPatients[id].patientProgress = '#patientTimerProgress-' + id;
                boxPatients[id].patientCooldown = '#cooldownTimerProgress-' + id;
                $box.addClass('occupied');
                $box.addClass('selectable');
                boxPatients[id].box = $box;//Transmet a la classe Patient le box dans lequel il vient d'entrer.
                patientCount++;
                //$('#patNum').text(patientCount);*
				
				//Image de fond
                if (boxPatients[id].patientImage) {
                    $box.css('background-image', 'url(' + boxPatients[id].patientImage + ')');
                }
               
				//fonction communication pour pouvoir accéder a update tabs depuis patient.js
				boxPatients[id].onRefreshtabs(updatetabs);

				//Rend le patient-box draggable
				$box.draggable({
				cancel: false,
				revert: true,
				scroll : false
				});
				
				//Appel la fonction d'initialisation de la classe patient.
				boxPatients[id].initialise();
            }
        }
		
		
			
            //Fonction : les timers
			var startGeneralTimer = function() {
            general_timer = setInterval(function() {
                //disableUserInterface();
                if ($('.occupied').length !== 0) {
                    game_neg_time--;
                    game_pos_time++;
                    $('#gameTime').text(game_neg_time);
                }
                if (game_neg_time === 0) {
                    console.log("STRESSSS NOW");
					gameOver();
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

		//Fonction : clic droit => menu
        var drawContextManu = function(event, $this) {
            if (!$this.hasClass('cooling')) {

				$('#menu-ui').show().menu().position({
					//my: "right top",
					//at: "right bottom",
					of: $this,
					collision: "none",
					select: function( event, ui ) {}
				});
            }
        };

		
		//Fonction creation des différents box 
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
		
		
		//Evenement click sur les items du menu
		$( "#menu-ui" ).on( "menuselect", function( event, ui ) {
			var id = parseInt($('.selected').prop('id').split('-')[1]);
			item = ui.item.text();
			switch (item) {
				//INTERROGATOIRE ICI
				case "Antécédants" :
					boxPatients[id].onATCD();
					break;
				case "Habitus" :
					boxPatients[id].onHabitus();
					break;
				case "Histoire récente" :
					boxPatients[id].onHdlm();
					break;
				case "Traitements" :
					boxPatients[id].onTraitements();
					break;
				case "Motif de venue" :
					boxPatients[id].onMotif;
					break;
				//EXAMEN CLINIQUE ICI
				case "Douleur" :
					boxPatients[id].onDouleur();
					break;
				case "Etat général" :
					boxPatients[id].onAEG();
					break;
				case "Neuro" :
					boxPatients[id].onNeuro();
					break;
				case "ORL" :
					boxPatients[id].onORL()
					break;
				case "Cardio" :
					boxPatients[id].onCardio();
					break;
				case "Pneumo" :
					boxPatients[id].onPneumo();
					break;
				case "Neuro" :
					boxPatients[id].onNeuro();
					break;
				case "Abdo" :
					boxPatients[id].onAbdo();
					break;
				case "Uro-Gynéco" :
					boxPatients[id].onUroGyneco();
					break;
				case "Ortho-Rhumato" :
					boxPatients[id].onOrthoRhumato()
					break;
				//BIOLOGIE ICI
				case "Standard" :
					console.log('bio standard');
					//Affiche la dialog-radio pour la bio-standard
					$( "#menu-bio" ).dialog({
						modal: true,
						buttons: {
						Ok: function() {
							var chaine = [];
								$("#menu-bio .ui-checkboxradio-checked").each(function(index, item){
									//console.log("check : " + $(this).prop('for'));
									chaine[index] = $(this).prop('for');
								});
							boxPatients[id].onBio(chaine);//déclenche l'évenement onBio dans la classe patient.
							$( this ).dialog( "close" );
						}
						}
					});
					break;
				case "Spécifique" :
					console.log('bio standard');
					//Affiche la dialog-radio pour la bio-standard
					$( "#menu-bio2" ).dialog({		
						modal: true,
						buttons: {
						Ok: function() {
							var chaine = [];
								$("#menu-bio2 .ui-checkboxradio-checked").each(function(index, item){
									//console.log("check : " + $(this).prop('for'));
									chaine[index] = $(this).prop('for');
								});
						    var id = parseInt($('.selected').prop('id').split('-')[1]);
							boxPatients[id].onBio(chaine);//déclenche l'évenement onBio dans la classe patient.
							$( this ).dialog( "close" );
						}
						}
					});
				case "Radiographies":
					boxPatients[id].onRadio();
					break;
				case "Echographie":
					boxPatients[id].onEcho();
					break;
				case "TDM/IRM":
					boxPatients[id].onTDM();
					break;
				case "ECG":
					boxPatients[id].onECG();
					break;
				case "Bandelette urinaire":
					boxPatients[id].onBU();
					break;
				case "Ponction lombaire":
					boxPatients[id].onPL();
					break;
				case "Gaz du sang":
					boxPatients[id].onGDS();
					break;
			}
		
		
		} );
		//Evenement sort du menu
	    $( "#menu-ui" ).mouseleave(function () {
			$( "#menu-ui" ).menu('collapseAll');
        });
	

		
		//Initialise le jeu : les box + les timers
        drawBoxes(boxNumber);
        $boxes = $('.box');
        startGeneralTimer();
		
		
		//Fonction affiche l'onglet result
		var updatetabs = function($patient) {
			/*if(!$patient.hasClass('selected')){
				$('#tabs').tabs("disable");
			}
			else{*/
				$('#tabs').tabs("enable");
				var id = parseInt($patient.prop('id').split('-')[1]);
				
				//récupere les valeurs et mettre a zero sinon bug a la con (undefined)
				var observ = boxPatients[id].observText;
				if (!observ){ 
					observ = "";
				}
				var bio = boxPatients[id].resultText;
				if (!bio){ 
					bio = "";
				}
				var imagesArr = boxPatients[id].resultImg;
				var cr = boxPatients[id].resultImgCR;
				if (!cr){ 
					cr = "";
				}
				var courrier =  boxPatients[id].courrier;
				if (!courrier){ 
					courrier = "";
				}
				
				//Change le texte
				$('#observ' ).text(observ);
				$('#bio').text(bio);
				$('#courrier').attr('src', courrier);
				
				
				//Construit un tableau d'images.
				var resultHTML = '';
				if (imagesArr.length !== 0) {
					for (var i = imagesArr.length ; i > 0; i--) {
						//console.log(i);
						resultHTML += '<img class="mySlides" src="' + imagesArr[i-1] + '">';
						$('#cr').text(cr[i]);
					}
					$('#cr').text(cr[imagesArr.length - 1]);
					//$('#cr').text(cr[imagesArr.length]);
					if (imagesArr.length > 1) {
						resultHTML += '<div id="arrowDiv"><a class="arrow arrow-left" >&#10094;</a>' +
							'<a class="arrow arrow-right" >&#10095;</a></div>';
					}
					$('#pacs').html(resultHTML);
					
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
					/*$('#tabs-3').html(resultHTML);
					$('#cr').text(cr);*/
				}
			//}
        }
		
		
		//EVENEMENT : Click sur un box
        $boxes.click(function(e) {
            if ($(this).hasClass('selectable') && (!$(this).hasClass('selected')) ) {
                $(this).addClass('selected');
				
				//$( this ).draggable( "option", "disabled", false );
				var id = parseInt($(this).prop('id').split('-')[1]);
				//console.log('id = ' + id + "\ntext : " + boxPatients[id].observText);
				
				//Rafraichir l'UI
				updatetabs($(this));
				
				//Parcours les autres box et les déselectionne tous
                $boxes.not($(this)).each(function(index, item) {
					if ($(item).hasClass('selectable')){
							$(item).removeClass('selected');
							//$(item).draggable( "disable" );
						}
					
					//?
					var id = parseInt($(item).prop('id').split('-')[1]);
					if (boxPatients[id]) {
						boxPatients[id].inResult = false;
					}
                });
				
			//Desactive le popup s'il y en a un en cours.
            $(this).find('.popupContainer').hide();
            }

        });

		//EVENEMENT : Click en dehors du jeu
        $('body').click(function(e) {
			//desactive menudéroulant
            $('#menu-ui').hide();
            $boxes.each(function(index, item) {
                var id = parseInt($(item).prop('id').split('-')[1]);
                if (boxPatients[id]) {
                    boxPatients[id].inContextMenu = false;
                }
            });
			//Si click en dehors de ResultContainer, ferme le.
            if (!$(e.target).is('#result') && !$(e.target).is('.arrow')) {
                $('#resultContainer').hide();
                if ($('.selected').length !== 0) {
                    var id = parseInt($('.selected').prop('id').split('-')[1]);
                    if (boxPatients[id]) {
                        boxPatients[id].inResult = false;
                    }
  
                }
            }
			//desactive l'UI si rien n'est selectioné
           /* if ($('.selected').length === 0) {
                $('.btn').attr('disabled', 'disabled');
            }*/
			
        });

		//Desactive le menu clic droit du navigateur ?
        $('body').contextmenu(function(e) {
            e.preventDefault();
        });

		//???
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

            drawContextManu(e, $(this));
			 	


            e.preventDefault();
        });

		//??? Annule le clic droit du defaut du navigateur ?
        $(document).on('contextmenu', '.selected', function(e) {
            drawContextManu(e, $(this));
            e.preventDefault();
        });

		
	
		$( "#tabs" ).tabs({
		activate: function( event, ui ) {
			//Lorsque tab est déployée
		}
		});
	
		
		//Gestion des zones de drag drop.
		$('#drop_hospit').droppable({
			accept : '.box',
			drop: function( event, ui ) {
				var id = parseInt(ui.draggable.prop('id').split('-')[1]);
				boxPatients[id].onHospit();
				console.log("HOSPIT");
			}
		});
		$('#drop_RAD').droppable({
			accept : '.box',
			drop : function(event, ui){
				var id = parseInt(ui.draggable.prop('id').split('-')[1]);
				boxPatients[id].onRAD();
				console.log("RAD");
			}
		});
    }

    return {
        init: function() {
            _registerEventHandlers();
        },

        registerPatient: registerPatient
    };
});