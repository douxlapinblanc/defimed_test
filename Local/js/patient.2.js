define([
    'jquery',
    'patient',
    'utils'
], function($, Patient, u) {
    'use strict';

    const myCustomPatient = new Patient('patient2(psyEp))', 100, 'img/p2.png', { "A1": "Examiner", "A2": "Biologie", "A3": "Imagerie" });


    //further modifications...
    var excli1 = "Je ne me sent pas bien ici !! Je veux rentrer !! Ils m’ont amené ici je ne sais pas pourquoi !";
    var excli2 = "Agitation psycho-motrice. Examen difficile. Auscultation cardio-pulmonaire sans particularité.\
	Pas de foyer de crépitant. Abdomen pléthorique mais souple. ";
    var excli3 = "Les infirmieres viennent vous voir car la patiente les insulte. D'ailleurs elle ne veut plus vous voir";
    var img1 = "Compte rendu Angioscanner : Embolie pulmonaire proximale bilatérale. Cavités droites augmentées de volume.";

	
	
    //accueil IDE : 
    myCustomPatient.observText = "\
	Entrée box : " + u.time() + " \n\
	IAO :\n\
	19ans, psy +++crise d’angoisse. T 37.8, PA 140/60 ,sat 96%, FC 107\n\n \
	Antécédents : ? \n\
	Traitements : Leelo, Xanax \n\n";

	myCustomPatient.resultImg.push('img/p2_courrier.png');
	
    //Actions du joueur,
	myCustomPatient.onB1 = function() { 
	this.close();
	}
    myCustomPatient.onA1 = function() {
        switch (this.currentA1) {
            case 0:
                this.cooldown();
                this.popup(excli1);
                this.addresult(excli1);
                this.addlog("excli1");
                this.currentA1 += 1;
                break;
            case 1:
                this.cooldown();
                this.popup(excli2);
                this.currentA1 += 1;
                this.addresult(excli2);
                this.addlog("excli2");
                break;
            case 2:
                this.cooldown();
                this.popup(excli3);
                this.currentA1 += 1;
                this.addresult(excli3);
                this.addlog("excli3");
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
                this.cooldown(2);
				this.resultImg.push('img/ep_bio1.png');
                this.popup("Nouveau résultat disponible");
                this.addlog("bio1");
                this.currentA2 += 1;
                break;
            case 1:
                this.cooldown(2);
				this.resultImg.push('img/ep_bio2.png');
                this.popup("Nouveau résultat disponible");
                this.addlog("bio2");
                this.currentA2 += 1;
				this.currentA3 = 1;//On saute directement a l'angioTDM pour les imageries sur A3.*
				this.aActions.a3 = "AngioTDM(3)"; //Propose l'angioTDM dans le menu.
                break;
            case 2: //Cul de sac, on incrémente pas.
                this.popup("Rien de plus...");
                this.addlog("Biologie suplémentaire non disponible");
                break;
            default:
                console.log('erreur : default value reached dans ONA2');
                this.addlog("erreur : default value dans ONA2");
        }
    }
    myCustomPatient.onA3 = function() {
        switch (this.currentA3) {
            case 0:
                this.cooldown(2);
				this.resultImg.push('img/ep_rxt.png');
                this.popup("Nouveau résultat disponible");
                this.addlog("RxT");
                this.currentA3 = 2;//bloque l'acces a TDM si on a pas le Gaz
				this.aActions.a3 = "Imagerie"; //Default
                break;
            case 1:
                this.cooldown(3);
				this.resultImg.push('img/ep_angiotdm.png');
                this.popup("Nouveau résultat disponible");
                this.currentA3 += 1;
                this.addresult(img1);
                this.addlog("angioTDM");
                break;
            case 2: //Cul de sac, on incrémente pas.
                this.popup("Rien de plus...");
                this.addlog("imagerie suplémentaire non disponible");
                break;
            default:
                console.log('erreur : default value reached dans ONA3');
                this.addlog("erreur : default value dans ONA3");
        }
    }

    return myCustomPatient;

});