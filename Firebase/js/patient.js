define([
    'jquery',
	'jqueryui',
    'progressbar',
    'utils',
	'app'
], function($,ui,ProgressBar, u,a) {
    'use strict';

    function Patient(patientName, patient_neg_time, patientImage, aActions) {

	
	    this.self = this;
		//Fonction transverses
		this.refreshtabs_fonction;
        this.leaveBoxFn;
        this.onAddResultFn;
		
		//?
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
		
		//Contient les données médicales pour le joueur.
        this.resultImg = [];
		this.resultImgCR = [];
        this.resultText = "";
		this.observText = "";

        this.logText = "Log of user actions";
		this.bonneReponse = false;
	
	
        this.initialise = function() {
            this.startTimer();
            this.logText = u.time() + "Nouveau patient '" + this.patientName + "'" + "\n";
            console.log(this.logText);

            /*if (typeof this.patientInit === 'function') {
                this.patientInit();
            }*/
			this.addobserv(this.IAO);
        }
		
		//Donne accès a la fonction updateTabs dans app.js
		this.onRefreshtabs = function(refreshtabs_fonction){
			this.refreshtabs_fonction = refreshtabs_fonction;
			
		}
	
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

        this.cooldown = function(factor,func,args) {

            selfBox.addClass('cooling');
            selfBox.toggleClass('selected');
			selfBox.toggleClass('selectable');
			selfBox.draggable("disable");
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
				if(!($('.selected').length)){
					selfBox.toggleClass('selected');
				}
				
				//if(typeof func =function){
					func(args);
				//}
				me.refreshtabs_fonction(me.box);
            }, time * 1000);
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


		
		//Fonction génere un nombre aléatoire
		this.getRandom = function (min, max) {
				return Math.random() * (max - min) + min;
		}
		
		//Biologie : valeurs par default d'un patient bien portant.
		this.hb = this.getRandom(13,16).toFixed(1);
		this.PNN=this.getRandom(2000,5000).toFixed(0);
		this.lympho = this.getRandom(1500,3000).toFixed(0);
		this.plaq = this.getRandom(150,400).toFixed(0);
		this.na = this.getRandom(135,145).toFixed(0);
		this.k = this.getRandom(3.5,5).toFixed(1);
		this.cl = this.getRandom(90,110).toFixed(0);
		this.hco3 = this.getRandom(20,25).toFixed(1);
		this.CRP = this.getRandom(0,5).toFixed(0);;
		this.creat= this.getRandom(40,80).toFixed(0);
		this.uree = this.getRandom(3,8).toFixed(0);
		this.clairance = this.getRandom(60,120).toFixed(0);
		this.ASAT =  this.getRandom(8,30).toFixed(0);
		this.ALAT = this.getRandom(8,30).toFixed(0);
		this.PAL = this.getRandom(80,200).toFixed(0);
		this.GGT = this.getRandom(8,30).toFixed(0);
		this.TSH = this.getRandom(0.5,3).toFixed(1);;
		this.protides = this.getRandom(50,70).toFixed(0);
		this.albumine = this.getRandom(30,50).toFixed(0);
		this.TP = this.getRandom(90,100).toFixed(0);
		this.TCA = this.getRandom(25,35).toFixed(0);
		this.INR = this.getRandom(0.9,1.2).toFixed(1);
		this.BNP = this.getRandom(50,200).toFixed(0);
		this.DD = this.getRandom(50,200).toFixed(0);;
		this.troponine = 0;
		this.bHCG = 0;
		
		this.IAO = "Pas de note de l'IAO";
		this.ATCD = "Aucun";
		this.Habitus = "Célibataire et je vis seul. Ni tabac ni alcool. Revenus suffisants. Je suis autonome.";
		this.Traitements = "Je ne prend aucun traitement";
		this.Motif = "Default";
		this.Douleur = "Default";
		this.Hdlm = "Mon histoire vous la connaissez"
		this.AEG = "Je suis en forme, je mange bien et mon poids est stable.";
		this.Neuro = "Glasgow 15, pas de céphalées, pas de sd méningé. Pas de deficit sensitivo-moteur central ni périphérique. ROTS symétriques en \
		haut et en bas. Pas d'ataxie ni trouble de la marche. Pas de dysmétrie. ";
		this.ORL = "Pas de rhinite, bouche saine et propre. Pas d'angine ni pharyngite. Pas de voix laryngée. Pas d'ADP cervicales. Sinus non sensibles";
		this.Cardio = "Pas de signe d'hypoperfusion periphérique, pas de dyspnée, pas de douleur thoracique, pas de malaise récents.\
		Pas d'oedemes des membres inférieurs ni de turgenscence jugulaire ou de reflux hépato-jugulaire. pas de crépitants des bases. Rythme régulier, \
		sans soufle. Axes vasculaires des TSA et abdo-illiaques normaux à l'auscultation, pas de masse battante abdominale.";
		this.Pneumo = "Pas de toux, pas de dyspnée, pas de cyanose. Auscultation pulmonaire sans particularité. ";
		this.Abdo = "Pas de trouble du transit. Pas de nausées vomissments. Abdomen souple depressible et indolore. Bruits perçus. Pas de Murphy.\
		Pas d'organomégalie. Pas de circulation collatérale, pas d'angiomes stellaires, pas de matité sus pubienne, fosses lombaires indolores.";
		this.UroGyneco = "Pas de signes fonctionels urinaires. Pas de saignements. Pas de plaintes.";
		this.OrthoRhumato = "Pas de douleur spontanée ni à la palpation des reliefs osseux du corps entier. Articulation non douloureuses, non gonflées. ";
		
			
		this.onATCD = function(){
			this.addobserv(this.ATCD);
		}
		this.onHabitus = function(){
			this.addobserv(this.Habitus);
		}
		this.onTraitements = function(){
			this.addobserv(this.Traitements);
		}
		this.onMotif = function(){
			this.addobserv(this.Motif);
		}
		this.onHdlm = function(){
			this.addobserv(this.Hdlm);
		}
		this.onDouleur = function(){
			this.addobserv(this.Douleur);
		}
		this.onAEG = function(){
			this.addobserv(this.AEG);
		}
		this.onNeuro = function(){
			this.addobserv(this.Neuro);
		}
		this.onORL = function(){
			this.addobserv(this.ORL);
		}
		this.onCardio = function(){
			this.addobserv(this.Cardio);
		}
		this.onPneumo = function(){
			this.addobserv(this.Pneumo);
		}
		this.onNeuro = function(){
			this.addobserv(this.Neuro);
		}
		this.onAbdo = function(){
			this.addobserv(this.Abdo);
		}
		this.onUroGyneco= function(){
			this.addobserv(this.UroGyneco);
		}
		this.onOrthoRhumato = function(){
			this.addobserv(this.OrthoRhumato);
		}
	

		//Fonctions standards
		this.onBio = function(bio) { 
		var me = this;
		//bio = [nfs,crp...]
		var factor = 1;
		var demande = "";

		for (var i=0;i<bio.length;i++){
			switch (bio[i]){
				case "nfs":
					demande +="NFS :\nHb = " + this.hb + "g/dL\nPNN = " + this.PNN + "g/mL\nLymphocytes = " + this.lympho + "g/mL\nPlaquettes = " + this.plaq + "g/mL\n";
					factor += 0.2;
				break;
				case "iono":
					demande +="Ionogramme :\nNa = " + this.na + "mmol/mL\nK = " + this.k + "mmol/mL\nCl = " + this.cl + "mmol/ml\nHCO3- = " + this.hco3 + "mmol/mL\n";
					factor += 0.2;
				break;
				case "crp":
					demande +="CRP = " + this.CRP + "mmol/L";
					factor += 0.2;
				break;
				case "hemostase":
					demande +="TP = " + this.TP + "%\nTCA = " + this.TCA + "s\nINR = " + this.INR + "\n";
					factor += 0.2;
				break;
				case "fhepatique":
					demande +="Fonction hépatique : \nASAT = " + this.ASAT + "UI\nALAT = " + this.ALAT + "UI\nPAL = " + this.PAL + "UI/L\nGGT = " + this.GGT + "UI/L\n";
					factor += 0.1;
				break;
				case "frenale":
					demande +="Fonction rénale :\nCréatinine = " + this.creat + "umol/L\nUrée = " + this.uree + "mmol/L\nClairance = " + this.clairance + "ml/min\n";
					factor += 0.1;
				break;
				case "glycemie":
					demande +="Glycémie = " + this.glycemie + "mmol/L\n";
					factor += 0.1;
				break;
				case "troponine":
					demande +="Troponine = " + this.troponine + "ng/mL\n";
					factor += 0.1;
				break;
				case "ddimeres":
					demande +="D-Dimères = " + this.DD + "ug/L\n";
					factor += 0.1;
				break;
				case "bnp":
					demande +="BNP = " + this.BNP + "ug/L\n";
					factor += 0.1;
				break;
				case "bhcg":
					demande +="bHCG = " + this.bHCG+ "ug/L\n";
					factor += 0.1;
				break;
				case "tsh":
					demande +="TSH= " + this.TSH + "ng/L\n";
					factor += 0.1;
				break;
				}
			}
			this.addresult(demande,factor);
		this.popup("Nouveaux resultats disponibles");
		}
		
		
	/*	this.onRadio = function() { 	
			
		}
		this.onEcho = function(){
			
		}
		this.onTDM = function(){
			
		}*/
		
		this.addImagerie = function(src,cr,factor){
			var selfBox = this.box;
			var me = this;
			selfBox.addClass('cooling');
            selfBox.removeClass('selected');
			selfBox.removeClass('selectable');
			selfBox.draggable("disable");
            selfBox.find('.popupContainer').hide();
	
			//Enclenche le cooldown selon le factor temps demandé.
            if (factor === undefined) {
                factor = 0.1;
            }

            var time = factor * this.cooldownTime;
            this.cooldownAnimation(time);
			setTimeout(function() {
				me.resultImg.push(src);
				me.resultImgCR.push(cr);
				if(!($('.selected').length)){
					selfBox.toggleClass('selected');
					selfBox.draggable("enable");
					me.refreshtabs_fonction(me.box);
				}
	            selfBox.removeClass('cooling');
				selfBox.addClass('selectable');
				
				console.log("addIMG(" + factor + "): " + src + "\n" + cr);
            }, time * 1000);
            //this.onAddResultFn(text, this.resultText);	
		}
	
			
	


        /*this.onAddResult = function(onAddResultFn) {
            this.onAddResultFn = onAddResultFn;
        }*/


        this.addresult = function(text,factor) {
			var selfBox = this.box;
			var me = this;
			selfBox.addClass('cooling');
            selfBox.removeClass('selected');
			selfBox.removeClass('selectable');
			selfBox.draggable("disable");
            selfBox.find('.popupContainer').hide();
	
			//Enclenche le cooldown selon le factor temps demandé.
            if (factor === undefined) {
                factor = 1;
            }
			
            var time = factor * this.cooldownTime;
            this.cooldownAnimation(time);
            setTimeout(function() {
				me.resultText = me.resultText + text + "\n"; 
				if(!($('.selected').length)){
					selfBox.toggleClass('selected');
					selfBox.draggable("enable");
					me.refreshtabs_fonction(me.box);
				}
	            selfBox.removeClass('cooling');
				selfBox.addClass('selectable');
				console.log("addresult(" + factor + "s) :" + text);
            }, time * 1000);
            //this.onAddResultFn(text, this.resultText);

        }
		//Méthode groupée avec le cooldown
        this.addobserv= function(text,factor) {
			var selfBox = this.box;
			var me = this;
			selfBox.addClass('cooling');
            selfBox.removeClass('selected');
			selfBox.removeClass('selectable');
			selfBox.draggable("disable");
            selfBox.find('.popupContainer').hide();
	
			//Enclenche le cooldown selon le factor temps demandé.
            if (factor === undefined) {
                factor = 1;
            }

            var time = factor * this.cooldownTime;
            this.cooldownAnimation(time);
			setTimeout(function() {
				me.observText = me.observText + text + "\n"; 
				if(!($('.selected').length)){
					selfBox.toggleClass('selected');
					selfBox.draggable("enable");
					me.refreshtabs_fonction(me.box);
				}
	            selfBox.removeClass('cooling');
				selfBox.addClass('selectable');
				console.log("addresult(" + factor + " cooldown : " + text);
            }, time * 1000);
            //this.onAddResultFn(text, this.resultText);
        }

        this.addlog = function(text) {
            this.logText = this.logText + "<" + this.patientName + ">" + " (" + u.time() + ") " + text + "\n";
			console.log(this.logText);
        }

    }

    return Patient;

});