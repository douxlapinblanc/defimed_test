define([
    'jquery',
    'progressbar',
    'utils',
	'app'
], function($, ProgressBar, u,a) {
    'use strict';

    function Patient(patientName, patient_neg_time, patientImage, aActions) {

        this.cooldownAnimation = function(time) {
            this.cooldownReference = time;
            var gray = this.box.find('.cooldownTimerProgress');
            gray.show();
            $('.bAction').attr('disabled', 'disabled');
            this.cooldownBar = new ProgressBar.Circle(this.patientCooldown, {
                strokeWidth: 6,
                duration: time * 1000,
                color: '#FFEA82',
                trailColor: '#eee',
                trailWidth: 1,
                svgStyle: null
            });

            var circle = this.cooldownBar;
            var self = this;
            this.cooldownBar.animate(1, function() {
                circle.destroy();
                gray.hide();
                gray.hide();
                self.cooldownReference = undefined;
            });
        }

        this.patientTimerAnimation = function() {
            this.bar = new ProgressBar.Line(this.patientProgress, {
                strokeWidth: 4,
                duration: this.patient_neg_time * 1000,
                color: '#F01A1A',
                trailColor: '#eee',
                trailWidth: 2,
                svgStyle: { width: '90%', height: '10px' },
                text: {
                    style: {
                        color: '#999',
                        position: 'absolute',
                        right: '0',
                        top: '30px',
                        padding: 0,
                        margin: 0,
                        transform: null
                    },
                    autoStyleContainer: false
                },

            });

            this.bar.animate(1.0);
        }

        this.close = function() {
            if (this.isReturned) {
                this.isClosed = false;
            }
            if (!this.isClosed) {
                if (this.timerReference) {
                    clearTimeout(this.timerReference);
                    this.bar.destroy();
                } else {
                    throw new Error('Close without timer');
                }
                this.box.removeClass('occupied');
                this.box.removeClass('selected');
                this.box.removeClass('selectable');
                this.box.css('background-image', '');
                if (this.inContextMenu) {
                    $('#contextMenu').hide();
                    this.inContextMenu = false;
                }
                this.box.find('.cooldownTimerProgress').hide();
                if (this.inResult) {
                    $('#resultContainer').hide();
                    this.inResult = false;
                }
                this.box.find('.popupContainer').hide();
                this.isClosed = true;
                clearTimeout(this.popupTimeout);
                clearInterval(this.patient_pos_timer);

                //Loguer la fermeture de ce patient
                this.addlog("patient fermé à " + this.patient_pos_time + " secondes");
				
				//Loguer le log de ce patient au log global
                u.addGeneralLog(this.logText);

                this.leaveBoxFn();

            }
        }

        this.onLeaveBox = function(leaveBoxFn) {
            this.leaveBoxFn = leaveBoxFn;
        }

        this.popup = function(txt, time) {
            if (time === undefined) {
                time = 7;
            }
            clearTimeout(this.popupTimeout);
            var pBox = this.box.find('.popupContainer');

            if (this.cooldownReference === undefined) {
                pBox.text(txt).show();
                setTimeout(function() {
                    pBox.hide();
                }, time * 1000);
            } else {
                this.popupTimeout = setTimeout(function() {
                    pBox.text(txt).show();
                    setTimeout(function() {
                        pBox.hide();
                    }, time * 1000);
                }, this.cooldownReference * 1000);
            }

        }

        this.hidePopup = function() {
            this.box.find('.popupContainer').hide();
        }

        this.cooldown = function(factor) {
			//Desactive le bouton Result, et vire le Popup s'il y en a un.
            var selfBox = this.box;
            selfBox.addClass('cooling');
			
            selfBox.toggleClass('selected');
			selfBox.toggleClass('selectable');
			
            selfBox.find('.popupContainer').hide();
			//selfbox.removeClass('selectable');
			
			//Enclenche le cooldown selon le factor temps demandé.
            if (factor === undefined) {
                factor = 1;
            }
            var time = factor * this.cooldownTime;
            this.cooldownAnimation(time);
			
			//A la fin du timer, réactive le bouton résult
            setTimeout(function() {
                selfBox.removeClass('cooling');
				selfBox.toggleClass('selectable');
            }, time * 1000);
        }

        this.addScore = function(score) {
            totalScore += score;
            $('#score').text(totalScore);
        }

        this.startTimer = function() {
            var patient = this;
            this.patient_pos_timer = setInterval(function() {
                patient.patient_pos_time++;
            }, 1000);
            if (this.timerReference === undefined) {
                this.patientTimerAnimation();

                this.timerReference = setTimeout(function() {
                    //patient.close();
					//Ici fonction de stress du patient
                }, this.patient_neg_time * 1000);
            } else {
                throw new Error('StartTimer called twice');
            }

        }

        this.returnToWaitingLine = function() {
            this.isReturned = true;
            remainingPatients++;
            waitingLine.push(this.self);
        }

        this.self = this;
        this.leaveBoxFn;
        this.onAddResultFn;
        this.inResult = false;
        this.inContextMenu = false;

        this.patientName = patientName;
        this.patient_pos_time = 1;
        this.patient_pos_timer;
        this.bar;
        this.cooldownBar;
        this.cooldownReference;
        this.popupTimeout;
        this.aActions = aActions;
        this.isClosed = false;
        this.box;
        this.isReturned = false;
        this.patientProgress;
        this.patientCooldown;
        this.patientImage = patientImage;
        this.patient_neg_time = patient_neg_time;
        this.cooldownTime = 3; //par default (en secondes)
        this.timerReference;
        this.resultImg = [];
        this.resultText;
        this.currentA3 = 0;
        this.currentA2 = 0;
        this.currentA1 = 0;
        this.logText = "Log of user actions";
		this.bonneReponse = false;

        this.initialise = function() {
            this.startTimer();
            this.logText = u.time() + "Nouveau patient '" + this.patientName + "'" + "\n";
            console.log(this.logText);

            if (typeof this.patientInit === 'function') {
                this.patientInit();
            }
        }

        /*this.onAddResult = function(onAddResultFn) {
            this.onAddResultFn = onAddResultFn;
        }*/

        this.addresult = function(text) {
            //this.onAddResultFn(text, this.resultText);
			this.resultText = this.resultText + text + "\n"; 
        }

        this.addlog = function(text) {
            this.logText = this.logText + "<" + this.patientName + ">" + " (" + u.time() + ") " + text + "\n";
			console.log(this.logText);
        }

    }

    return Patient;

});