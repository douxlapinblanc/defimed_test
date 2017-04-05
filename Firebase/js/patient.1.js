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
    myCustomPatient.observText = "\
	Entrée box : " + u.time() + " \n\
	IAO :\n\
	Homme 55ans diabete constipation depuis 4j\n PA 12/8, FC 80, T=37,5\n\n \
	Antécédents : DNID depuis 10 ans\n\
	Traitements : Metformine, Kardegic 75 \n\n";
    //Actions du joueur

	//Fonction standard
	myCustomPatient.onBio = function(bio) { 
	var me = this;
	//bio = [nfs,crp...]
	var factor = 1;
	var demande = "";

	for (var i=0;i<bio.length;i++){
		switch (bio[i]){
			case "nfs":
				a ="NFS :\nHb = " + this.hb + "g/dL\nPNN = " + this.PNN + "g/mL\nLymphocytes = " + this.lympho + "g/mL\nPlaquettes = " + this.plaq + "g/mL\n";
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
	
myCustomPatient.onATCD = function(){
	this.addobserv(this.ATCD);
}
myCustomPatient.onHabitus = function(){
	this.addobserv(this.Habitus);
}
myCustomPatient.onTraitements = function(){
	this.addobserv(this.Traitements);
}
myCustomPatient.onMotif = function(){
	this.addobserv(this.Motif);
}
myCustomPatient.onDouleur = function(){
	this.addobserv(this.Douleur);
}
myCustomPatient.onAEG = function(){
	this.addobserv(this.AEG);
}
myCustomPatient.onNeuro = function(){
	this.addobserv(this.Neuro);
}
myCustomPatient.onORL = function(){
	this.addobserv(this.ORL);
}
myCustomPatient.onCardio = function(){
	this.addobserv(this.Cardio);
}
myCustomPatient.onPneumo = function(){
	this.addobserv(this.Pneumo);
}
myCustomPatient.onNeuro = function(){
	this.addobserv(this.Neuro);
}
myCustomPatient.onAbdo = function(){
	this.addobserv(this.Abdo);
}
myCustomPatient.onUroGyneco= function(){
	this.addobserv(this.UroGyneco);
}
myCustomPatient.onOrthoRhumato = function(){
	this.addobserv(this.OrthoRhumato);
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