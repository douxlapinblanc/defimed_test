define([
    'jquery',
    'patient',
    'utils'
], function($, Patient, u) {
    'use strict';

    const myCustomPatient = new Patient('patient1(sqc)', 100, 'img/p1.jpg', { "A1": "Interroger", "A2": "Examiner", "A3": "Imagerie" });

    //further modifications...
    
    var excli1 = "Abdomen souple et depressible, non douloureux. Les bruits hydroaériques sont perçus. Pas d'organomégalie.  Discrète matité sus pubienne, la percussion donne au patient envie d'uriner. Glycémie capilaire 1,2g/l. ";
    var excli2 = "Pas de deficit moteur périphérique. Hypoesthésie de la face posterieure des jambes et des cuisses. ROT rotuliens présents achileens absents. Paires craniennes normales.";
    var excli3 = "Douleur lombaire basse, avec point exquis sur deux épineuses. Le reste de l'examen est normal.";
    var interro1 = "Je suis constipé depuis 4 jours, j'ai mangé des fibres et bu beaucoup d'eau mais ça n'y fait rien. Pouvez vous me prescrire un laxatif docteur ?";
    var interro2 = "J'ai mal dans le bas du dos et le bas du ventren, et parfois ca me donne des fourmis dans les jambes. ";
    var traitement1 = "Après sondage urinaire, il y à 700cc d'urines";
    var bio1 = "NFS .....................  normale\nCRP .............................. normale\nglycémie..............................1,6g/L\nHba1c ................................ 9%\n ionogramme ..........................  normal";
    var img1 = "ASP\n Pas de niveaux hydro aériques. pas de pneumo-péritoine. ";// Non donné
    var img2 = "Compte rendu d'échographie Abdominale \nBeaucoup d'air empêchant la visualisation. Reins tailles normales bien diférenciés. \
	Aorte de diametre normale. Foie et rate normaux. Epanchement péritonéale de faible quantité dans le cul de sac de Douglas";
    var img3 = "IRM médullaire\n : Syndrome de la queue de cheval sur probable hernie discale";
    //accueil IDE : 
    myCustomPatient.resultText = "\
	...........................................................................\n\n\
	Entrée box : " + u.time() + " \n\
	...........................................................................\n\n\
	Note de l'infirmiere d'accueil :\n\
	Homme 55ans diabete constipation depuis 4j\n PA 12/8, FC 80, T=37,5\n\n \
	...........................................................................\n\n\
	Antécédents : DNID depuis 10 ans\
	Traitements : Metformine, Kardegic 75 \n\n\
	...........................................................................\n\n";
    //Actions du joueur

	myCustomPatient.onB1 = function() { 
	this.close();
	}
    myCustomPatient.patientInit = function() {
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
                case 2: //Cul de sac, on incrémente pas.
                    this.popup("Rien de plus...");
                    this.addlog("Interrogatoire suppplémentaire non disponnible")
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
                    //this.aActions.A3 = "test";
                    break;
                case 1:
                    this.cooldown();
                    this.popup(excli2);
                    this.currentA2 += 1;
                    this.addresult(excli2);
                    this.addlog("excli2");
                    this.currentA3 = 3; //sauter directement à l'IRM pour A3
                    this.aActions.a3 = "IRM médullaire"; //Propose l'IRM dans le menu.
                    break;
                case 2:
                    this.cooldown();
                    this.popup(excli3);
                    this.currentA2 += 1;
                    this.addresult(excli3);
                    this.addlog("excli3");
                    break;
                case 3: //Cul de sac, on incrémente pas.
                    this.popup("Rien de plus...");
                    this.addlog("examen clinique suppplémentaire non disponnible");
                    break;
                default:
                    console.log('erreur : default value reached dans ONA2');
                    this.addlog("erreur : default value dans ONA2");
            }
        }
        myCustomPatient.onA3 = function() {
            switch (this.currentA3) {
                case 0:
                    this.cooldown(3);
					this.resultImg.push('img/p1_asp.png');
                    this.popup("Nouveau résultat disponible");
                    //this.addresult(img1);
                    this.addlog("asp");
                    this.currentA3 += 1;
					this.aActions.A3 = "écho abdo";
                    break;
                case 1:
                    this.cooldown(3);
                    this.popup("Nouveau résultat disponible");
                    this.currentA3 += 1;
                    this.addresult(img2);
                    this.addlog("echographie abdominale");
                    break;
                case 2: //Cul de sac, on incrémente pas.
                    this.popup("Rien de plus...");
                    this.addlog("imagerie suppplémentaire non disponible");
                    break;
                case 3:
                    this.cooldown(6);
                    this.popup("Nouveau résultat disponible");
                    this.resultImg.push('img/IRM.jpg');
                    this.addresult(img3);
                    this.addlog("img3");
                    this.currentA3 += 1;
                    this.bonneReponse = true; //Critere de jugement principal de ce cas.
                    this.aActions.a3 = { "A3": "" };
                    break;
                case 4: //Cul de sac, on incrémente pas.
                    this.popup("Rien de plus...");
                    this.addlog("imagerie suppplémentaire non disponnible");
                    break;
                default:
                    console.log('erreur : default value reached dans ONA3');
                    this.addlog("erreur : default value dans ONA3");
            }
        }
    }
    return myCustomPatient;

});