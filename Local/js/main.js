requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: 'lib/jquery-3.1.1.min',
        progressbar: 'lib/progressbar'
    }
});
///////////////////////////////////////////////////////////////////////////
require([
    'app',
    'patient.4',
    'patient.2',
	'patient.3',
	'patient.1'
], function(app, p4,p2,p1,p3) {
    app.registerPatient(p4);
    app.registerPatient(p2);
	app.registerPatient(p3);
	app.registerPatient(p1);
    app.init();
});