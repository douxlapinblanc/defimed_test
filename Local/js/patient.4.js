define([
    'jquery',
    'patient',
    'utils'
], function($, Patient, u) {
    'use strict';

    const myCustomPatient = new Patient('patient4(meningite))', 100, 'img/p4.jpg', { "A1": "Interroger", "A2": "Examiner", "A3": "Biologie" });


    //further modifications...
	var interro1 = "Je suis clouée au lit depuis 3 jours. On a du m'arrêter. Tout le monde à la grippe au boulot.";
	var interro2 = "J’ai la migraine aussi et ca ne cesse pas. Je prend du doliprane. J’ai froid.";
	var interro3 = "Non je ne tousse pas. J’ai juste mal à la tête.";
    var excli1 = "Gorge saine, pas d’adénopathie cervicales. Aspect de rhinite. Sinus non douloureux.";
    var excli2 = " Auscultation cardio-pulmonaire normale.";
    var excli3 = "Nuque raide sans irritation pyramidale. Patiente devenant somnolente.";
    var PL = "Résultat de la ponction lombaire :\nliquide citrin\n456 éléments\n90% de lymphocytes\nHématies 1\nGlycorrachie 0.5g/l\nprotéinorachie 2g/l";

	myCustomPatient.hasbio = false;
	myCustomPatient.suspicion = false;
	
    //accueil IDE : 
    myCustomPatient.resultText = "\
	...........................................................................\n\n\
	Entrée box : " + u.time() + " \n\
	...........................................................................\n\n\
	Note de l'infirmiere d'accueil :\n\
	Suspicion grippe. T 39°C , FC 110, PA 14/8, sat 99%\n\n \
	...........................................................................\n\n\
	Antécédents : ? \n\
	Traitements : doliprane\n\n\
	...........................................................................\n\n";
	//myCustomPatient.resultImg.push('img/p2_courrier.png');
	
    //Actions du joueur,
	myCustomPatient.onB1 = function() { 
	this.close();
	}
    myCustomPatient.onA1 = function() {
        switch (this.currentA1) {
            case 0:
                this.cooldown();
                this.popup(interro1);
                this.addresult(interro1);
                this.addlog("interro1");
                this.currentA1 += 1;
                break;
            case 1:
                this.cooldown();
                this.popup(interro2);
                this.currentA1 += 1;
                this.addresult(interro2);
                this.addlog("interro2");
                break;
            case 2:
                this.cooldown();
                this.popup(interro3);
                this.currentA1 += 1;
                this.addresult(interro3);
                this.addlog("interro3");
                break;
            case 3: //Cul de sac, on incrémente pas.
                this.popup("Rien de plus...");
                this.addlog("Interrogatoire suplémentaire non disponible")
                break;
            default:
                console.log('erreur : default value reached dans ONA3');
                this.addlog("erreur : default value dans ONA3");
        }
    }
    myCustomPatient.onA2 = function() {
        switch (this.currentA2) {
            case 0:
                this.cooldown();
                this.popup(excli1);
                this.addresult(excli1);
                this.addlog("excli1");
                this.currentA2 += 1;
                break;
            case 1:
                this.cooldown();
                this.popup(excli2);
                this.currentA2 += 1;
                this.addresult(excli2);
                this.addlog("excli2");

                break;
			case 2:
                this.cooldown();
                this.popup(excli3);
                this.currentA2 += 1;
                this.addresult(excli3);
                this.addlog("excli3");
				this.suspicion = true;// suspecte la méningite
				if (this.hasbio == true) {
					this.aActions.A3 = "PL";//Maintenant propose PL a la place de la bio si deja faite
				} 
                break;
            case 3: //Cul de sac, on incrémente pas.
                this.popup("Rien de plus...");
                this.addlog("ExCli suplémentaire non disponible")
                break;
            default:
                console.log('erreur : default value reached dans ONA3');
                this.addlog("erreur : default value dans ONA3");
        }
    }
    myCustomPatient.onA3 = function() {
				if ((this.suspicion === true) && (this.hasbio === true)){
				//PL
					this.cooldown(2);
					this.popup(PL);
					this.addresult(PL);
					this.addlog("PL");
					this.bonneReponse = true;
					return true;
				}
				if ((this.suspicion === true) && (this.hasbio === false)){
				//afficher la bio
                this.cooldown(2);
				this.resultImg.push('img/p4_bio.png');
                this.popup("Nouveau résultat disponible");
                this.addlog("bio");
				this.aActions.A3 = "PL";
				return true;
				}
				if ((this.suspicion === false) && (this.hasbio === true)){
				//rien de plus
					this.popup("Rien de plus...");
					this.addlog("Bio supplémentaire non disponible")
					return true;					
					
				}
				if ((this.suspicion === false) && (this.hasbio === false)){
				//afficher la bio sans proposer la PL
                this.cooldown(2);
				this.resultImg.push('img/p4_bio.png');
                this.popup("Nouveau résultat disponible");
                this.addlog("bio");
				this.hasbio = true;
				return true;
				}


    }

    return myCustomPatient;

});