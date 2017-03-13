define([
    'jquery',
    'patient',
    'utils'
], function($, Patient, u) {
    'use strict';

    const myCustomPatient = new Patient('patient3(scaphoide)', 100, 'img/p3.jpg', { "A1": "Interroger", "A2": "Examiner", "A3": "Imagerie" });

    //further modifications...
    
    var excli1 = "Pas d’œdème, pas d’hématome, pas de douleur à la palpation des reliefs osseux.  Douleur en flexion et extension. ";
    var excli2 = "La tabatière anatomique est modérément douloureuse.";
    var excli3 = " Après 1g de paracétamol le patient n’a plus mal.";
    var interro1 = "Je suis tombé en forêt ce matin. Je me suis réceptionné sur le poignet en extension.";
    var interro2 = "Je n’ai pas très mal mais c’est ma copine qui m’a dit de venir. Je n’ai pas mal ailleurs.";
    var img1 = "Radiographie du poignet de face : absence de lésions osseuse visible.";
    var img2 = "Radiographie du poignet de trois quarts : doute sur une fracture du scaphoïde. A confirmer par un TDM.";
    var img3 = "TDM : Fracture du scaphoïde.";
    //accueil IDE : 
    myCustomPatient.resultText = u.time() + "Accueil IDE : 34 ans, trauma poignet\n\n \
	Dossier : aucun ATCD, pas de traitement.\n\n";
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
					this.currentA2 += 1;
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
                    this.cooldown(2);
                    this.popup("Nouveau résultat disponible");
                    this.addresult(img1);
                    this.addlog("img1");
                    this.resultImg.push('img/scaph_face_aretoucher.png');
                    this.currentA3 += 1;
                    break;
                case 1:
                    this.cooldown(2);
                    this.popup("Nouveau résultat disponible");
                    this.currentA3 += 1;
                    this.addresult(img2);
                    this.resultImg.push('img/scaph_34.png');
                    this.addlog("img2");
                    break;
                case 2:
                    this.cooldown(3);
                    this.popup("Nouveau résultat disponible");
                    this.resultImg.push('img/scaph_TDM.png');
                    this.addresult(img3);
                    this.addlog("img3");
                    this.currentA3 += 1;
                    this.bonneReponse = true; //Critere de jugement principal de ce cas.
                    //this.aActions.a3 = { "A3": "Imagerie" };
                    break;
                case 3: //Cul de sac, on incrémente pas.
                    this.popup("Rien de plus...");
                    this.addlog("imagerie suppplémentaire non disponible");
                    break;
                default:
                    console.log('erreur : default value reached dans ONA3');
                    this.addlog("erreur : default value dans ONA3");
            }
        }
    }
    return myCustomPatient;

});